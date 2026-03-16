# AICFO Workspace

这个仓库用于承载 AICFO 的统一工作区，当前重点是把移动端 Demo、设计文档和后续多端协作放到同一套清晰目录里。

## 当前目录

```text
apps/
  mobile/    当前可运行的移动端财务分析 Demo（Vite）
docs/        方案、接口、视觉规范与评审文档
Data/        原始数据样例
reimburse-list-chat-echarts/  现有独立 Web 仓库，暂时隔离保留
```

## 启动方式

虽然代码已经整理进 `apps/mobile`，但根目录仍然保留了一键命令：

```bash
npm run dev
npm run build
npm run preview
```

当前主要演示页面：

- `/mobile/school-finance-fusion-demo`
- `/mobile/school-finance`
- `/mobile/school-finance-v2`
- `/web/reimbursements/ai-report-demo`

## 当前协作策略

- 根仓库负责统一管理移动端 Demo、文档和后续多端目录结构
- `reimburse-list-chat-echarts/` 继续作为现有 Web 独立仓库保留，不在本阶段直接吞并
- 等 Web 侧确认迁移窗口后，再把 Web 代码平滑迁入 `apps/web`

## 下一步建议

1. 继续把移动端 Demo 逐步收口为老技术栈可迁移结构
2. 为未来的 `apps/web` 预留目录与发布规范
3. 在根仓库中补齐共享接口契约、组件约束和上线说明
