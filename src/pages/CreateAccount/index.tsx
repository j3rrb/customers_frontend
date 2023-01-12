import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { DODGER_BLUE } from "../../constants";
import { useCreateMutation } from "../../redux/apis/users";
import {
  CreateAccountFormFields,
  DefaultAPIError,
  Genders,
  Roles,
} from "../../types";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import CreateAccountFormValidation from "./formValidation";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";

const RolesMap = {
  CUSTOMER: "Cliente",
  ARCHITECT: "Arquiteto",
};

const GendersMap = {
  MALE: "Masculino",
  FEMALE: "Feminino",
  OTHER: "Outros",
};

export default function CreateAccountPage(): JSX.Element {
  const navigate = useNavigate();
  const [passwordVisibility, setPasswordVisibility] = React.useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    React.useState(false);
  const [birthDate, setBirthDate] = React.useState<string | null>(null);
  const [createAccount, { isError, error, isLoading }] = useCreateMutation();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountFormFields>({
    mode: "onChange",
    resolver: yupResolver(CreateAccountFormValidation),
  });

  const onSubmit: SubmitHandler<CreateAccountFormFields> = async (values) => {
    await createAccount(values).unwrap();

    navigate("/login");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "auto",
        backgroundColor: DODGER_BLUE,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          marginBottom: 5,
        }}
      >
        <Typography
          fontFamily="Roboto-Bold"
          color="white"
          padding={5}
          variant="h2"
          textAlign="center"
          letterSpacing={1.2}
        >
          Criar conta
        </Typography>
        <Paper elevation={3}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container direction="column" spacing={1.5} padding={2}>
              <Grid item>
                <FormControl fullWidth>
                  <InputLabel error={!!errors.role}>Tipo de usuário</InputLabel>
                  <Select
                    error={!!errors.role}
                    label="Tipo de usuário"
                    {...register("role")}
                  >
                    {Object.values(Roles).map((role) => (
                      <MenuItem value={role}>
                        <Typography textTransform="capitalize">
                          {RolesMap[role]}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.role && (
                    <FormHelperText error>{errors.role.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item>
                <TextField
                  autoComplete="on"
                  error={!!errors.firstName}
                  helperText={
                    errors.firstName ? errors.firstName.message : undefined
                  }
                  label="Primeiro nome"
                  fullWidth
                  {...register("firstName")}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoComplete="on"
                  error={!!errors.lastName}
                  helperText={
                    errors.lastName ? errors.lastName.message : undefined
                  }
                  label="Último nome"
                  fullWidth
                  {...register("lastName")}
                />
              </Grid>
              <Grid item>
                <Controller
                  control={control}
                  name="birthDate"
                  render={({ field }) => (
                    <DatePicker
                      disableFuture
                      value={birthDate}
                      onChange={(newValue) => {
                        setBirthDate(newValue);
                        field.onChange(moment(newValue).format("YYYY-MM-DD"));
                      }}
                      label="Data de nascimento"
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!errors.birthDate}
                            helperText={
                              errors.birthDate
                                ? errors.birthDate.message
                                : undefined
                            }
                            {...field}
                          />
                        );
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoComplete="on"
                  error={!!errors.primaryPhoneNumber}
                  helperText={
                    errors.primaryPhoneNumber
                      ? errors.primaryPhoneNumber.message
                      : undefined
                  }
                  label="Telefone principal"
                  fullWidth
                  {...register("primaryPhoneNumber")}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoComplete="on"
                  error={!!errors.secondaryPhoneNumber}
                  helperText={
                    errors.secondaryPhoneNumber
                      ? errors.secondaryPhoneNumber.message
                      : undefined
                  }
                  label="Telefone secundário"
                  fullWidth
                  {...register("secondaryPhoneNumber")}
                />
              </Grid>
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
                <FormControl fullWidth>
                  <InputLabel error={!!errors.gender}>Gênero</InputLabel>
                  <Select
                    error={!!errors.gender}
                    label="Gênero"
                    {...register("gender")}
                  >
                    {Object.values(Genders).map((gender) => (
                      <MenuItem value={gender}>
                        <Typography textTransform="capitalize">
                          {GendersMap[gender]}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.gender && (
                    <FormHelperText error>
                      {errors.gender.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item>
                <TextField
                  autoComplete="on"
                  type={passwordVisibility ? "text" : "password"}
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
                          setPasswordVisibility(!passwordVisibility);
                        }}
                      >
                        {passwordVisibility ? (
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
              <Grid item>
                <TextField
                  autoComplete="on"
                  type={confirmPasswordVisibility ? "text" : "password"}
                  error={!!errors.confirmPassword}
                  helperText={
                    errors.confirmPassword
                      ? errors.confirmPassword.message
                      : undefined
                  }
                  label="Confirme a senha"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => {
                          setConfirmPasswordVisibility(
                            !confirmPasswordVisibility
                          );
                        }}
                      >
                        {confirmPasswordVisibility ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    ),
                  }}
                  {...register("confirmPassword")}
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
                      Criar conta
                    </Typography>
                  )}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => {
                    navigate("/login");
                  }}
                  fullWidth
                >
                  <Typography fontFamily="Roboto-Regular" textTransform="none">
                    Voltar para login
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
