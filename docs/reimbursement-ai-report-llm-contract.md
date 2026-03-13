# 报销单 AI 报表查询 LLM 协议

## 1. 文档目的

本文档定义 Java 后端调用 LLM 时的输入输出协议，用于保证：

- 模型只负责“图表语义推理”和“文字解读”
- 图表数值仍由 Java 重算
- 模型输出可校验、可回退、可审计

---

## 2. 职责边界

### 2.1 LLM 负责

- 判断最适合的图表类型
- 判断最合适的分析维度
- 生成图表标题
- 给出推荐理由
- 生成 100 字左右的解读简报

### 2.2 LLM 不负责

- 直接输出最终可信金额统计结果
- 编造输入中不存在的维度
- 决定权限范围
- 返回前端自由渲染代码

---

## 3. 输入协议

### 3.1 后端传给 LLM 的上下文

后端将全部命中结果做字段裁剪和脱敏后，按结构化 JSON 输入给 LLM。

建议输入如下：

```json
{
  "query": {
    "filters": {
      "status": "已通过",
      "dateRange": "2026-01-01~2026-03-31",
      "keyword": "水费"
    },
    "totalCount": 5,
    "totalAmount": 58104
  },
  "fieldWhitelist": {
    "allowedDimensions": [
      "apply_date_day",
      "apply_date_month",
      "department",
      "status",
      "pay_setting",
      "budget_item",
      "semantic_topic",
      "semantic_subtopic",
      "applicant"
    ],
    "allowedMetrics": [
      "sum(amount)",
      "count(code)"
    ],
    "allowedChartTypes": [
      "bar",
      "line",
      "pie"
    ]
  },
  "rows": [
    {
      "code": "RI-20260306-0001",
      "applyDate": "2026-03-06",
      "amount": 3234,
      "status": "已通过",
      "department": "后勤部-后勤中学",
      "applicant": "姚喜",
      "description": "西校区3月份水费",
      "remark": null,
      "paySetting": "财务转账",
      "budgetItems": [
        "2.8.19城乡义务教育生均公用经费（区级初中）"
      ]
    }
  ]
}
```

---

## 4. 字段白名单

### 4.1 允许送给 LLM 的字段

- `code`
- `applyDate`
- `amount`
- `status`
- `department`
- `applicant`
- `description`
- `remark`
- `paySetting`
- `budgetItems`
- `filters`
- `totalCount`
- `totalAmount`

### 4.2 禁止送给 LLM 的字段

- 银行账号
- 开户行
- 完整收款账号信息
- 附件原文
- 非必要个人敏感信息

---

## 5. Prompt 设计

### 5.1 System Prompt

```text
你是财务数据分析专家。你的任务是根据给定的报销单查询结果，判断最适合的分析维度和图表类型，并生成简洁专业的分析摘要。你不能编造输入中不存在的维度，不能输出最终未校验的财务统计结果。请严格按约定 JSON 输出。
```

### 5.2 User Prompt 模板

```text
请基于以下报销单查询结果，推荐一个最适合在“AI报表查询”抽屉中展示的图表方案。

要求：
1. 只能从 allowedDimensions 中选择 dimension
2. 只能从 allowedMetrics 中选择 metric
3. 只能从 allowedChartTypes 中选择 chartType
4. 不要编造输入中不存在的维度
5. 如果语义维度不够稳定，请优先推荐显式维度，如时间、状态、支付方式、部门
6. 输出 JSON，不要输出 markdown

输入上下文：
{{report_context_json}}
```

---

## 6. 输出协议

### 6.1 标准输出结构

```json
{
  "recommendedChart": {
    "chartType": "line",
    "dimension": "apply_date_month",
    "metric": "sum(amount)",
    "title": "按月报销金额趋势",
    "reason": "当前结果具有清晰的时间序列特征，按月金额趋势更适合用于快速识别波动。"
  },
  "alternatives": [
    {
      "chartType": "pie",
      "dimension": "department",
      "metric": "count(code)",
      "title": "按部门的报销单占比"
    }
  ],
  "insight": {
    "summary": "本次查询金额主要集中在 1 月和 2 月，3 月明显下降，建议优先关注峰值月份的支出成因。",
    "confidence": 0.86
  }
}
```

### 6.2 字段定义

#### recommendedChart.chartType

允许值：

- `bar`
- `line`
- `pie`

#### recommendedChart.dimension

允许值：

- `apply_date_day`
- `apply_date_month`
- `department`
- `status`
- `pay_setting`
- `budget_item`
- `semantic_topic`
- `semantic_subtopic`
- `applicant`

#### recommendedChart.metric

允许值：

- `sum(amount)`
- `count(code)`

#### insight.summary

约束：

- 建议 80 到 140 字
- 只描述输入中可支持的结论
- 不要出现“建议导出 Excel 复核”之类的实现性语言

#### insight.confidence

约束：

- 数值范围为 `0 ~ 1`

---

## 7. Java 后端消费规则

后端收到 LLM 输出后，必须按以下流程处理：

1. JSON 解析
2. 字段白名单校验
3. `chartType` / `dimension` / `metric` 枚举校验
4. 维度可重算性校验
5. Java 重算生成 `availableCharts`
6. 若重算失败，则降级

后端不直接信任以下内容：

- 任何模型直接给出的金额数组
- 任何模型创造的图表值
- 输入中不存在的分组 label

---

## 8. 幻觉防护

### 8.1 常见风险

模型可能会：

- 把“后勤小学/后勤中学”脑补成“东校区/西校区”
- 把“预算项”脑补成“水费/电费类别”
- 把备注中的描述当作确定业务分类

### 8.2 防护策略

- 严格限制 `dimension` 白名单
- Java 重算时只使用后端可识别维度
- 若需支持 `semantic_topic`，必须引入独立语义分类链路
- 前端只渲染 Java 输出，不直接渲染模型原始结果

---

## 9. 降级策略

若出现以下情况：

- LLM 超时
- JSON 不合法
- 输出维度不在白名单
- 输出内容为空
- Java 无法重算

则后端直接回退到：

- 基础指标
- 默认图表：`apply_date_month + sum(amount)` 或 `status + count(code)`
- 规则摘要

---

## 10. 模型评估建议

建议后端开发阶段至少准备以下评测维度：

- 合法 JSON 输出率
- 白名单维度命中率
- 重算成功率
- 降级率
- 幻觉维度发生率

建议目标：

- 合法 JSON 输出率 >= 95%
- 重算成功率 >= 90%
- 幻觉维度率 <= 5%

