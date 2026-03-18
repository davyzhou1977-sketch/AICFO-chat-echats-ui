# AICFO Development Standard

本文件是当前工程的强制开发标准。后续所有 Agent、会话、迭代任务都必须严格遵守，不允许偏离。
详细标准说明见 `docs/项目技术栈与UI规范.md`，如与临时实现冲突，以该文档和 `docs/web视觉规范(2024).pdf` 为准。

## V2.1 Freeze Baseline

- 当前双端定版版本为 `V2.1`
- 定版日期：`2026-03-17`
- 当前长期维护目录固定为：
- `apps/web-v2`
- `apps/mobile-v2`
- 后续优化、修复和功能扩展，默认都必须基于 `V2.1` 当前页面结构继续演进，不允许脱离现有信息架构重做
- 移动端 `V2.1` 已确认的关键体验要求：
- 在常见移动宽度下，包括约 `540px` 和手动放宽后的视口，不允许出现首屏主体内容需要左右滑动才能看全的问题
- 预算主题首屏圆环中心必须显示“预算执行率”标签和对应数值
- 若未来实现与 `V2.1` 定版效果冲突，以 `V2.1` 当前仓库代码、`AGENTS.md` 与 `docs/项目技术栈与UI规范.md` 共同作为默认基线

## Global Rules

- 严禁使用 `Tailwind CSS`
- 任何重构都必须优先保持“上一版最终上传 GitHub 的页面结构、交互层级和信息组织”
- UI 调整必须对照 [docs/web视觉规范(2024).pdf](/Users/zhouhao/Documents/AI_APP/03-AICFO/docs/web视觉规范(2024).pdf)
- 若设计稿或上一版实现与当前代码不一致，默认以前一版最终代码和 UI 规范为准

## Tech Stack

### Shared

- `React 16.14.0`
- `react-dom 16.14.0`
- `echarts 4.9.0`
- `less 4.2.0`

### Web Only

- `antd 4.23.0`
- `vite 7.3.1`
- 开发端口固定为 `4174`

### Mobile Only

- `roadhog 2.5.0-beta.4`
- `antd-mobile 2.3.4`
- 开发端口固定为 `4173`
- 页面访问路径固定为 `/mobile/school-finance-fusion-demo`

## Styling Rules

- Web 局部样式必须使用普通 `.less` 文件并以 CSS Modules 方式引入
- 标准写法固定为：
- `import styles from "./index.less";`
- `<div className={styles.button}>ai报表</div>`
- 业务组件中禁止直接 `import "./index.module.less"` 或其他 `*.module.less`
- 只要组件引入了本地局部 less，就禁止继续书写该样式文件对应的裸字符串类名，例如 `className="button"`、`className="legacy-coachmark__head"`
- 组件私有样式必须统一通过 `styles.xxx` 使用；字符串 `className` 仅允许用于第三方库明确要求的全局钩子、测试钩子或业务约定的 `data-*` 标记，且不能承载本地 less 样式
- 如 Web 构建链需要兼容桥接文件，必须由构建层处理，不能把这类桥接文件暴露为业务层默认写法
- Mobile 样式优先沿用上一版成熟结构；如需改动，必须先证明与上一版一致或更接近规范
- Mobile 新增局部样式同样必须使用 `import styles from "./index.less"` + `styles.xxx`
- 移动端当前仅允许 `src/styles/global.less` 继续作为全局基线样式入口；业务组件样式不得再回退到新的全局 less 文件
- 提交前必须执行源码检索，确认 `apps/web-v2/src` 与 `apps/mobile-v2/src` 中不存在 `import styles from "*.module.less"`，也不存在把本地 less 类名写成裸字符串 `className="..."` 的情况
- 图表配色必须遵循 UI 规范，并参考 Web 端的渐变思路处理高光、面积和柱形渐变

## Delivery Rules

- 不能只改依赖版本号，必须确保实际开发/构建链路可运行
- 每次技术栈变更后，都要验证对应端的本地启动与构建
- 白屏、路由失效、资源相对路径错误属于阻塞问题，必须优先修复
