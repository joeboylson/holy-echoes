import "./index.css";
import "@mdxeditor/editor/style.css";
import { createRoot } from "react-dom/client";
import MissingEnvError from "./components/MissingEnvError";
import App from "./layout/App";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);

  // Check for required environment variable before loading the app
  const appId = import.meta.env.VITE_INSTANT_APP_ID;

  if (!appId) {
    root.render(<MissingEnvError />);
  } else {
    root.render(<App />);
  }
}
