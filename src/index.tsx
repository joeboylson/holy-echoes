import "./index.css";
import "@mdxeditor/editor/style.css";

import { createRoot } from "react-dom/client";
import App from "./layout/App";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
