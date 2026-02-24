import React, { useMemo } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import BoxHeader from "@/presentation/components/BoxHeader";
import DashboardBox from "@/presentation/components/DashboardBox";
import { nivoTheme } from "@/presentation/theme/theme";

type Props = {
  data: any[];
  gridArea: string;
};

const PriceExpenseScatter = ({ data, gridArea }: Props) => {
  const { palette } = useTheme();
  const theme = nivoTheme(palette);

  const nivoData = useMemo(() => {
    if (!data) return [];
    return [
      {
        id: "Product Expense Ratio",
        data: data.map((d) => ({
          x: d.price,
          y: d.expense,
        })),
      },
    ];
  }, [data]);

  return (
    <DashboardBox gridArea={gridArea}>
      <BoxHeader title="Product Prices vs Expenses" sideText="+4%" />
      <Box flexGrow={1} minHeight={0} width="100%" mt={gridArea === "" ? "1rem" : 0}>
        <ResponsiveScatterPlot
          data={nivoData}
          theme={theme}
          margin={gridArea === "" ? { top: 40, right: 60, bottom: 80, left: 80 } : { top: 20, right: 30, bottom: 60, left: 60 }}
          xScale={{ type: "linear", min: "auto", max: "auto" }}
          yScale={{ type: "linear", min: "auto", max: "auto" }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 10,
            tickRotation: 0,
            legend: "Price ($)",
            legendPosition: "middle",
            legendOffset: gridArea === "" ? 55 : 45,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 10,
            tickRotation: 0,
            legend: "Expense ($)",
            legendPosition: "middle",
            legendOffset: gridArea === "" ? -55 : -45,
            format: (v) => `$${v}`,
          }}
          colors={(palette as any).tertiary[500]}
          nodeSize={gridArea === "" ? 18 : 10}
          useMesh={true}
          debugMesh={false}
          enableGridX={false}
          enableGridY={true}
          tooltip={({ node }) => (
            <Box
              sx={{
                background: "rgba(13, 13, 20, 0.95)",
                p: "1rem",
                borderRadius: "12px",
                border: `1px solid ${palette.grey[800]}`,
                backdropFilter: "blur(20px)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              <Typography color={palette.grey[100]} fontWeight={700}>
                Price: ${node.data.x}
              </Typography>
              <Typography color={(palette as any).primary[400]} fontWeight={500}>
                Expense: ${node.data.y}
              </Typography>
            </Box>
          )}
        />
      </Box>
    </DashboardBox>
  );
};

export default PriceExpenseScatter;
