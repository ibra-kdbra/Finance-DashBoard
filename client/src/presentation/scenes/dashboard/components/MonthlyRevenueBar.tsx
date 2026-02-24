import React from "react";
import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import BoxHeader from "@/presentation/components/BoxHeader";
import DashboardBox from "@/presentation/components/DashboardBox";
import { nivoTheme } from "@/presentation/theme/theme";

type Props = {
  data: any[];
  gridArea: string;
};

const MonthlyRevenueBar = ({ data, gridArea }: Props) => {
  const { palette } = useTheme();
  const theme = nivoTheme(palette);

  return (
    <DashboardBox gridArea={gridArea}>
      <BoxHeader
        title="Revenue Month by Month"
        subtitle="graph representing the revenue month by month"
        sideText="+4%"
      />
      <ResponsiveBar
        data={data || []}
        theme={theme}
        keys={["revenue"]}
        indexBy="name"
        margin={{ top: 15, right: 20, bottom: 50, left: 50 }}
        padding={0.4}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={(palette as any).primary[500]}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "#38bcb2",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "#eed312",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
          {
            id: "gradientPrimary",
            type: "linearGradient",
            colors: [
              { offset: 0, color: (palette as any).primary[500], opacity: 1 },
              { offset: 100, color: (palette as any).primary[700], opacity: 0.8 },
            ],
          },
        ]}
        fill={[
          {
            match: {
              id: "revenue",
            },
            id: "gradientPrimary",
          },
        ]}
        borderRadius={6}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Month",
          legendPosition: "middle",
          legendOffset: 38,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          format: (v) => `${(v / 1000).toFixed(0)}k`,
          tickValues: 5,
        }}
        enableLabel={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        role="application"
        ariaLabel="Revenue month by month bar chart"
        barAriaLabel={(e) => `${e.id}: ${e.formattedValue} in month: ${e.indexValue}`}
        animate={true}
        motionConfig="gentle"
      />
    </DashboardBox>
  );
};

export default MonthlyRevenueBar;
