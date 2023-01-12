import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import { useListUsersQuery } from "../../../redux/apis/users";
import { Order, OrderStatuses, Roles, User } from "../../../types";
import {
  GridActionsColDef,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid/models";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridActionsCellItem,
} from "@mui/x-data-grid/components";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import {
  useLazyListOrdersQuery,
  useListOrdersQuery,
  useUpdateMutation,
} from "../../../redux/apis/orders";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import jwtDecode from "jwt-decode";
import moment, { now } from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";
import EditOrderModal from "./components/EditOrderModal";
import CreateOrderModal from "./components/CreateOrderModal";
import AddIcon from "@mui/icons-material/Add";

const StatusMapper: { [key: string]: string } = {
  [OrderStatuses.ACCEPTED]: "Aceito",
  [OrderStatuses.OPENED]: "Em aberto",
  [OrderStatuses.REFUSED]: "Recusado",
  [OrderStatuses.DELETED]: "Excluído",
};

const isOrderExpired = (row: Order) =>
  moment(row.createdAt).add(row.deadlineInDays, "days").diff(now()) <= 0;

const getStatusColumnColor = (row: Order) => {
  const statusMapped = StatusMapper[row.status];
  const expired = isOrderExpired(row);

  let color: string;

  if (expired) color = "red";
  else {
    switch (row.status) {
      case OrderStatuses.ACCEPTED:
        color = "green";
        break;
      case OrderStatuses.DELETED:
        color = "orange";
        break;
      case OrderStatuses.REFUSED:
        color = "gray";
        break;
      default:
        color = "inherit";
        break;
    }
  }

  return (
    <Typography variant="body2" color={color}>
      {expired ? "Expirado" : statusMapped}
    </Typography>
  );
};

