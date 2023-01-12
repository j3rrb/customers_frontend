import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { Buffer } from "buffer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";
import { Slide } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import EditOrderFormValidation from "./formValidation";
import { EditOrderFormFields, Roles } from "../../../../../types";
import {
  useLazyGetOrderQuery,
  useLazyListOrdersQuery,
  useUpdateMutation,
} from "../../../../../redux/apis/orders";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import ErrorComponent from "../../../../../components/error";
import { useLazyListUsersQuery } from "../../../../../redux/apis/users";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";

type Props = {
  modalProps: {
    open: boolean;
    orderId?: number;
    customerId: number;
  };
  setOpen: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      orderId?: number;
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

export default function EditOrderModal({
  modalProps,
  setOpen,
}: Props): JSX.Element {
  const [
    updateOrder,
    { isError: isErrorUpdate, error: errorUpdate, isLoading: isLoadingUpdate },
  ] = useUpdateMutation();
  const [listOrders, _] = useLazyListOrdersQuery();
  const [getOrder, { data: order, isLoading: isLoadingOrder }] =
    useLazyGetOrderQuery();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<EditOrderFormFields>({
    mode: "onChange",
    resolver: yupResolver(EditOrderFormValidation),
    values: {
      deadline: order?.deadlineInDays,
    },
  });

  const onSubmit: SubmitHandler<EditOrderFormFields> = async (values) => {
    if (modalProps.orderId) {
      await updateOrder({
        id: modalProps.orderId,
        data: values,
      }).unwrap();

      await listOrders({ id: modalProps.customerId }).unwrap();

      setOpen({ open: false, customerId: modalProps.customerId });
    }
  };

  React.useEffect(() => {
    if (modalProps.orderId) {
      getOrder(modalProps.orderId);
    }
  }, [modalProps]);

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
                Editar solicitação
              </Typography>
              <Button type="submit" autoFocus color="inherit">
                Salvar
              </Button>
            </Toolbar>
          </AppBar>
          {isLoadingOrder || !order || isLoadingUpdate ? (
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
                    defaultValue={Buffer.from(order.detailsText).toString()}
                    error={!!errors.detailsText}
                    helperText={
                      errors.detailsText ? errors.detailsText.message : undefined
                    }
                    {...register("detailsText")}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </form>
      </Dialog>
      {isErrorUpdate && errorUpdate && (
        <ErrorComponent isError={isErrorUpdate} error={errorUpdate} />
      )}
    </Box>
  );
}
