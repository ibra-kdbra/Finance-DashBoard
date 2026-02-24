import React from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import BoxHeader from "@/presentation/components/BoxHeader";
import DashboardBox from "@/presentation/components/DashboardBox";

type Props = {
  data: any[];
  gridArea: string;
};

const ProductListGrid = ({ data, gridArea }: Props) => {
  const { palette } = useTheme();

  const productColumns = [
    {
      field: "_id",
      headerName: "id",
      flex: 1,
      renderCell: (params: GridCellParams) => params.row._id || params.row.id || "N/A",
    },
    {
      field: "expense",
      headerName: "Expense",
      flex: 0.5,
      renderCell: (params: GridCellParams) => params.value ? `$${params.value}` : "$0",
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      renderCell: (params: GridCellParams) => params.value ? `$${params.value}` : "$0",
    },
  ];

  return (
    <DashboardBox gridArea={gridArea}>
      <BoxHeader
        title="List of Products"
        sideText={`${data?.length} products`}
      />
      <Box
        mt="0.5rem"
        p="0 0.5rem"
        height="75%"
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
            fontWeight: "bold",
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
          columns={productColumns}
          getRowId={(row) => row._id || row.id}
        />
      </Box>
    </DashboardBox>
  );
};

export default ProductListGrid;
