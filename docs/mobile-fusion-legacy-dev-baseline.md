# 移动端融合版开发基线

## 1. 确认后的正式技术基线

本项目移动端融合版正式开发，统一采用以下技术栈：

- `roadhog2`
- `React16`
- `antd-mobile2`
- `echarts4`
- `less`

说明：

- 当前仓库中的融合版 Demo 仅用于确认页面结构与展示效果
- 正式迁移到线上移动端项目时，必须以上述老技术栈为准
- 不引入 `Tailwind / Vite / React18+ / ECharts5`

---

## 2. 组件开发规范

所有新增组件统一遵循以下规则：

1. 使用 `ref` 绑定
2. 通过 `useImperativeHandle` 暴露组件 API
3. 非必须状态由组件内部维护
4. 所有组件必须继承：
   - `className`
   - `style`
5. 严格区分受控与非受控模式
6. 遵循最小依赖原则
7. 遵循功能拆分、单一职责原则

---

## 3. 页面适配规范

移动端页面按以下规则实现：

1. 使用 `viewport` 百分比适配
2. 元素宽度、间距优先采用横向百分比
3. 页面底部存在固定导航栏：
   - `position: fixed`
   - 高度固定 `50px`
4. 页面滚动内容必须预留底部安全区：
   - `50px + safe-area`

推荐做法：

- 页面内容区 `padding-bottom >= 50px`
- 卡片宽度 `100%`
- 左右边距用 `vw`
- 图表高度固定，宽度自适应

---

## 4. 正式版页面结构

融合版页面统一结构如下：

```text
财务分析
├─ 顶部标题
├─ 时间切换：本年 / 本季 / 本月
├─ 主题切换：预算 / 报销 / 人员 / 保障
│
├─ 预算
│  └─ 直接复用线上已有预算报表能力
├─ 报销
│  └─ 接入 V2 Demo 报销分析图表
├─ 人员
│  └─ 接入 V2 Demo 人员分析图表
└─ 保障
   └─ 接入 V2 Demo 保障分析图表
```

默认规则：

- 默认主题：`预算`
- 默认时间：沿用线上预算页当前默认值

---

## 5. 推荐组件拆分

建议按以下目录与职责拆分：

### 页面容器

- `FinancialAnalysisPage`
- `FinancialAnalysisHeader`
- `FinancialTopicTabs`

### 主题模块

- `BudgetTopic`
- `ReimbursementTopic`
- `PersonnelTopic`
- `GuaranteeTopic`

### 通用展示组件

- `MetricCard`
- `ChartSection`
- `InsightCard`
- `RankingList`
- `EmptyBlock`
- `LoadingBlock`
- `ErrorBlock`

### 图表配置

- `budgetChartOptions.js`
- `reimbursementChartOptions.js`
- `personnelChartOptions.js`
- `guaranteeChartOptions.js`

---

## 6. antd-mobile2 使用原则

由于 `antd-mobile2` 版本较早，正式版按以下原则使用：

1. 能直接满足展示的组件优先复用
2. 无法满足视觉要求时，用 `less + 自定义容器` 封装
3. 不为单个页面引入新的重量级 UI 库
4. 主题切换、图表卡片、信息卡等优先自定义封装

建议复用的 antd-mobile2 基础能力：

- `Tabs` 或自定义 Tab 容器
- `Flex`
- `List`
- `Button`
- `Picker` / `ActionSheet` / `Modal`
- `ActivityIndicator`
- `Toast`
- `WingBlank` / `WhiteSpace`

不建议依赖 antd-mobile2 去强行实现的部分：

- 高定制图表区块
- 预算大卡片
- 复杂信息卡
- 排行条

这些建议统一走自定义样式组件。

---

## 7. ECharts4 使用原则

正式版统一使用 `echarts4`，按以下方式组织：

1. 页面中只保留 `Chart` 渲染容器
2. 图表 option 全部抽离到独立 builder
3. 所有图表容器高度固定
4. 图表 resize 统一封装，不在业务页面重复写

当前融合版涉及的图表类型：

- 环形图
- 柱状图
- 横向条形图
- 折线图
- 堆叠柱状图

这些都在 `echarts4` 的可支持范围内。

---

## 8. 数据加载建议

正式版推荐使用“按主题懒加载”：

1. 页面首次进入加载：
   - 默认时间配置
   - 默认主题 `预算`
2. 用户切到其他主题时，再请求对应主题数据
3. 请求成功后前端缓存
4. 再次切换已加载主题时不重复请求

这样更适合老栈项目：

- 状态管理简单
- 不影响已有预算页接口
- 三个新增主题可以独立联调

---

## 9. 正式迁移时必须遵守的边界

1. 不重写预算业务口径
2. 不因为 Demo 使用了新栈就修改线上技术底座
3. 不让前端自己在页面里计算复杂业务口径
4. 不将“人员”主题建立在不稳定的附件解析结果上直接上线
5. 不引入与当前移动端项目无关的新依赖

---

## 10. 当前确认结论

基于本次确认，后续所有实现都按以下方向推进：

1. 预算页保留，作为融合版第一个主题
2. 报销、人员、保障按融合版页面骨架接入
3. 代码风格与组件 API 向老技术栈落地方式收口
4. 样式按 `less + viewport 百分比` 方式组织
5. 底部固定导航 `50px` 作为硬约束处理
