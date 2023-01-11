import { RouteObject } from "react-router-dom";
import CreateAccountPage from "./pages/CreateAccount";
import LoginPage from "./pages/Login";

const Routes: RouteObject[] = [
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
