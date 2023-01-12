import React from "react";
import Box from "@mui/material/Box";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import Typography from "@mui/material/Typography";
import {
  DataGrid,
  GridActionsCellItem,
  GridActionsColDef,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { Order, OrderStatuses, User } from "../../../types";
import moment, { now } from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import jwtDecode from "jwt-decode";
import {
  useLazyListArchitectOrdersQuery,
  useListArchitectOrdersQuery,
  useUpdateMutation,
} from "../../../redux/apis/orders";
import CustomToolbar from "../../../components/custom-toolbar";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

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

export default function ArchitectDashboard(): JSX.Element {
  const token = useSelector((state: RootState) => state.auth.token);
  const customerId = (jwtDecode(token as string) as User).id;

  const [updateOrder] = useUpdateMutation();
  const [listOrders] = useLazyListArchitectOrdersQuery();

  const updateStatus = async (orderId: number, status: OrderStatuses) => {
    await updateOrder({
      data: { status },
      id: orderId,
    });

    await listOrders({ id: customerId });
  };

  const {
    data: orders,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    error: errorOrders,
  } = useListArchitectOrdersQuery({
    id: customerId,
  });

  const ORDERS_ACTION_COLS_DEF: GridActionsColDef[] = [
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<CheckIcon color="success" />}
          onClick={() => {
            updateStatus(params.row.id, OrderStatuses.ACCEPTED);
          }}
          label="Aceitar"
          showInMenu
          sx={{
            color: "green",
          }}
        />,
        <GridActionsCellItem
          icon={<CloseIcon color="error" />}
          onClick={() => {
            updateStatus(params.row.id, OrderStatuses.REFUSED);
          }}
          label="Recusar"
          showInMenu
          sx={{
            color: "red",
          }}
        />,
      ],
    },
  ];

  return (
    <Box padding={3}>
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
  );
}
