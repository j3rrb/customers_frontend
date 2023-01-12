import { Alert, Snackbar } from "@mui/material";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { DefaultAPIError } from "../types";

type Props = {
  isError: boolean;
  error: any;
};

export default function ErrorComponent({ isError, error }: Props): JSX.Element {
  return (
    <Snackbar open={isError}>
      <Alert severity="error">
        {error.hasOwnProperty("data")
          ? ((error as FetchBaseQueryError).data as DefaultAPIError).message
          : "Não foi possível fazer a requisição ao servidor!"}
      </Alert>
    </Snackbar>
  );
}
