# 报销单 AI 报表查询实施方案

## 1. 目标与结论

本文档用于定义 Web 端“AI 报表查询”正式版的实现方案。该能力的输入来自报销单查询结果，正式版必须基于**当前查询条件下的全部命中结果**生成右侧抽屉报表，而不是基于分页第一页数据。

本方案采用如下原则：

- 基础汇总值由前端或后端确定性计算：`报销单笔数`、`报销总金额`
- LLM 负责推理“应该按什么维度分析、适合什么图表、如何生成简报”
- Java 后端负责基于 LLM 的推理结果做**重算、校验、过滤、降级**
- 前端只渲染通过后端校验的白名单图表协议，不直接消费模型自由输出

一句话定版：

> LLM 决定图表语义，Java 产出图表数值。

---

## 2. 背景约束

### 2.1 数据来源

未来正式版中，查询列表数据由前端通过 GQL 实时返回。当前用于分析字段格式的样例文件为：

- [报销单的第一页数据.json](/Users/zhouhao/Documents/AI_APP/03-AICFO/Data/报销单的第一页数据.json)

该 JSON 只用于说明报销单明细的字段结构，**不等同于当前视觉 Demo 的业务数据**。

### 2.2 为什么不能只靠固定 SQL 聚合

报销单查询场景里，用户关注的价值维度经常来自半结构化文本，尤其是：

- `description` 报销事由
- `remark` 备注
- `budgetItem` 预算项
- 查询条件组合

仅靠固定分组维度做聚合，通常只能得到：

- 按状态分布
- 按部门分布
- 按日期趋势

这类报表可用，但分析价值有限。更高价值的图表需要先理解事由语义，例如：

- 这是水费、电费、办公支出还是差旅
- 是否可识别校区、项目、供应商类型
- 应该按时间看趋势，还是按分类看结构

因此需要引入 LLM 做语义推理。

### 2.3 为什么不能让 LLM 直接生成最终金额图表

如果让 LLM 直接从原始明细生成最终图表 JSON，会有以下风险：

- 可能脑补不存在的字段或业务维度
- 可能算错金额、占比、总和
- 可能输出不符合前端协议的 JSON
- 财务场景缺乏可审计性，无法说明图表数值来源

所以正式版必须采用“LLM 推理 + Java 重算”的双阶段模式。

---

## 3. 总体架构

### 3.1 交互链路

1. 用户在 Web 端输入筛选条件并发起查询
2. 前端获取列表分页数据用于表格展示
3. 用户点击“生成 AI 报表”
4. 前端向后端提交当前查询条件 `filters`
5. 后端重新查询**全部命中结果**
6. 后端先计算基础指标：
   - 报销单笔数
   - 报销总金额
7. 后端将精简后的关键字段送入 LLM，请其返回：
   - 推荐分析维度
   - 推荐图表类型
   - 图表分组语义
   - 图表标题/说明
   - AI 解读简报
8. Java 后端根据 LLM 返回的分析维度重新执行确定性聚合
9. Java 对结果做一致性校验、字段白名单校验、维度存在性校验
10. 后端返回前端标准化图表 JSON
11. 前端渲染右侧抽屉

### 3.2 职责边界

#### 前端

- 展示列表
- 发起 AI 报表请求
- 展示基础指标和右侧图表
- 处理加载态、降级态、失败态

#### Java 后端

- 统一权限校验
- 查询全部命中结果
- 脱敏与字段白名单控制
- 组装 Prompt
- 调用 LLM
- 按 LLM 推理结果做重算
- 校验并返回前端协议
- 记录日志与审计

#### LLM

- 理解报销事由语义
- 判断适合的分析维度和图表类型
- 生成简洁可读的分析结论

---

## 4. 数据与字段设计

### 4.1 原始字段候选

建议后端从原始报销单明细中提取以下字段参与 AI 报表分析：

- `code`
- `applyDate`
- `amount`
- `actual`
- `statusId_show`
- `departmentId_show`
- `applyUserId_show`
- `description`
- `remark`
- `paySettingId_show`
- `reimburseItems[].budgetItem.name`
- 当前 `filters`

### 4.2 不建议直接发送给 LLM 的字段

