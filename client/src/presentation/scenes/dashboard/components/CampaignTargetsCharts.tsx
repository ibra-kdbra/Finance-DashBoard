import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { PieChart, Pie, Cell } from "recharts";
import FlexBetween from "@/presentation/components/FlexBetween";
import BoxHeader from "@/presentation/components/BoxHeader";
import DashboardBox from "@/presentation/components/DashboardBox";

const pieData = [
  { name: "Group A", value: 600 },
  { name: "Group B", value: 400 },
];

type Props = {
  gridArea: string;
};

const CampaignTargetsCharts = ({ gridArea }: Props) => {
  const { palette } = useTheme();
  const pieColors = [(palette as any).primary[500], (palette as any).tertiary[500]];

  return (
    <DashboardBox gridArea={gridArea}>
      <BoxHeader title="Campaigns and Targets" sideText="+4%" />
      {gridArea === "" ? (
        <Box display="flex" flexGrow={1} alignItems="center" justifyContent="center" gap="4rem" p="2rem">
          <PieChart width={400} height={400}>
            <Pie
              stroke="none"
              data={pieData}
              innerRadius={100}
              outerRadius={180}
              paddingAngle={2}
              dataKey="value"
              animationDuration={2000}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index]} />
              ))}
            </Pie>
          </PieChart>
          <Box display="flex" flexDirection="column" gap="4rem">
            <Box textAlign="center">
              <Typography variant="h3" color={palette.grey[100]}>Target Sales Achievement</Typography>
              <Typography m="0.5rem 0" variant="h1" fontWeight={800} sx={{ 
                background: `linear-gradient(135deg, ${(palette as any).primary[400]}, ${(palette as any).secondary[400]})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 20px rgba(26, 255, 214, 0.4))",
                fontSize: "6rem"
              }}>
                83%
              </Typography>
              <Typography variant="h5" color={palette.grey[400]}>
                Finance goals of the campaign currently tracking above projected threshold.
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-around">
              <Box textAlign="center">
                <Typography variant="h4" color={palette.grey[100]}>Revenue Retention</Typography>
                <Typography variant="h5" mt="0.5rem" color={(palette as any).secondary[500]}>Losses are down 25% YoY</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" color={palette.grey[100]}>Profit Margins</Typography>
                <Typography variant="h5" mt="0.5rem" color={(palette as any).primary[400]}>Margins expanded by 30%</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <FlexBetween mt="0.25rem" gap="1.5rem" pr="1rem">
          <PieChart
            width={110}
            height={100}
            margin={{ top: 0, right: -10, left: 10, bottom: 0 }}
          >
            <Pie
              stroke="none"
              data={pieData}
              innerRadius={18}
              outerRadius={38}
              paddingAngle={2}
              dataKey="value"
              animationDuration={2000}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index]} />
              ))}
            </Pie>
          </PieChart>
          <Box ml="-0.7rem" flexBasis="40%" textAlign="center">
            <Typography variant="h5">Target Sales</Typography>
            <Typography m="0.3rem 0" variant="h3" sx={{ 
              background: (palette as any).background.neon,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 10px rgba(26, 255, 214, 0.3))"
            }}>
              83
            </Typography>
            <Typography variant="h6">
              Finance goals of the campaign that is desired
            </Typography>
          </Box>
          <Box flexBasis="40%">
            <Typography variant="h5">Losses in Revenue</Typography>
            <Typography variant="h6" color={(palette as any).secondary[500]}>Losses are down 25%</Typography>
            <Typography mt="0.4rem" variant="h5">
              Profit Margins
            </Typography>
            <Typography variant="h6" color={(palette as any).primary[500]}>
              Margins are up by 30% from last month.
            </Typography>
          </Box>
        </FlexBetween>
      )}
    </DashboardBox>
  );
};

export default CampaignTargetsCharts;
