import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";
import { Slide } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateOrderFormFields, Roles } from "../../../../../types";
import { useCreateOrderMutation, useLazyListOrdersQuery } from "../../../../../redux/apis/orders";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import ErrorComponent from "../../../../../components/error";
import CreateOrderFormValidation from "./formValidation";
import { useListUsersQuery } from "../../../../../redux/apis/users";
import CircularProgress from "@mui/material/CircularProgress";

type Props = {
  modalProps: {
    open: boolean;
    architectId?: number;
    customerId: number;
  };
  setOpen: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      architectId?: number;
      customerId: number;
    }>
  >;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateOrderModal({
  modalProps,
  setOpen,
}: Props): JSX.Element {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateOrderFormFields>({
    mode: "onChange",
    resolver: yupResolver(CreateOrderFormValidation),
    defaultValues: {
      architectId: modalProps.architectId,
      customerId: modalProps.customerId,
    },
  });

  const [listOrders, _] = useLazyListOrdersQuery();
  const [createOrder, { isError, error }] = useCreateOrderMutation();
  const { data: architects, isLoading } = useListUsersQuery(Roles.ARCHITECT);

  const onSubmit: SubmitHandler<CreateOrderFormFields> = async (values) => {
    console.log("submit");

    if (modalProps.architectId) {
      await createOrder({
        ...values,
        architectId: modalProps.architectId,
      }).unwrap();

      await listOrders({ id: modalProps.customerId }).unwrap();

      setOpen({
        customerId: modalProps.customerId,
        open: false,
      });
    }
  };

  return (
    <Box>
      <Dialog
        fullScreen
        open={modalProps.open}
        onClose={() => {
          setOpen({ open: false, customerId: modalProps.customerId });
        }}
        TransitionComponent={Transition}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => {
                  setOpen({ open: false, customerId: modalProps.customerId });
                }}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Criar solicitação
              </Typography>
              <Button type="submit" autoFocus color="inherit">
                Salvar
              </Button>
            </Toolbar>
          </AppBar>
          {isLoading || !architects ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress
                sx={{
                  marginTop: 10,
                }}
              />
            </Box>
          ) : (
            <>
              <Grid container padding={3} spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    fullWidth
                    label="Prazo em dias"
                    error={!!errors.deadline}
                    helperText={
                      errors.deadline ? errors.deadline.message : undefined
                    }
                    {...register("deadline")}
                  />
                </Grid>
              </Grid>
              <Grid container paddingY={1} paddingX={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Detalhes do serviço"
                    placeholder="Insira os detalhes aqui..."
                    fullWidth
                    multiline
                    maxRows={12}
                    rows={12}
                    error={!!errors.detailsText}
                    helperText={
                      errors.detailsText
                        ? errors.detailsText.message
                        : undefined
                    }
                    {...register("detailsText")}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </form>
      </Dialog>
      {isError && error && <ErrorComponent isError={isError} error={error} />}
    </Box>
  );
}