以下字段应默认不进入模型输入：

- `payeeBankAccount`
- `payeeBank`
- 完整收款账户信息
- 敏感供应商标识
- 附件内容原文
- 其他个人敏感信息

若业务确实需要用到供应商维度，建议只发送经过脱敏的供应商类别，而不是完整名称。

### 4.3 后端给 LLM 的精简输入结构

建议 Java 在调用 LLM 前，将查询结果整理为如下结构：

```json
{
  "query": {
    "filters": {
      "status": "已核销",
      "dateRange": "2026-01-01~2026-03-31"
    },
    "totalCount": 128,
    "totalAmount": 60304
  },
  "rows": [
    {
      "code": "RI-20260313-0004",
      "applyDate": "2026-03-13",
      "amount": 8115,
      "status": "审批中",
      "department": "人事部",
      "applicant": "管老师_1",
      "description": "事项验收一起选的",
      "remark": "无",
      "paySetting": "财务转账",
      "budgetItems": ["办公费"]
    }
  ]
}
```

---

## 5. 推荐的双阶段推理模式

### 5.1 方案总述

推荐使用以下实现方式：

#### 阶段 A：LLM 只输出“图表语义提议”

LLM 输出内容包括：

- 建议使用什么图表：`bar / line / pie`
- 按什么维度分组：例如 `apply_date_day`、`semantic_topic`、`pay_setting`
- 指标是什么：例如 `sum(amount)`、`count(code)`
- 该图为什么适合当前数据
- 100 字左右的解读简报

#### 阶段 B：Java 根据提议重新聚合

Java 后端根据 LLM 输出的：

- 维度
- 指标
- 分组方式

重新从全部命中结果中进行确定性聚合，产出最终图表数据。

### 5.2 不推荐的方式

不建议采用：

- LLM 直接输出最终金额数组
- Java 只做 JSON 格式校验

这会导致数值不可审计，且存在明显幻觉风险。

---

## 6. LLM 输出协议设计

### 6.1 语义提议协议

建议 LLM 先输出如下固定协议：

```json
{
  "recommendedChart": {
    "chartType": "bar",
    "dimension": "apply_date_day",
    "metric": "sum(amount)",
    "title": "按日报销金额趋势",
    "reason": "当前查询结果集中在连续日期上，适合用柱状图观察金额高低差异。"
  },
  "alternatives": [
    {
      "chartType": "pie",
      "dimension": "pay_setting",
      "metric": "sum(amount)",
      "title": "按支付方式金额占比"
    }
  ],
  "insight": {
    "summary": "本次查询共 128 笔，合计 60304 元，金额主要集中在 2 月，建议重点关注异常波动月份。",
    "confidence": 0.84
  }
}
```

### 6.2 允许的维度白名单

后端只接受以下维度，避免模型自由发明：

- `apply_date_day`
- `apply_date_month`
- `department`
- `status`
- `pay_setting`
- `budget_item`
- `semantic_topic`
- `semantic_subtopic`
- `applicant`

如果未来要支持：

- 校区
- 项目
- 供应商类型

也必须先通过后端可识别的实体抽取流程，才能纳入白名单。

### 6.3 允许的指标白名单

- `sum(amount)`
- `sum(actual)`
- `count(code)`

正式版第一期建议只开放：

- `sum(amount)`
- `count(code)`

---

## 7. Java 后端重算与校验策略

### 7.1 重算原则

Java 后端不信任 LLM 返回的最终数值，只信任：

- 图表类型建议
- 分组维度建议
- 指标建议
- 标题和解读文案

真正图表数据由 Java 基于原始命中结果重新聚合。

### 7.2 核心校验项

#### 1. 协议合法性校验

- `chartType` 必须在白名单中
- `dimension` 必须在白名单中
- `metric` 必须在白名单中
- `title`、`reason`、`summary` 长度受限

#### 2. 维度存在性校验

例如：

- 如果 `dimension=department`，则原始数据必须存在有效部门集合
- 如果 `dimension=semantic_topic`，则必须先完成语义分类

#### 3. 数值一致性校验

- 所有图表项之和应与基础汇总一致，或符合定义范围
- 饼图百分比应约等于 100%
- 折线图/柱状图长度必须与标签长度一致

