declare module "*.less" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "echarts" {
  const echarts: any;
  export default echarts;
}

declare module "echarts/lib/*" {
  const echartsModule: any;
  export default echartsModule;
}
