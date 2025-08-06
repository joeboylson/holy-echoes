import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { StatusBarProvider } from "../../contexts/StatusBarContext";

export default function App() {
  return (
    <StatusBarProvider>
      <div className="h-[100vh] overflow-y-scroll">
        <RouterProvider router={router} data-id="RouterProvider" />
      </div>
    </StatusBarProvider>
  );
}
