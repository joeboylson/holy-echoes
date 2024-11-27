import Admin from "../../pages/Admin";
import Home from "../../pages/Home";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

export enum Pages {
  INDEX = "/",
  HOME = "/home",
  ADMIN = "/admin",
  SELECTED_PRAYER = "/admin/prayer/:prayerId",
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
    path: Pages.SELECTED_PRAYER,
    element: <Admin />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
