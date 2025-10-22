import Admin from "@/pages/Admin";
import Configuration from "@/pages/Configuration";
import AllPrayerBlocks from "@/pages/AllPrayerBlocks";
import Home from "@/pages/Home";
import AdminLogin from "@/pages/AdminLogin";
import UserLogin from "@/pages/UserLogin";
import Prayer from "@/pages/Prayer";
import Category from "@/pages/Category";
import Search from "@/pages/Search";
import Profile from "@/pages/Profile";
import DevShowcase from "@/pages/DevShowcase";
import { createBrowserRouter, Navigate } from "react-router-dom";

export enum Pages {
  INDEX = "/",
  HOME = "/home",
  CATEGORY = "/category/:categoryId",
  SELECTED_PRAYER = "/category/:categoryId/prayer/:prayerId",
  SEARCH = "/search",
  PROFILE = "/profile",
  REDIRECT_ADMIN = "/admin",
  ADMIN = "/admin/prayer",
  SELECTED_ADMIN_PRAYER = "/admin/prayer/:prayerId",
  CONFIG = "/admin/config",
  ALL_PRAYER_BLOCKS = "/admin/blocks",
  LOGIN = "/admin/login",
  USER_LOGIN = "/login",
  DEV_SHOWCASE = "/dev/showcase",
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
    path: Pages.CATEGORY,
    element: <Category />,
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
    path: Pages.ALL_PRAYER_BLOCKS,
    element: <AllPrayerBlocks />,
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
    element: <AdminLogin />,
  },
  {
    path: Pages.USER_LOGIN,
    element: <UserLogin />,
  },
  {
    path: Pages.SEARCH,
    element: <Search />,
  },
  {
    path: Pages.PROFILE,
    element: <Profile />,
  },
  {
    path: Pages.DEV_SHOWCASE,
    element: <DevShowcase />,
  },
]);
