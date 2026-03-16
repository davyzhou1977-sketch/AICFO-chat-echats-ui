# 报销单 AI 报表查询 API 契约

## 1. 文档目的

本文档定义“报销单 AI 报表查询”后端接口契约，供 Java 后端、GraphQL 网关和前端联调使用。

目标：

- 前端在用户点击“生成 AI 报表”时，通过统一接口获取右侧抽屉数据
- 后端基于**当前查询条件下的全部命中结果**生成基础指标、推荐图表和 AI 解读
- 返回结构稳定、字段明确、可直接供前端渲染

---

## 2. 总体原则

- 正式版必须基于**全部命中结果**，不能基于第一页分页数据
- 前端不直接调用 LLM
- 后端返回的数据协议固定，前端不解析模型自由输出
- 基础指标第一版仅包含：
  - 报销单笔数
  - 报销总金额
- 图表数据由 Java 重算后返回
- AI 解读可来自：
  - `llm`
  - `rule_fallback`

---

## 3. 推荐接口形态

当前建议优先实现 GraphQL；如果后端团队更适合先走 HTTP，也提供 REST 对照方案。

### 3.1 GraphQL

```graphql
query ReimbursementAiReport($filter: ReimbursementFilterInput!) {
  reimbursementAiReport(filter: $filter) {
    requestId
    generatedAt
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

### 3.2 REST 对照方案

```http
POST /api/reimbursement/ai-report
Content-Type: application/json
```

请求体：

```json
{
  "filter": {
    "statusList": ["approved", "verified"],
    "dateRange": {
      "start": "2026-01-01",
      "end": "2026-03-31"
    },
    "departmentIds": ["后勤部-后勤中学", "后勤部-后勤小学"],
    "keyword": "水费"
  }
}
```

---

## 4. 请求参数定义

### 4.1 ReimbursementFilterInput

建议字段如下：

```ts
type ReimbursementFilterInput = {
  statusList?: string[];
  departmentIds?: string[];
  applicantIds?: string[];
  budgetItemNames?: string[];
  paySettingNames?: string[];
  keyword?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
  fiscalYear?: string;
  pageScope?: "ALL_MATCHED";
};
```

### 4.2 请求约束

- `pageScope` 固定为 `ALL_MATCHED`
- `dateRange` 建议使用 `YYYY-MM-DD`
- `keyword` 用于模糊匹配事由/备注
- 所有筛选逻辑必须与列表查询保持一致

---

## 5. 响应体定义

### 5.1 顶层返回结构

```ts
type ReimbursementAiReportResponse = {
  requestId: string;
  generatedAt: string;
  summaryMetrics: SummaryMetric[];
  recommendedChartId: string;
  availableCharts: ChartSpec[];
  insight: InsightPayload;
  traceInfo: TraceInfo;
};
```

### 5.2 SummaryMetric

第一版固定返回 2 个值：

```ts
type SummaryMetric = {
  label: string;
  value: string;
};
```

约定：

- 第一项：`报销单笔数`
- 第二项：`报销总金额`

示例：

```json
[
  { "label": "报销单笔数", "value": "5 笔" },
  { "label": "报销总金额", "value": "58,104 元" }
]
```

### 5.3 ChartSpec

```ts
type ChartSpec =
  | {
      id: string;
      type: "bar" | "line";
      title: string;
      unit?: string;
      labels: string[];
      series: {
        name: string;
        data: number[];
        color?: string;
      }[];
    }
  | {
      id: string;
      type: "pie";
      title: string;
      unit?: string;
      data: {
        name: string;
        value: number;
      }[];
    };
