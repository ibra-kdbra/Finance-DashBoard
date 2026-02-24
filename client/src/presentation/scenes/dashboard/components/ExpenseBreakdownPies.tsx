import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import BoxHeader from "@/presentation/components/BoxHeader";
import DashboardBox from "@/presentation/components/DashboardBox";
import { nivoTheme } from "@/presentation/theme/theme";

type Props = {
  data: any[][];
  gridArea: string;
};

const ExpenseBreakdownPies = ({ data, gridArea }: Props) => {
  const { palette } = useTheme();
  const theme = nivoTheme(palette);
  const pieColors = [(palette as any).primary[500], (palette as any).secondary[500]];

  return (
    <DashboardBox gridArea={gridArea}>
      <BoxHeader title="Expense Breakdown By Category" sideText="+4%" />
      <Box 
        display="flex" 
        justifyContent={gridArea === "" ? "center" : "space-between"} 
        gap={gridArea === "" ? "4rem" : "0.5rem"} 
        p={gridArea === "" ? "2rem 4rem" : "0 1rem"} 
        mt={gridArea === "" ? "3rem" : "0.5rem"}
        textAlign="center"
        flexGrow={gridArea === "" ? 1 : 0}
      >
        {data?.map((item, i) => {
          const nivoPieData = item.map((entry, index) => ({
            id: entry.name,
            label: entry.name,
            value: entry.value,
            color: pieColors[index],
          }));

          return (
            <Box key={`${item[0].name}-${i}`} display="flex" flexDirection="column" alignItems="center" flex={gridArea === "" ? 1 : undefined}>
              <Box height={gridArea === "" ? "450px" : "100px"} width={gridArea === "" ? "100%" : "110px"}>
                <ResponsivePie
                  data={nivoPieData}
                  theme={theme}
                  margin={gridArea === "" ? { top: 20, right: 20, bottom: 20, left: 20 } : { top: 10, right: 10, bottom: 10, left: 10 }}
                  innerRadius={0.65}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={gridArea === "" ? 12 : 8}
                  colors={{ datum: "data.color" }}
                  borderWidth={0}
                  enableArcLinkLabels={gridArea === ""}
                  arcLinkLabelsTextColor={palette.grey[300]}
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  enableArcLabels={false}
                  isInteractive={true}
                />
              </Box>
              <Typography variant={gridArea === "" ? "h3" : "h5"} sx={{ color: (palette as any).primary[400], mt: gridArea === "" ? "2rem" : "0.25rem", fontWeight: "bold" }}>
                {item[0].name}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </DashboardBox>
  );
};

export default ExpenseBreakdownPies;
