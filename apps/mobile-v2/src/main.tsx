import React from "react";
import ReactDOM from "react-dom";
import { App } from "@/app/index";
import "antd-mobile/dist/antd-mobile.less";
import "@/styles/global.less";

function ensureMountNode() {
  const existing = document.getElementById("root");

  if (existing) {
    return existing;
  }

  const mountNode = document.createElement("div");
  mountNode.id = "root";
  document.body.appendChild(mountNode);
  return mountNode;
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  ensureMountNode(),
);