```

约束：

- `recommendedChartId` 必须命中 `availableCharts`
- `bar / line` 类型必须返回 `labels + series`
- `pie` 类型必须返回 `data`
- `labels.length` 必须等于每个 `series.data.length`
- 所有数值必须是非负数

### 5.4 InsightPayload

```ts
type InsightPayload = {
  summary: string;
  bullets?: string[];
  confidence?: number;
  source: "llm" | "rule_fallback";
};
```

约束：

- `summary` 必填
- 建议控制在 `80~140` 字
- `confidence` 范围：`0~1`
- `source` 用于前端标记当前摘要是否由规则降级生成

### 5.5 TraceInfo

```ts
type TraceInfo = {
  dimension: string;
  metric: string;
  generatedBy: "java_recomputed";
  fallback: boolean;
};
```

说明：

- `dimension` 为最终采用的分组维度
- `metric` 为最终采用的统计指标
- `generatedBy` 当前固定为 `java_recomputed`
- `fallback=true` 表示本次结果使用了降级逻辑

---

## 6. 标准成功响应示例

```json
{
  "requestId": "airpt_20260313_001",
  "generatedAt": "2026-03-13T20:10:00+08:00",
  "summaryMetrics": [
    { "label": "报销单笔数", "value": "5 笔" },
    { "label": "报销总金额", "value": "58,104 元" }
  ],
  "recommendedChartId": "campus_month_amount",
  "availableCharts": [
    {
      "id": "campus_month_amount",
      "type": "line",
      "title": "东西校区月度水费趋势",
      "unit": "元",
      "labels": ["1月", "2月", "3月"],
      "series": [
        { "name": "西校区", "data": [8160, 11382, 3234], "color": "#2d5ef2" },
        { "name": "东校区", "data": [17166, 18162, 0], "color": "#1eaf74" }
      ]
    },
    {
      "id": "campus_month_amount_bar",
      "type": "bar",
      "title": "东西校区月度水费对比",
      "unit": "元",
      "labels": ["1月", "2月", "3月"],
      "series": [
        { "name": "西校区", "data": [8160, 11382, 3234], "color": "#2d5ef2" },
        { "name": "东校区", "data": [17166, 18162, 0], "color": "#1eaf74" }
      ]
    }
  ],
  "insight": {
    "summary": "本次查询共 5 笔，报销总金额 58,104 元，金额主要集中在 1 月和 2 月，东校区整体支出高于西校区，建议重点关注 3 月金额断崖式下降是否与抄表周期有关。",
    "bullets": [
      "东校区金额明显高于西校区",
      "2 月为阶段峰值",
      "3 月西校区仍有支出，东校区无新增记录"
    ],
    "confidence": 0.88,
    "source": "llm"
  },
  "traceInfo": {
    "dimension": "campus+apply_date_month",
    "metric": "sum(amount)",
    "generatedBy": "java_recomputed",
    "fallback": false
  }
}
```

---

## 7. 降级响应示例

当 LLM 超时、返回非法 JSON 或校验失败时，后端应返回降级结果。

```json
{
  "requestId": "airpt_20260313_002",
  "generatedAt": "2026-03-13T20:12:00+08:00",
  "summaryMetrics": [
    { "label": "报销单笔数", "value": "5 笔" },
    { "label": "报销总金额", "value": "58,104 元" }
  ],
  "recommendedChartId": "amount_by_month_default",
  "availableCharts": [
    {
      "id": "amount_by_month_default",
      "type": "bar",
      "title": "按月报销金额趋势",
      "unit": "元",
      "labels": ["1月", "2月", "3月"],
      "series": [
        { "name": "报销金额", "data": [25326, 29544, 3234], "color": "#2d5ef2" }
      ]
    }
  ],
  "insight": {
    "summary": "本次查询结果金额主要集中在 1 月和 2 月，建议优先关注高金额月份及对应单据明细。",
    "source": "rule_fallback"
  },
  "traceInfo": {
    "dimension": "apply_date_month",
    "metric": "sum(amount)",
    "generatedBy": "java_recomputed",
    "fallback": true
  }
}
```

---

## 8. 后端校验要求

后端返回前必须完成：

- 协议白名单校验
- 维度合法性校验
- 数值一致性校验
- 图表协议完整性校验

具体要求：

- `recommendedChartId` 必须存在
- `availableCharts` 至少返回 1 个
- 若为 `pie` 图，所有 `data.value` 和应接近对应总量
- 若为 `line/bar` 图，必须能在 Java 内部重算得到完全一致的数值

---

## 9. 错误码建议

### HTTP

- `200`：成功，含正常结果或降级结果
- `400`：请求参数非法
- `401`：未登录
- `403`：无权限
- `500`：服务内部异常

### 业务码

```json
{
  "code": "AI_REPORT_FILTER_INVALID",
  "message": "查询条件无效"
}
```

建议业务码：

- `AI_REPORT_FILTER_INVALID`
- `AI_REPORT_PERMISSION_DENIED`
- `AI_REPORT_NO_DATA`
- `AI_REPORT_LLM_TIMEOUT`
- `AI_REPORT_LLM_INVALID_OUTPUT`
- `AI_REPORT_RECOMPUTE_FAILED`

说明：

- `NO_DATA` 场景建议前端展示空态，而不是报错态
- `LLM_TIMEOUT / INVALID_OUTPUT / RECOMPUTE_FAILED` 推荐走降级，不建议直接失败

---

## 10. 联调要求

前后端联调时：

- 统一使用 [reimbursement-production-export.mock.json](/Users/zhouhao/Documents/AI_APP/03-AICFO/data/reimbursement-production-export.mock.json) 作为样例数据来源
- 前端以本文档 schema 为唯一契约
- 若后端字段名有调整，必须同步更新契约文档，不接受口头变更

---

## 11. 第一阶段开发范围

第一阶段后端只需实现：

- 基础指标返回
- 一个推荐图表
- 一段 AI 解读
- Java 重算与降级

不要求第一阶段实现：

- 多图表自由切换
- 多轮分析
- 报表导出
- 风险解释链路

