import DashboardBox from "@/presentation/components/DashboardBox";
import FlexBetween from "@/presentation/components/FlexBetween";
import { useGetKpisQuery } from "@/data/api/api";
import { Box, Button, Typography, useTheme } from "@mui/material";
import React, { useMemo, useState } from "react";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import regression, { DataPoint } from "regression";
import { motion } from "framer-motion";

const Predictions = () => {
  const { palette } = useTheme();
  const [isPredictions, setIsPredictions] = useState(false);
  const { data: kpiData } = useGetKpisQuery();

  const formattedData = useMemo(() => {
    if (!kpiData) return [];
    const monthData = kpiData[0].monthlyData;

    const formatted: Array<DataPoint> = monthData.map(
      ({ revenue }: any, i: number) => {
        return [i, revenue];
      }
    );
    const regressionLine = regression.linear(formatted);

    return monthData.map(({ month, revenue }: any, i: number) => {
      return {
        name: month,
        "Actual Revenue": revenue,
        "Regression Line": regressionLine.points[i][1],
        "Predicted Revenue": regressionLine.predict(i + 12)[1],
      };
    });
  }, [kpiData]);

  return (
    <DashboardBox
      width="100%"
      height="100%"
      p="1rem"
      overflow="hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ height: "100%", width: "100%" }}
      >
        <FlexBetween m="1rem 2.5rem" gap="1rem">
          <Box>
            <Typography variant="h3" sx={{ 
              background: (palette as any).background.neon,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Revenue and Predictions
            </Typography>
            <Typography variant="h6" sx={{ color: palette.grey[400] }}>
              charted revenue and predicted revenue based on a simple linear
              regression model
            </Typography>
          </Box>
          <Button
            onClick={() => setIsPredictions(!isPredictions)}
            sx={{
              color: palette.grey[900],
              background: (palette as any).background.neon,
              textTransform: "none",
              borderRadius: "0.5rem",
              padding: "0.5rem 1.5rem",
              fontWeight: "900",
              boxShadow: `0px 4px 15px rgba(${(palette as any).primary[500]}, 0.3)`,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: `0px 6px 20px rgba(${(palette as any).primary[500]}, 0.5)`,
                filter: "brightness(1.1)"
              },
            }}
          >
            {isPredictions ? "Hide" : "Show"} Predicted Revenue for Next Year
          </Button>
        </FlexBetween>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{
              top: 20,
              right: 75,
              left: 20,
              bottom: 80,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={palette.grey[800]} />
            <XAxis 
              dataKey="name" 
              tickLine={false} 
              axisLine={false}
              style={{ fontSize: "10px", fill: palette.grey[400] }}
            >
              <Label value="Month" offset={-5} position="insideBottom" fill={palette.grey[400]} />
            </XAxis>
            <YAxis
              domain={[12000, 26000]}
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px", fill: palette.grey[400] }}
              tickFormatter={(v) => `$${v}`}
            >
              <Label
                value="Revenue in USD"
                angle={-90}
                offset={-5}
                position="insideLeft"
                fill={palette.grey[400]}
              />
            </YAxis>
            <Tooltip 
              contentStyle={{
                backgroundColor: "rgba(13, 13, 16, 0.8)",
                border: `1px solid ${palette.grey[800]}`,
                borderRadius: "8px",
                backdropFilter: "blur(8px)"
              }}
            />
            <Legend verticalAlign="top" />
            <Line
              type="monotone"
              dataKey="Actual Revenue"
              stroke={(palette as any).primary[500]}
              strokeWidth={4}
              dot={{ r: 5, strokeWidth: 3, fill: (palette as any).primary[500] }}
              animationDuration={1500}
            />
            <Line
              type="monotone"
              dataKey="Regression Line"
              stroke={(palette as any).tertiary[500]}
              strokeWidth={2}
              dot={false}
              animationDuration={1500}
              strokeDasharray="5 5"
            />
            {isPredictions && (
              <Line
                strokeDasharray="5 5"
                dataKey="Predicted Revenue"
                stroke={(palette as any).secondary[500]}
                strokeWidth={3}
                animationDuration={1500}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </DashboardBox>
  );
};

export default Predictions;
