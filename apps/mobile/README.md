# Mobile App

这里放置当前 AICFO 移动端财务分析 Demo 的前端代码。

## 说明

- 当前运行入口由根目录 `package.json` 统一代理
- 主要源码位于 `src/`
- Vite、TypeScript、Tailwind、PostCSS 配置都已下沉到本目录

## 本地运行

推荐直接在仓库根目录执行：

```bash
npm run dev
```

如果需要定位移动端应用相关配置，可以从以下文件开始：

- `apps/mobile/vite.config.js`
- `apps/mobile/tsconfig.json`
- `apps/mobile/src/router/index.tsx`
