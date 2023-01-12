import React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { DODGER_BLUE } from "../../constants";
import { SubmitHandler, useForm } from "react-hook-form";
import LoginFormValidation from "./formValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import type { DefaultAPIError, LoginFormFields } from "../../types";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useLoginMutation } from "../../redux/apis/auth";
import { useDispatch } from "react-redux";
import { setToken } from "../../redux/slices/auth";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { useNavigate } from "react-router-dom";

export default function LoginPage(): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visibility, setVisibility] = React.useState(false);
  const [login, { isError, error, isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>({
    mode: "onChange",
    resolver: yupResolver(LoginFormValidation),
  });

  const onSubmit: SubmitHandler<LoginFormFields> = async (values) => {
    const { accessToken } = await login(values).unwrap();

    dispatch(setToken(accessToken));

    navigate("/");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: DODGER_BLUE,
      }}
    >
      <Container maxWidth="sm">
        <Typography
          fontFamily="Roboto-Bold"
          color="white"
          padding={5}
          variant="h2"
          textAlign="center"
          letterSpacing={1.2}
        >
          Login
        </Typography>
        <Paper elevation={3}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container direction="column" spacing={1.5} padding={2}>
              <Grid item>
                <TextField
                  autoComplete="on"
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : undefined}
                  label="E-mail"
                  fullWidth
                  {...register("email")}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoComplete="on"
                  type={visibility ? "text" : "password"}
                  error={!!errors.password}
                  helperText={
                    errors.password ? errors.password.message : undefined
                  }
                  label="Senha"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => {
                          setVisibility(!visibility);
                        }}
                      >
                        {visibility ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    ),
                  }}
                  {...register("password")}
                />
              </Grid>
            </Grid>
            <Grid container direction="column" spacing={1} padding={3}>
              <Grid item>
                <Button
                  disabled={isLoading}
                  type="submit"
                  variant="contained"
                  fullWidth
                >
                  {isLoading ? (
                    <CircularProgress size={25} />
                  ) : (
                    <Typography
                      fontFamily="Roboto-Regular"
                      textTransform="none"
                    >
                      Entrar
                    </Typography>
                  )}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => {
                    navigate("/create-account");
                  }}
                  fullWidth
                >
                  <Typography fontFamily="Roboto-Regular" textTransform="none">
                    Criar conta
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
        {isError && error && (
          <Snackbar open={isError}>
            <Alert severity="error">
              {error.hasOwnProperty("data")
                ? ((error as FetchBaseQueryError).data as DefaultAPIError)
                    .message
                : "Não foi possível fazer a requisição ao servidor!"}
            </Alert>
          </Snackbar>
        )}
      </Container>
    </Box>
  );
}
