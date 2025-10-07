import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { StatusBarProvider } from "../../contexts/StatusBarContext";
import { ThemeProvider } from "../../contexts/ThemeContext";
import { FontSizeProvider } from "../../contexts/FontSizeContext";

export default function App() {
  return (
    <FontSizeProvider>
      <ThemeProvider>
        <StatusBarProvider>
          <div className="h-[100vh] overflow-y-auto overflow-x-hidden">
            <RouterProvider router={router} data-id="RouterProvider" />
          </div>
        </StatusBarProvider>
      </ThemeProvider>
    </FontSizeProvider>
  );
}
