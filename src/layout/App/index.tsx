import Admin from "../../pages/Admin";
import Home from "../../pages/Home";
import Prayer from "../../pages/Prayer";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

export enum Pages {
  INDEX = "/",
  HOME = "/home",
  ADMIN = "/admin",
  SELECTED_ADMIN_PRAYER = "/admin/prayer/:prayerId",
  SELECTED_PRAYER = "/prayer/:prayerId",
}

const router = createBrowserRouter([
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
    path: Pages.SELECTED_ADMIN_PRAYER,
    element: <Admin />,
  },
  {
    path: Pages.SELECTED_PRAYER,
    element: <Prayer />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
