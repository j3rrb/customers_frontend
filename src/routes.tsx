import { RouteObject } from "react-router-dom";
import CreateAccountPage from "./pages/CreateAccount";
import Dashboards from "./pages/Dashboards";
import LoginPage from "./pages/Login";

const Routes: RouteObject[] = [
  {
    path: "/",
    element: <Dashboards />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/create-account",
    element: <CreateAccountPage />,
  },
];

export default Routes;
