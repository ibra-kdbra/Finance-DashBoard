import BoxHeader from "@/presentation/components/BoxHeader";
import DashboardBox from "@/presentation/components/DashboardBox";
import { useGetKpisQuery } from "@/data/api/api";
import { useTheme } from "@mui/material";
import { useMemo } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  BarChart,
  Bar,
  LineChart,
  XAxis,
  YAxis,
  Legend,
  Line,
  Tooltip,
  Area,
} from "recharts";

const Row1 = () => {
  const { palette } = useTheme();
  const { data } = useGetKpisQuery();

  const revenue = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue }) => {
        return {
          name: month.substring(0, 3),
          revenue: revenue,
        };
      })
    );
  }, [data]);

  const revenueExpenses = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue, expenses }) => {
        return {
          name: month.substring(0, 3),
          revenue: revenue,
          expenses: expenses,
        };
      })
    );
  }, [data]);

  const revenueProfit = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue, expenses }) => {
        return {
          name: month.substring(0, 3),
          revenue: revenue,
          profit: (revenue - expenses).toFixed(2),
        };
      })
    );
  }, [data]);

  return (
    <>
      <DashboardBox gridArea="a">
        <BoxHeader
          title="Revenue and Expenses"
          subtitle="top line represents revenue, bottom line represents expenses"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={revenueExpenses}
            margin={{
              top: 15,
              right: 25,
              left: -10,
              bottom: 60,
            }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={(palette as any).primary[500]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={(palette as any).primary[500]}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={(palette as any).tertiary[500]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={(palette as any).tertiary[500]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={palette.grey[800]} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px", fill: palette.grey[400] }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px", fill: palette.grey[400] }}
              domain={[8000, 23000]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(13, 13, 16, 0.8)",
                border: `1px solid ${palette.grey[800]}`,
                borderRadius: "8px",
                backdropFilter: "blur(8px)"
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              dot={{ r: 3, strokeWidth: 2, fill: (palette as any).primary[500] }}
              stroke={(palette as any).primary[500]}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              dot={{ r: 3, strokeWidth: 2, fill: (palette as any).tertiary[500] }}
              stroke={(palette as any).tertiary[500]}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorExpenses)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="b">
        <BoxHeader
          title="Profit and Revenue"
          subtitle="top line represents revenue, bottom line represents expenses"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={400}
            data={revenueProfit}
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
                backgroundColor: "rgba(13, 13, 16, 0.8)",
                border: `1px solid ${palette.grey[800]}`,
                borderRadius: "8px",
                backdropFilter: "blur(8px)"
              }}
            />
            <Legend
              height={20}
              wrapperStyle={{
                margin: "0 0 10px 0",
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="profit"
              stroke={(palette as any).tertiary[500]}
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: (palette as any).tertiary[500] }}
              animationDuration={1500}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke={(palette as any).primary[500]}
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: (palette as any).primary[500] }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="c">
        <BoxHeader
          title="Revenue Month by Month"
          subtitle="graph representing the revenue month by month"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={revenue}
            margin={{
              top: 17,
              right: 15,
              left: -5,
              bottom: 58,
            }}
          >
            <defs>
              <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={(palette as any).primary[300]}
                  stopOpacity={1}
                />
                <stop
                  offset="100%"
                  stopColor={(palette as any).primary[800]}
                  stopOpacity={0.8}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={palette.grey[800]} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px", fill: palette.grey[400] }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px", fill: palette.grey[400] }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(13, 13, 16, 0.8)",
                border: `1px solid ${palette.grey[800]}`,
                borderRadius: "8px",
                backdropFilter: "blur(8px)"
              }}
            />
            <Bar dataKey="revenue" fill="url(#colorBar)" radius={[4, 4, 0, 0]} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  );
};

export default Row1;
