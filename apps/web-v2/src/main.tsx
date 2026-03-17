import React from "react";
import ReactDOM from "react-dom";
import { App } from "@/app/index";
import "antd/dist/antd.less";
import "@/styles/global.less";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);
