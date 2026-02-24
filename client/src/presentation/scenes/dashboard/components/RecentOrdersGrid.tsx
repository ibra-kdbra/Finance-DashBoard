import React from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import BoxHeader from "@/presentation/components/BoxHeader";
import DashboardBox from "@/presentation/components/DashboardBox";

type Props = {
  data: any[];
  gridArea: string;
};

const RecentOrdersGrid = ({ data, gridArea }: Props) => {
  const { palette } = useTheme();

  const transactionColumns = [
    {
      field: "_id",
      headerName: "id",
      flex: 1,
      renderCell: (params: GridCellParams) => params.row._id || params.row.id || "N/A",
    },
    {
      field: "buyer",
      headerName: "Buyer",
      flex: 0.67,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.35,
      renderCell: (params: GridCellParams) => params.value ? `$${params.value}` : "$0",
    },
    {
      field: "productIds",
      headerName: "Count",
      flex: 0.1,
      renderCell: (params: GridCellParams) =>
        (params.value as Array<string> || []).length,
    },
  ];

  return (
    <DashboardBox gridArea={gridArea}>
      <BoxHeader
        title="Recent Orders"
        sideText={`${data?.length} latest transactions`}
      />
      <Box
        mt="1rem"
        p="0 0.5rem"
        height="80%"
        sx={{
          "& .MuiDataGrid-root": {
            color: palette.grey[300],
            border: "none",
            fontFamily: "Outfit, sans-serif"
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${palette.grey[800]} !important`,
            color: palette.grey[200]
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: `1px solid ${palette.grey[800]} !important`,
            color: (palette as any).primary[400],
            fontSize: "13px"
          },
          "& .MuiDataGrid-columnSeparator": {
            visibility: "hidden",
          },
        }}
      >
        <DataGrid
          columnHeaderHeight={25}
          rowHeight={35}
          hideFooter={true}
          rows={data || []}
          columns={transactionColumns}
          getRowId={(row) => row._id || row.id}
        />
      </Box>
    </DashboardBox>
  );
};

export default RecentOrdersGrid;
