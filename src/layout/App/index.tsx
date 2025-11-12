import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { StatusBarProvider } from "../../contexts/StatusBarContext";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <ErrorBoundary>
      <StatusBarProvider>
        <div className="h-[100vh] overflow-y-auto overflow-x-hidden">
          <RouterProvider router={router} data-id="RouterProvider" />
        </div>
        <Toaster />
      </StatusBarProvider>
    </ErrorBoundary>
  );
}
