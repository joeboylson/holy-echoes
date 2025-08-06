import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useStatusBar } from "../../hooks/useStatusBar";

export default function App() {
  useStatusBar();
  
  return <RouterProvider router={router} data-id="RouterProvider" />;
}
