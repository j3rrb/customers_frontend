import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import { useListAllQuery } from "../../../redux/apis/users";
import { Roles } from "../../../types";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid/models";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid/components";
import CircularProgress from "@mui/material/CircularProgress";

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

const COLS_DEF: GridColDef[] = [
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

export default function CustomerDashboard(): JSX.Element {
  const { data, isLoading, isError, error } = useListAllQuery(Roles.ARCHITECT);

  console.log("useffect");

  return isLoading ? (
    <CircularProgress />
  ) : (
    <Box padding={2}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h4" marginBottom={2}>
            Lista de arquitetos
          </Typography>
          <DataGrid
            autoHeight
            columns={COLS_DEF}
            rows={isLoading ? [] : data}
            components={{
              Toolbar: CustomToolbar,
            }}
            loading={isLoading}
            error={isError ? error : undefined}
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
            }}
          />
        </Box>
        <Box>
          <Typography variant="h4" marginBottom={2}>
            Lista de solicitações
          </Typography>
          <DataGrid
            autoHeight
            columns={COLS_DEF}
            rows={isLoading ? [] : data}
            components={{
              Toolbar: CustomToolbar,
            }}
            loading={isLoading}
            error={isError ? error : undefined}
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
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
}