#### 4. 可解释性校验

后端内部应保留：

- 本次图表采用的维度
- 每个分组的来源记录数
- 聚合规则
- 模型版本
- 置信度

### 7.3 失败时的降级策略

若出现以下任意情况，应触发降级：

- LLM 超时
- 输出 JSON 非法
- 输出维度不在白名单
- Java 重算失败
- 数值校验不通过

降级结果：

- 仍返回基础指标：笔数、总金额
- 返回一个默认基础图：
  - 可选 `按日期金额趋势`
  - 或 `按状态笔数分布`
- 解读回退成规则生成摘要

---

## 8. GraphQL 接口设计建议

### 8.1 查询接口

建议新增单独的 AI 报表查询接口，而不是复用列表分页接口。

```graphql
query ReimbursementAiReport($filter: ReimbursementFilterInput!) {
  reimbursementAiReport(filter: $filter) {
    requestId
    summaryMetrics {
      label
      value
    }
    recommendedChartId
    availableCharts {
      id
      type
      title
      unit
      labels
      series {
        name
        data
        color
      }
      data {
        name
        value
      }
    }
    insight {
      summary
      bullets
      confidence
      source
    }
    traceInfo {
      dimension
      metric
      generatedBy
      fallback
    }
  }
}
```

### 8.2 返回约束

- `summaryMetrics` 第一版只返回两个值：
  - `报销单笔数`
  - `报销总金额`
- `availableCharts` 至少返回 1 个图表
- `recommendedChartId` 必须命中 `availableCharts`
- `insight.source` 取值：
  - `llm`
  - `rule_fallback`

---

## 9. 前端渲染协议建议

### 9.1 前端不应直接解析模型原始输出

前端只消费后端整理后的标准协议，例如：

```ts
type ReimbursementAiReportResponse = {
  requestId: string;
  summaryMetrics: {
    label: string;
    value: string;
  }[];
  recommendedChartId: string;
  availableCharts: ChartSpec[];
  insight: {
    summary: string;
    bullets?: string[];
    confidence?: number;
    source: "llm" | "rule_fallback";
  };
  traceInfo?: {
    dimension: string;
    metric: string;
    generatedBy: string;
    fallback: boolean;
  };
};

type ChartSpec =
  | {
      id: string;
      type: "bar" | "line";
      title: string;
      unit?: string;
      labels: string[];
      series: { name: string; data: number[]; color?: string }[];
    }
  | {
      id: string;
      type: "pie";
      title: string;
      unit?: string;
      data: { name: string; value: number }[];
    };
```

### 9.2 右侧抽屉第一期展示建议

第一期建议 UI 内容固定为：

- 顶部标题与说明
- 两个基础汇总卡片
  - 报销单笔数
  - 报销总金额
- 一张推荐图表
- 一段 AI 解读
- 若后端返回多个图表，可允许前端 tab 切换

---

## 10. Prompt 模板建议

### 10.1 系统 Prompt

```text
你是财务数据分析专家。你的任务不是直接编造报表数字，而是从给定的查询结果中判断最适合的分析维度、图表类型和解读角度。你只能使用输入中明确存在或可稳定推断的维度，不允许虚构字段。
```

### 10.2 用户 Prompt 模板

```text
请基于以下报销单查询结果，为前端 AI 报表抽屉选择最合适的图表分析方式。

要求：
1. 只从以下白名单维度中选择：apply_date_day、apply_date_month、department、status、pay_setting、budget_item、semantic_topic、semantic_subtopic、applicant
2. 只从以下指标中选择：sum(amount)、count(code)
3. 返回 JSON，不要输出 markdown
4. 不要编造输入中不存在的维度
5. 如果无法稳定判断语义维度，请优先选择时间、状态、支付方式等显式维度

输入：
{{report_context_json}}
```

### 10.3 输出格式模板

```json
{
  "recommendedChart": {
    "chartType": "bar",
    "dimension": "apply_date_day",
    "metric": "sum(amount)",
    "title": "按日报销金额趋势",
    "reason": "当前数据主要集中在连续日期维度，适合用柱状图观察金额变化。"
  },
  "alternatives": [
    {
      "chartType": "pie",
      "dimension": "status",
      "metric": "count(code)",
      "title": "按状态的报销单占比"
    }
  ],
  "insight": {
    "summary": "本次查询结果金额主要集中在最近两天，审批中的单据占比高，建议优先关注高金额待流转单据。",
    "confidence": 0.82
  }
}
```

