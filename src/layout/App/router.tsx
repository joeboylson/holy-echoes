import Admin from "@/pages/Admin";
import Configuration from "@/pages/Configuration";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Prayer from "@/pages/Prayer";
import { createBrowserRouter, Navigate } from "react-router-dom";

export enum Pages {
  INDEX = "/",
  HOME = "/home",
  SELECTED_PRAYER = "/prayer/:prayerId",
  REDIRECT_ADMIN = "/admin",
  ADMIN = "/admin/prayer",
  SELECTED_ADMIN_PRAYER = "/admin/prayer/:prayerId",
  CONFIG = "/admin/config",
  LOGIN = "/admin/login",
}

export const router = createBrowserRouter([
  {
    path: Pages.INDEX,
    element: <Navigate to={Pages.HOME} replace />,
  },
  {
    path: Pages.HOME,
    element: <Home />,
  },
  {
    path: Pages.ADMIN,
    element: <Admin />,
  },
  {
    path: Pages.REDIRECT_ADMIN,
    element: <Navigate to={Pages.ADMIN} replace />,
  },
  {
    path: Pages.CONFIG,
    element: <Configuration />,
  },
  {
    path: Pages.SELECTED_ADMIN_PRAYER,
    element: <Admin />,
  },
  {
    path: Pages.SELECTED_PRAYER,
    element: <Prayer />,
  },
  {
    path: Pages.LOGIN,
    element: <Login />,
  },
]);