function CustomToolbar() {
  return (
    <GridToolbarContainer
      sx={{
        marginBottom: 1,
      }}
    >
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const ARCHITECTS_COLS_DEF: GridColDef[] = [
  {
    field: "id",
    headerName: "#",
    headerAlign: "center",
  },
  {
    field: "",
    headerName: "Nome",
    renderCell: (params: GridRenderCellParams) =>
      `${params.row.firstName} ${params.row.lastName}`,
    headerAlign: "center",
    width: 300,
  },
  {
    field: "email",
    headerName: "E-mail",
    headerAlign: "center",
    width: 300,
  },
];

const ORDERS_COLS_DEF: GridColDef[] = [
  {
    field: "id",
    headerName: "#",
    headerAlign: "center",
  },
  {
    field: "architect",
    headerName: "Arquiteto",
    renderCell: (params: GridRenderCellParams) => {
      return `${params.row.architect.firstName} ${params.row.architect.lastName}`;
    },
    headerAlign: "center",
    width: 300,
  },
  {
    field: "customer",
    headerName: "Cliente",
    renderCell: (params: GridRenderCellParams) => {
      return `${params.row.customer.firstName} ${params.row.customer.lastName}`;
    },
    headerAlign: "center",
    width: 300,
  },
  {
    field: "deadlineInDays",
    headerName: "Prazo",
    renderCell: (params: GridRenderCellParams) => {
      return `${params.row.deadlineInDays} dias`;
    },
    headerAlign: "center",
  },
  {
    field: "",
    headerName: "Status",
    renderCell: (params: GridRenderCellParams) =>
      getStatusColumnColor(params.row),
    headerAlign: "center",
  },
];

export default function CustomerDashboard(): JSX.Element {
  const token = useSelector((state: RootState) => state.auth.token);
  const customerId = (jwtDecode(token as string) as User).id;

  const [createOrderModal, setCreateOrderModal] = React.useState<{
    open: boolean;
    architectId?: number;
    customerId: number;
  }>({
    open: false,
    customerId,
  });
  const [editOrderModal, setEditOrderModal] = React.useState<{
    open: boolean;
    orderId?: number;
    customerId: number;
  }>({ open: false, customerId });
  const [updateOrder] = useUpdateMutation();
  const {
    data: architects,
    isLoading: isLoadingArchitects,
    isError: isErrorArchitects,
    error: errorArchitects,
  } = useListUsersQuery(Roles.ARCHITECT);
  const {
    data: orders,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    error: errorOrders,
  } = useListOrdersQuery({
    id: customerId,
  });
  const [listOrders, _] = useLazyListOrdersQuery();

  const deleteOrder = async (orderId: number) => {
    await updateOrder({
      data: { status: OrderStatuses.DELETED },
      id: orderId,
    }).unwrap();

    await listOrders({ id: customerId });
  };

  const restoreOrder = async (orderId: number) => {
    await updateOrder({
      data: { status: OrderStatuses.OPENED },
      id: orderId,
    });

    await listOrders({ id: customerId });
  };

  const ORDERS_ACTION_COLS_DEF: GridActionsColDef[] = [
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      getActions: (params) => {
        const isDeleted = params.row.status === OrderStatuses.DELETED;
        const isExpired = isOrderExpired(params.row);

        const RestoreOrder = () => (
          <GridActionsCellItem
            onClick={() => {
              restoreOrder(params.row.id);
            }}
            icon={<RestoreIcon />}
            label="Restaurar"
            showInMenu
          />
        );

        const DeleteOrder = () => (
          <GridActionsCellItem
            disabled={isExpired}
            onClick={() => {
              deleteOrder(params.row.id);
            }}
            icon={<DeleteIcon color="error" />}
            label="Excluir"
            showInMenu
            sx={{ color: "red" }}
          />
        );

        const EditOrder = () => (
          <GridActionsCellItem
            onClick={() => {
              setEditOrderModal({
                open: true,
                orderId: params.row.id,
                customerId,
              });
            }}
            icon={<EditIcon />}
            label="Editar"
            showInMenu
          />
        );

        const expiredOrderItems = [DeleteOrder()];
        const deletedOrderItems = [RestoreOrder()];
        const defaultItems = [DeleteOrder(), EditOrder()];

        if (isExpired) return expiredOrderItems;
        if (isDeleted) return deletedOrderItems;

        return defaultItems;
      },
    },
  ];

  const ARCHITECTS_ACTION_COLS_DEF: GridActionsColDef[] = [
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={<AddIcon />}
            onClick={() => {
              setCreateOrderModal({
                open: true,
                architectId: params.row.id,
                customerId,
              });
            }}
            label="Nova solicitação"
            showInMenu
          />,
        ];
      },
    },
  ];

  return (
    <Box height="90vh" overflow="auto">
      {editOrderModal.open && (
        <EditOrderModal
          modalProps={editOrderModal}
          setOpen={setEditOrderModal}
        />
      )}
      {createOrderModal.open && (
        <CreateOrderModal
          modalProps={createOrderModal}
          setOpen={setCreateOrderModal}
        />
      )}
      <Box padding={3}>
        <Stack spacing={5}>
          <Box>
            <Box display="flex" alignItems="center" marginBottom={1}>
              <ArchitectureIcon
                fontSize="large"
                sx={{
                  mr: 1,
                }}
              />
              <Typography fontFamily="Roboto-Thin" variant="h4">
                Lista de arquitetos
              </Typography>
            </Box>
            <DataGrid
              sx={{
                height: 500,
              }}
              columns={[...ARCHITECTS_COLS_DEF, ...ARCHITECTS_ACTION_COLS_DEF]}
              rows={architects || []}
              components={{
                Toolbar: CustomToolbar,
              }}
              loading={isLoadingArchitects}
              error={isErrorArchitects ? errorArchitects : undefined}
              localeText={{
                footerRowSelected(count) {
                  const gtOne = count > 1;

                  return `${count} linha${gtOne ? "s" : ""} selecionada${
                    gtOne ? "s" : ""
                  }`;
                },
                MuiTablePagination: {
                  labelDisplayedRows: ({ from, to, count }) =>
                    `${from} - ${to} de ${count}`,
                  labelRowsPerPage: "Linhas por página",
                },
                toolbarColumns: "Colunas",
                toolbarFilters: "Filtros",
                toolbarDensity: "Tamanho",
                toolbarExport: "Exportar",
                noRowsLabel: "Sem dados",
              }}
            />
          </Box>
          <Box>
            <Box display="flex" alignItems="center" marginBottom={1}>
              <BookmarkBorderIcon
                fontSize="large"
                sx={{
                  mr: 1,
                }}
              />
              <Typography fontFamily="Roboto-Thin" variant="h4">
                Lista de solicitações
              </Typography>
            </Box>
            <DataGrid
              sx={{
                height: 500,
              }}
              columns={[...ORDERS_COLS_DEF, ...ORDERS_ACTION_COLS_DEF]}
              rows={orders || []}
              components={{
                Toolbar: CustomToolbar,
              }}
              loading={isLoadingOrders}
              error={isErrorOrders ? errorOrders : undefined}
              localeText={{
                footerRowSelected(count) {
                  const gtOne = count > 1;

                  return `${count} linha${gtOne ? "s" : ""} selecionada${
                    gtOne ? "s" : ""
                  }`;
                },
                MuiTablePagination: {
                  labelDisplayedRows: ({ from, to, count }) =>
                    `${from} - ${to} de ${count}`,
                  labelRowsPerPage: "Linhas por página",
                },
                toolbarColumns: "Colunas",
                toolbarFilters: "Filtros",
                toolbarDensity: "Tamanho",
                toolbarExport: "Exportar",
                noRowsLabel: "Sem dados",
              }}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