---

## 11. 性能设计

### 11.1 响应速度目标

- 列表分页查询：`< 800ms`
- 基础指标：`< 100ms`
- LLM 图表语义分析：`1s ~ 3s`
- 整体 AI 报表响应目标：`2s ~ 4s`

### 11.2 性能优化建议

- 基础指标与 LLM 分析并行
- 对 `orgId + userId + filterHash` 做短缓存
- LLM 只接收精简字段，不接收全部原始对象
- 单次命中量过大时进行分块或抽样
- 图表先返回推荐图，候选图可异步补全

### 11.3 大数据量场景处理

当命中结果超过阈值，例如 `500` 条时，建议：

- 后端先做粗筛与抽样
- 或先做规则聚合，供 LLM 在聚合摘要上做推理
- 避免将几千条明细直接发给模型

---

## 12. 安全与合规

### 12.1 调用方式

- 前端不直连 LLM
- 所有 LLM 请求统一由 Java 后端发起
- 模型密钥只保存在后端

### 12.2 数据最小化

- 只发送业务分析必要字段
- 默认不发送账户号、完整银行信息、附件内容
- 供应商名称可按业务决定是否脱敏

### 12.3 Prompt Injection 防护

由于 `description`、`remark` 属于用户输入文本，必须视为不可信数据。

处理方式：

- 统一包裹在结构化 JSON 中
- 系统 Prompt 明确指出这些内容是“待分析数据”，不是指令
- 严禁直接拼接为自由文本 Prompt

### 12.4 审计与追踪

后端应记录：

- requestId
- 查询条件摘要
- 命中记录数
- 使用模型版本
- Prompt 模板版本
- LLM 原始输出
- Java 校验结果
- 是否触发降级

---

## 13. 第一阶段实现建议

### 13.1 第一阶段范围

第一阶段仅实现：

- 右侧抽屉两张基础卡片：
  - 报销单笔数
  - 报销总金额
- 一张推荐图表
- 一段 AI 解读
- 失败降级能力

### 13.2 第一阶段支持的图表类型

- `bar`
- `line`
- `pie`

### 13.3 第一阶段支持的分组维度

- `apply_date_day`
- `apply_date_month`
- `status`
- `department`
- `pay_setting`
- `budget_item`

`semantic_topic` 和 `semantic_subtopic` 可以在第二阶段加入，前提是先完成稳定的文本语义归类链路。

---

## 14. 第二阶段演进建议

第二阶段可以逐步增强：

- 引入 `semantic_topic`、`semantic_subtopic`
- 支持多个候选图表切换
- 支持“推荐图表 + 备选图表”
- 支持 AI 解释为何选择该图
- 引入 embedding / 向量聚类增强主题识别
- 支持导出图表截图与汇报文案

---

## 15. 实施清单

### 前端

- 新增 AI 报表查询按钮与右侧抽屉
- 对接 `reimbursementAiReport` GQL
- 实现加载态、成功态、失败态
- 支持推荐图表渲染

### Java 后端

- 新增 AI 报表服务
- 新增报销单全量命中查询能力
- 实现字段脱敏与 Prompt 组装
- 实现 LLM 调用与超时处理
- 实现按维度的重算器与校验器
- 实现降级策略
- 接入缓存与日志

### 模型侧

- 固化 Prompt 模板
- 约束 JSON 输出
- 建立评测样本集
- 建立幻觉率和校验失败率监控

---

## 16. 最终建议

正式版建议按以下方式落地：

- 正式数据范围：当前查询条件下的**全部命中结果**
- 基础指标：由前端或后端直接计算
- 图表语义：由 LLM 推理
- 图表数值：由 Java 重算
- 解读摘要：由 LLM 生成，Java 做长度和内容校验
- 前端：只渲染标准协议结果

该方案能够在保证 AI 灵活性的同时，满足财务场景对正确性、可解释性、安全性和可审计性的要求。
