import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import BoxHeader from "@/presentation/components/BoxHeader";
import DashboardBox from "@/presentation/components/DashboardBox";

type Props = {
  gridArea: string;
};

const SummaryBox = ({ gridArea }: Props) => {
  const { palette } = useTheme();

  return (
    <DashboardBox gridArea={gridArea}>
      <BoxHeader
        title="Financial Summary"
        sideText="+15%"
      />
      {/* Progress Bar */}
      <Box
        height={gridArea === "" ? "24px" : "10px"}
        margin={gridArea === "" ? "4rem 4rem 2rem 4rem" : "0.75rem 1rem 0.5rem 1rem"}
        bgcolor="rgba(255,255,255,0.04)"
        borderRadius="1rem"
        overflow="hidden"
        border={`1px solid ${palette.grey[800]}`}
      >
        <Box
          height="100%"
          sx={{
            background: `linear-gradient(90deg, ${(palette as any).primary[500]}, ${(palette as any).secondary[500]})`,
            borderRadius: "1rem",
            width: "72%",
            boxShadow: `0 0 12px ${(palette as any).primary[500]}, 0 0 24px rgba(26, 255, 214, 0.15)`,
          }}
        />
      </Box>

      {/* KPI Row */}
      <Box display="flex" justifyContent="space-between" px={gridArea === "" ? "4rem" : "1rem"} mt={gridArea === "" ? "2rem" : "0.5rem"} gap={gridArea === "" ? "4rem" : "0.5rem"}>
        <Box textAlign="center" flex={1}>
          <Typography
            variant={gridArea === "" ? "h1" : "h3"}
            fontWeight={800}
            sx={{
              background: `linear-gradient(135deg, ${(palette as any).primary[400]}, ${(palette as any).secondary[400]})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: gridArea === "" ? "4rem" : undefined,
            }}
          >
            $48.2k
          </Typography>
          <Typography variant={gridArea === "" ? "h3" : "h6"} color={palette.grey[500]} mt={gridArea === "" ? "1rem" : "0.15rem"}>
            Revenue
          </Typography>
        </Box>
        <Box textAlign="center" flex={1} borderLeft={`1px solid ${palette.grey[800]}`} borderRight={`1px solid ${palette.grey[800]}`}>
          <Typography
            variant={gridArea === "" ? "h1" : "h3"}
            fontWeight={800}
            sx={{
              color: (palette as any).secondary[500],
              textShadow: `0 0 10px rgba(26, 255, 214, 0.3)`,
              fontSize: gridArea === "" ? "4rem" : undefined,
            }}
          >
            72%
          </Typography>
          <Typography variant={gridArea === "" ? "h3" : "h6"} color={palette.grey[500]} mt={gridArea === "" ? "1rem" : "0.15rem"}>
            Target
          </Typography>
        </Box>
        <Box textAlign="center" flex={1}>
          <Typography
            variant={gridArea === "" ? "h1" : "h3"}
            fontWeight={800}
            sx={{
              color: (palette as any).primary[400],
              textShadow: `0 0 10px rgba(129, 140, 248, 0.3)`,
              fontSize: gridArea === "" ? "4rem" : undefined,
            }}
          >
            +15%
          </Typography>
          <Typography variant={gridArea === "" ? "h3" : "h6"} color={palette.grey[500]} mt={gridArea === "" ? "1rem" : "0.15rem"}>
            Growth
          </Typography>
        </Box>
      </Box>

      <Typography 
        margin={gridArea === "" ? "4rem 8rem 0" : "0.5rem 1rem 0"} 
        variant={gridArea === "" ? "h3" : "h6"} 
        color={palette.grey[600]} 
        lineHeight={1.5} 
        sx={{ fontSize: gridArea === "" ? "18px" : "9px", textAlign: gridArea === "" ? "center" : "left" }}
      >
        Revenue metrics reflect a sustained uptrend across all fiscal quarters, with margin expansion driven by operational efficiency gains.
      </Typography>
    </DashboardBox>
  );
};

export default SummaryBox;
