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
    "src/styles/global.less",
  ],
  alias: {
    "@": path.resolve(__dirname, ".generated"),
  },
  extraResolveModules: [path.resolve(__dirname, "../../node_modules")],
};
