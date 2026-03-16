// 预留企业微信 / 钉钉原生导航栏集成点。
// 目前浏览器预览场景下仅同步 document.title，后续可接入对应 JS-SDK 设置标题和右侧按钮。
export async function syncHostNavigationTitle(title: string) {
  document.title = title;
  return Promise.resolve();
}
