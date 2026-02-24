import React, { useMemo } from "react";
import { useTheme } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import BoxHeader from "@/presentation/components/BoxHeader";
import DashboardBox from "@/presentation/components/DashboardBox";
import { nivoTheme } from "@/presentation/theme/theme";

type Props = {
  data: any[];
  gridArea: string;
};

const RevenueExpensesArea = ({ data, gridArea }: Props) => {
  const { palette } = useTheme();
  const theme = nivoTheme(palette);

  const nivoData = useMemo(() => {
    if (!data) return [];
    return [
      {
        id: "revenue",
        color: (palette as any).primary[500],
        data: data.map((d) => ({ x: d.name, y: d.revenue })),
      },
      {
        id: "expenses",
        color: (palette as any).secondary[500],
        data: data.map((d) => ({ x: d.name, y: d.expenses })),
      },
    ];
  }, [data, palette]);

  return (
    <DashboardBox gridArea={gridArea}>
      <BoxHeader
        title="Revenue and Expenses"
        subtitle="top line represents revenue, bottom line represents expenses"
        sideText="+4%"
      />
      <ResponsiveLine
        data={nivoData}
        theme={theme}
        margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 10,
          tickRotation: 0,
          legend: "Fiscal Timeline",
          legendOffset: 45,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 10,
          tickRotation: 0,
          legend: "Revenue ($)",
          legendOffset: -45,
          legendPosition: "middle",
          format: (v) => `$${v / 1000}k`,
        }}
        enableGridX={false}
        colors={{ datum: "color" }}
        lineWidth={4}
        pointSize={8}
        pointColor={{ theme: "background" }}
        pointBorderWidth={3}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        enableArea={true}
        areaOpacity={0.15}
        useMesh={true}
        debugMesh={false}
        legends={[
          {
            anchor: "top-right",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: -10,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        defs={[
          {
            id: "gradientRevenue",
            type: "linearGradient",
            colors: [
              { offset: 0, color: (palette as any).primary[500], opacity: 1 },
              { offset: 100, color: (palette as any).primary[500], opacity: 0 },
            ],
          },
          {
            id: "gradientExpenses",
            type: "linearGradient",
            colors: [
              { offset: 0, color: (palette as any).secondary[500], opacity: 1 },
              { offset: 100, color: (palette as any).secondary[500], opacity: 0 },
            ],
          },
        ]}
        fill={[
          { match: { id: "revenue" }, id: "gradientRevenue" },
          { match: { id: "expenses" }, id: "gradientExpenses" },
        ]}
      />
    </DashboardBox>
  );
};

export default RevenueExpensesArea;
