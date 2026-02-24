import React from "react";
import { useTheme } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import BoxHeader from "@/presentation/components/BoxHeader";
import DashboardBox from "@/presentation/components/DashboardBox";

type Props = {
  data: any[];
  gridArea: string;
};

const OperationalExpensesLine = ({ data, gridArea }: Props) => {
  const { palette } = useTheme();

  return (
    <DashboardBox gridArea={gridArea}>
      <BoxHeader
        title="Operational vs Non-Operational Expenses"
        sideText="+4%"
      />
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 0,
            left: -10,
            bottom: 55,
          }}
        >
          <CartesianGrid vertical={false} stroke={palette.grey[800]} strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            style={{ fontSize: "10px", fill: palette.grey[400] }}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tickLine={false}
            axisLine={false}
            style={{ fontSize: "10px", fill: palette.grey[400] }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            style={{ fontSize: "10px", fill: palette.grey[400] }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(13, 13, 16, 0.9)",
              border: `1px solid ${palette.grey[800]}`,
              borderRadius: "12px",
              backdropFilter: "blur(40px)"
            }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Non Operational Expenses"
            stroke={(palette as any).tertiary[500]}
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: (palette as any).tertiary[500] }}
            animationDuration={2000}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="Operational Expenses"
            stroke={(palette as any).primary[500]}
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: (palette as any).primary[500] }}
            animationDuration={2000}
          />
        </LineChart>
      </ResponsiveContainer>
    </DashboardBox>
  );
};

export default OperationalExpensesLine;
