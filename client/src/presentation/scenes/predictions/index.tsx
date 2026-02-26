import { Box, Button, Typography, useTheme, Divider, Grid } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useGetKpisQuery } from "@/data/api/api";
import DashboardBox from "@/presentation/components/DashboardBox";
import FlexBetween from "@/presentation/components/FlexBetween";
import {
  ResponsiveLine,
} from "@nivo/line";
import { nivoTheme } from "@/presentation/theme/theme";
import regression, { DataPoint } from "regression";
import { motion } from "framer-motion";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { MenuItem, Select } from "@mui/material";

const Predictions = () => {
  const { palette } = useTheme();
  const [isPredictions, setIsPredictions] = useState(false);
  const [modelType, setModelType] = useState<"linear" | "exponential" | "polynomial">("linear");
  const [anchorMode, setAnchorMode] = useState<"trendline" | "actual">("actual");
  const { data: kpiData } = useGetKpisQuery();

  const formattedData = useMemo(() => {
    if (!kpiData) return [];
    const monthlyData = kpiData[0].monthlyData;
    const dataPoints: Array<DataPoint> = monthlyData.map(
      ({ revenue }, i: number) => [i, Number(revenue)]
    );

    let regressionLine;
    switch (modelType) {
      case "exponential":
        regressionLine = regression.exponential(dataPoints);
        break;
      case "polynomial":
        regressionLine = regression.polynomial(dataPoints, { order: 3 });
        break;
      default:
        regressionLine = regression.linear(dataPoints);
    }

    const actualData = monthlyData.map(({ month, revenue }, i: number) => {
      const isLast = i === monthlyData.length - 1;
      return {
        name: month.substring(0, 3),
        "Actual Revenue": Number(revenue),
        "Regression Line": regressionLine.points[i][1],
        "Predicted Revenue": isLast ? (anchorMode === "actual" ? Number(revenue) : regressionLine.points[i][1]) : null,
      };
    });

    const futureMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const lastMonthIndex = monthlyData.length;
    

    const futureData = Array.from({ length: 9 }).map((_, i) => {
      const monthIndex = (lastMonthIndex + i) % 12;
      const prediction = regressionLine.predict(lastMonthIndex + i)[1];
      
      let finalPrediction = prediction;
      if (anchorMode === "actual") {
         // Mean Reversion Blending: Smoothly curve the anomaly back to the trendline
         const shiftOffset = Number(monthlyData[lastMonthIndex - 1].revenue) - regressionLine.points[lastMonthIndex - 1][1];
         // i is the month block (0 is the first future month). We use exponential decay (0.5)
         const decayFactor = Math.pow(0.5, i + 1);
         finalPrediction = prediction + (shiftOffset * decayFactor);
      }

      return {
        name: futureMonths[monthIndex],
        "Actual Revenue": null,
        "Regression Line": null,
        "Predicted Revenue": finalPrediction > 0 ? finalPrediction : 0,
      };
    });

    return { data: [...actualData, ...futureData], r2: regressionLine.r2, regressionLine };
  }, [kpiData, modelType, anchorMode]);

  const insights = useMemo(() => {
    if (!formattedData.data?.length) return null;
    const forecasts = formattedData.data.filter((d: any) => d["Predicted Revenue"] !== null);
    
    // Calculate final shift mathematically using the true peak of the active line
    let diff;
    if (anchorMode === "actual") {
      const actuals = formattedData.data.filter((d: any) => d["Actual Revenue"] !== null);
      const lastActual = actuals[actuals.length - 1]["Actual Revenue"];
      const futureProjPeak = forecasts[forecasts.length - 1]["Predicted Revenue"];
      diff = ((futureProjPeak - lastActual) / Math.abs(lastActual)) * 100;
    } else {
      const actuals = formattedData.data.filter((d: any) => d["Actual Revenue"] !== null);
      const currentTrendValue = formattedData.regressionLine.points[actuals.length - 1][1];
      const futurePeak = forecasts[forecasts.length - 1]["Predicted Revenue"];
      diff = ((futurePeak - currentTrendValue) / Math.abs(currentTrendValue)) * 100;
    }
    
    const modelDescriptions = {
      linear: "Trailing revenue analysis via Ordinary Least Squares (OLS) models a linear progression vector.",
      exponential: "Log-linear extrapolations capture compounding momentum vs decay in financial velocity.",
      polynomial: "Cubic polynomial synthesis models complex inflexion points and cyclical resistance."
    };

    return {
      trend: diff > 0 ? "Bullish Expansion" : "Bearish Contraction",
      percentage: Math.abs(diff).toFixed(2),
      rawValue: diff,
      confidence: `${(formattedData.r2 * 100).toFixed(0)}% Accuracy`,
      r2: formattedData.r2,
      description: `Mathematical extrapolation applied: ${modelDescriptions[modelType]} Assuming a persistence of vector momentum, the regression path calculates a ${diff > 0 ? "positive structural shift" : "negative structural correction"} spanning the 9-month horizon.`
    };
  }, [formattedData, modelType, anchorMode]);

  return (
    <Box width="100%" height="100%" p="1.5rem" className="app-container">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <DashboardBox width="100%" height="100%" p="2rem" overflow="hidden">
          <FlexBetween mb="1.5rem">
            <Box display="flex" alignItems="center" gap="0.75rem">
              <AutoGraphIcon sx={{ fontSize: "2rem", color: (palette as any).primary[500] }} />
              <Box>
                <Typography variant="h2" fontWeight="bold">
                  Intelligence Layer: <Typography variant="h2" component="span" sx={{ color: (palette as any).primary[400] }}>Forecasting</Typography>
                </Typography>
                <Typography variant="h5" color={palette.grey[400]}>
                  Multi-variable regression models for strategic revenue projection
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap="1rem">
              <Select
                value={anchorMode}
                onChange={(e) => setAnchorMode(e.target.value as any)}
                displayEmpty
                sx={{
                  bgcolor: "rgba(255,255,255,0.03)",
                  borderRadius: "0.5rem",
                  "& .MuiSelect-select": { py: "0.75rem", px: "1.5rem", fontWeight: 600 },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: palette.grey[800] }
                }}
              >
                <MenuItem value="actual">Business: Actual Anchor</MenuItem>
                <MenuItem value="trendline">Math: Trendline Anchor</MenuItem>
              </Select>
              <Select
                value={modelType}
                onChange={(e) => setModelType(e.target.value as any)}
                displayEmpty
                sx={{
                  bgcolor: "rgba(255,255,255,0.03)",
                  borderRadius: "0.5rem",
                  "& .MuiSelect-select": { py: "0.75rem", px: "1.5rem", fontWeight: 600 },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: palette.grey[800] }
                }}
              >
                <MenuItem value="linear">Linear Engine</MenuItem>
                <MenuItem value="exponential">Exponential Growth</MenuItem>
                <MenuItem value="polynomial">Polynomial Synthesis</MenuItem>
              </Select>
                <Button
                onClick={() => setIsPredictions(!isPredictions)}
                sx={{
                  background: isPredictions
                    ? `linear-gradient(135deg, ${(palette as any).secondary[500]}, ${(palette as any).primary[400]})`
                    : "rgba(255, 255, 255, 0.04)",
                  color: isPredictions ? "#0d0d14" : palette.grey[300],
                  border: isPredictions
                    ? "1px solid transparent"
                    : `1px solid ${palette.grey[800]}`,
                  p: "0.75rem 2rem",
                  borderRadius: "0.75rem",
                  fontWeight: "bold",
                  boxShadow: isPredictions
                    ? `0 0 25px ${(palette as any).primary[500]}, 0 0 60px rgba(26, 255, 214, 0.15)`
                    : "none",
                  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    background: isPredictions
                      ? `linear-gradient(135deg, ${(palette as any).secondary[400]}, ${(palette as any).primary[300]})`
                      : "rgba(255, 255, 255, 0.08)",
                    borderColor: isPredictions
                      ? "transparent"
                      : (palette as any).primary[500],
                    boxShadow: `0 0 20px rgba(129, 140, 248, 0.3), 0 0 40px rgba(129, 140, 248, 0.1)`,
                    transform: "translateY(-1px)",
                  },
                  "&:active": {
                    transform: "scale(0.97)",
                    boxShadow: `0 0 30px ${(palette as any).secondary[500]}, 0 0 60px rgba(26, 255, 214, 0.25)`,
                    background: `linear-gradient(135deg, ${(palette as any).secondary[500]}, ${(palette as any).primary[500]})`,
                    color: "#0d0d14",
                  },
                }}
              >
                {isPredictions ? "Disable Simulation" : "Initialize Engine"}
              </Button>
            </Box>
          </FlexBetween>

          <Divider sx={{ mb: "2rem", borderColor: palette.grey[800] }} />

          <Grid container spacing={3} sx={{ height: "65vh" }}>
            <Grid size={{ xs: 12, lg: 9 }}>
              <ResponsiveLine
                data={[
                  {
                    id: "Actual Revenue",
                    color: palette.grey[100],
                    data: formattedData.data
                      .filter((d: any) => d["Actual Revenue"] != null && !isNaN(d["Actual Revenue"]))
                      .map((d: any) => ({ x: d.name, y: d["Actual Revenue"] }))
                  },
                  {
                    id: "Trendline",
                    color: (palette as any).tertiary[500],
                    data: formattedData.data
                      .filter((d: any) => d["Regression Line"] != null && !isNaN(d["Regression Line"]))
                      .map((d: any) => ({ x: d.name, y: d["Regression Line"] }))
                  },
                  ...(isPredictions ? [{
                    id: "Forecast",
                    color: (palette as any).secondary[500],
                    data: formattedData.data
                      .filter((d: any) => d["Predicted Revenue"] != null && !isNaN(d["Predicted Revenue"]))
                      .map((d: any) => ({ x: d.name, y: d["Predicted Revenue"] }))
                  }] : [])
                ]}
                theme={nivoTheme(palette)}
                margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 10,
                  tickRotation: 0,
                  legend: "Fiscal Timeline",
                  legendPosition: "middle",
                  legendOffset: 45
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 10,
                  tickRotation: 0,
                  legend: "Revenue ($)",
                  legendPosition: "middle",
                  legendOffset: -45,
                  format: (v) => `$${v / 1000}k`
                }}
                enableGridX={false}
                colors={{ datum: "color" }}
                lineWidth={4}
                curve="monotoneX"
                pointSize={8}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                useMesh={true}
                legends={[
                  {
                    anchor: "top-right",
                    direction: "row",
                    justify: false,
                    translateX: 0,
                    translateY: -10,
                    itemsSpacing: 0,
                    itemDirection: "left-to-right",
                    itemWidth: 100,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: "circle"
                  }
                ]}
              />
            </Grid>

            <Grid size={{ xs: 12, lg: 3 }}>
              <Box display="flex" flexDirection="column" gap="1.5rem" height="100%">
                <Box bgcolor={palette.grey[900]} p="1.5rem" borderRadius="1rem" border={`1px solid ${palette.grey[800]}`}>
                  <Box display="flex" alignItems="center" gap="0.5rem" mb="1rem">
                    <TrendingUpIcon sx={{ color: (palette as any).secondary[500] }} />
                    <Typography variant="h3">Forecast Breakdown</Typography>
                  </Box>
                  <Typography variant="h5" color={palette.grey[400]}>
                    Trend: <Typography component="span" fontWeight="bold" variant="h5" color={(palette as any).secondary[500]}>{insights?.trend}</Typography>
                  </Typography>
                  <Typography variant="h5" color={palette.grey[400]} mt="0.5rem">
                    Projected Shift: <Typography component="span" fontWeight="bold" variant="h5" color={palette.grey[100]}>{(insights?.rawValue ?? 0) > 0 ? "+" : ""}{insights?.percentage}%</Typography>
                  </Typography>
                </Box>

                <Box bgcolor={palette.grey[900]} p="1.5rem" borderRadius="1rem" border={`1px solid ${palette.grey[800]}`} flexGrow={1}>
                  <Box display="flex" alignItems="center" gap="0.5rem" mb="1rem">
                    <InfoOutlinedIcon sx={{ color: (palette as any).primary[500] }} />
                    <Typography variant="h3">Dynamic Insights</Typography>
                  </Box>
                  <Typography variant="h5" color={palette.grey[300]} lineHeight="1.6">
                    {insights?.description}
                  </Typography>
                  <Box mt="2.5rem">
                    <Typography variant="h5" color={palette.grey[400]} mb="0.75rem">Model Confidence</Typography>
                    <Box height="6px" bgcolor={palette.grey[800]} borderRadius="3px">
                      <Box width={`${(insights?.r2 ?? 0) * 100}%`} height="100%" bgcolor={(palette as any).primary[500]} borderRadius="3px" sx={{ transition: "width 1s ease-in-out" }} />
                    </Box>
                    <Typography variant="h5" color={palette.grey[100]} mt="0.5rem" textAlign="right">{insights?.confidence}</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DashboardBox>
      </motion.div>
    </Box>
  );
};

export default Predictions;
