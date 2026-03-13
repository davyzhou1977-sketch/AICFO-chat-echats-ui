# 报销单 AI 报表查询项目说明简报

## 1. 项目当前状态

本项目当前已完成一版可运行的前端原型，用于演示“报销单列表 + 右侧 AI 报表抽屉”的整体交互与视觉效果，并作为后续正式开发与联调的基础版本。

当前原型已具备：

- 报销单列表页框架，样式已按线上系统 UI 规范做一轮对齐
- 左侧导航、顶部工具栏、筛选区、列表表格样式统一
- 右侧 AI 报表抽屉
- 报表图表切换（柱状图 / 折线图）
- 基于 mock 数据的基础汇总、图表展示与 AI 解读占位
- 面向后端开发的接口契约、LLM 协议、测试用例和时序图文档

---

## 2. 当前技术栈

当前可运行原型位于前端子项目 `reimburse-list-chat-echarts`，技术栈未升级，保持旧版体系：

- React 16.14
- Ant Design 4.24
- ECharts 4.9
- Vite 7
- JavaScript（未改为 TypeScript）

说明：

- 本次工作没有更换框架，没有升级 React，没有切换 UI 库
- 重点是先在现有旧技术栈里快速还原页面结构和交互效果，供业务确认与后端并行开发

---

## 3. 已完成内容

### 3.1 前端页面

- 报销单页面框架已完成
- 页面主视觉已按线上系统风格调整：
  - 深色左侧导航
  - 白色顶部工具条
  - 浅灰主工作区
  - 低饱和表格头与青色主按钮
- 右侧抽屉式 AI 报表查询区域已完成

### 3.2 演示数据

- 已将生产系统导出的 Excel 转换为前端可直接使用的 mock JSON
- 报销单列表演示数据已替换为该 mock 数据
- 右侧报表当前也基于同一份 mock 数据做前端聚合展示

### 3.3 文档与方案

已补齐一套可直接供前后端开发的文档：

- 总体实施方案
- 时序图
- API 契约
- LLM 协议
- 联调测试用例

---

## 4. 前端后续任务

前端同事后续重点工作：

1. 将当前 mock 数据驱动逻辑替换为正式后端接口返回协议
2. 对接 GraphQL `reimbursementAiReport` 接口
3. 保持右侧抽屉只消费后端标准协议，不直接解析模型原始输出
4. 完善以下状态：
   - loading
   - 空数据
   - 降级态
   - 错误态
5. 根据后端返回的 `recommendedChartId` 渲染推荐图表
6. 支持后续多图表切换、导出等扩展能力
7. 继续按线上系统做像素级样式细化

---

## 5. 后端后续任务

后端同事后续重点工作：

1. 新增 AI 报表查询接口，输入为当前筛选条件下的**全部命中结果**
2. 不基于分页第一页，必须基于全量命中结果做分析
3. 先返回两项基础指标：
   - 报销单笔数
   - 报销总金额
4. Java 后端负责：
   - 查询全量命中结果
   - 裁剪字段
   - 脱敏
   - 组装 LLM Prompt
   - 调用 LLM
   - 根据 LLM 推荐维度进行重算
   - 校验图表协议和数值一致性
   - 失败时降级
5. LLM 只负责：
   - 推荐图表语义
   - 推荐分析维度
   - 生成图表标题和 AI 解读
6. 实现缓存、超时控制、审计日志和降级策略

后端实现原则：

> LLM 决定图表语义，Java 产出图表数值。

---

## 6. 文档清单

仓库内 `docs` 目录已提供以下文档：

- `project-handover-brief.md`
- `reimbursement-ai-report-implementation-plan.md`
- `reimbursement-ai-report-sequence.puml`
- `reimbursement-ai-report-api-contract.md`
- `reimbursement-ai-report-llm-contract.md`
- `reimbursement-ai-report-test-cases.md`

---

## 7. 数据与仓库说明

### 7.1 mock 数据

当前前端使用的 mock 数据文件：

- `src/data/reimbursement-production-export.mock.json`

该数据由生产系统导出的 Excel 转换而来，用于当前迭代开发和联调测试。

### 7.2 GitHub 仓库

共享仓库地址：

- <https://github.com/davyzhou1977-sketch/AICFO-chat-echats-ui>

当前开发分支：

- `codex/ai-report-drawer-refresh`

建议前后端同事统一先参考该分支中的页面与文档，再开始正式开发和联调。
