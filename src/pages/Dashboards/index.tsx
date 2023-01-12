import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { PERSIST_CONFIG_KEY, RootState } from "../../redux/store";
import { useValidateTokenMutation } from "../../redux/apis/auth";
import { setToken } from "../../redux/slices/auth";
import { Roles, User } from "../../types";
import CustomerDashboard from "./CustomerDashboard";
import ArchitectDashboard from "./ArchitectDashboard";
import Box from "@mui/material/Box/Box";
import AppBar from "@mui/material/AppBar/AppBar";
import Toolbar from "@mui/material/Toolbar/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const ComponentMapping = {
  [Roles.ARCHITECT]: <ArchitectDashboard />,
  [Roles.CUSTOMER]: <CustomerDashboard />,
};

export default function Dashboards(): JSX.Element | null {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, role } = useSelector((state: RootState) => state.auth);
  const [validateToken, { isError }] = useValidateTokenMutation();

  const logout = () => {
    dispatch(setToken(undefined));
    localStorage.removeItem(PERSIST_CONFIG_KEY);
    navigate("/login");
  };

  React.useEffect(() => {
    if (token && role) {
      const decodedToken = jwtDecode(token) as User;

      validateToken(token);

      const tokenRole = decodedToken.role;

      if (tokenRole !== role) {
        logout();
      }
    } else {
      logout();
    }
  }, []);

  React.useEffect(() => {
    if (isError) {
      logout();
    }
  }, [isError]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button
            onClick={() => {
              logout();
            }}
          >
            <Typography fontFamily="Roboto-Bold" color="white">
              Sair
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
      {role ? ComponentMapping[role] : null}
    </Box>
  );
}
