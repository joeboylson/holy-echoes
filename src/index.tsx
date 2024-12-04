import "./index.css";
import "@mdxeditor/editor/style.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./layout/App";
import { seed_block_types } from "./scripts/seed_block_types";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

if (process.env.NODE_ENV) {
  seed_block_types();
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
