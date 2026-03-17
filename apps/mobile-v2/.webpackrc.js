const path = require("path");

module.exports = {
  entry: "./.generated/main.js",
  outputPath: "./dist",
  publicPath: "/",
  html: {
    title: "移动财务分析",
    template: "./index.ejs",
  },
  cssModulesExcludes: [
    ".generated/styles/global.less",
    ".generated/styles/school-finance-fusion-legacy.less",
    "src/styles/global.less",
    "src/styles/school-finance-fusion-legacy.less",
  ],
  alias: {
    "@": path.resolve(__dirname, ".generated"),
  },
  extraResolveModules: [path.resolve(__dirname, "../../node_modules")],
};
