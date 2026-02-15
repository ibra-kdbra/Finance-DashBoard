import { useState } from "react";
import { Link } from "react-router-dom";
import PixIcon from "@mui/icons-material/Pix";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "@/presentation/components/FlexBetween";

type Props = Record<string, never>;

const Navbar = (props: Props) => {
  const { palette } = useTheme();
  const [selected, setSelected] = useState("dashboard");
  return (
    <FlexBetween
      mb="0.25rem"
      p="0.75rem 2rem"
      color={palette.grey[300]}
      sx={{
        backgroundColor: (palette as any).background.glass,
        backdropFilter: "blur(20px)",
        borderRadius: "1.25rem",
        border: `1px solid ${(palette as any).background.glassBorder}`,
        position: "sticky",
        top: "1rem",
        zIndex: 10,
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      }}
    >
      {/* LEFT SIDE */}
      <FlexBetween gap="0.75rem">
        <PixIcon sx={{ 
          fontSize: "28px",
          color: (palette as any).primary[500],
          filter: `drop-shadow(0 0 5px ${(palette as any).primary[500]})`
        }} />
        <Typography variant="h3" sx={{ 
          fontSize: "20px",
          background: (palette as any).background.neon,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "bold"
        }}>
          FinanceRan
        </Typography>
      </FlexBetween>

      {/* RIGHT SIDE */}
      <FlexBetween gap="2rem">
        <Box sx={{ 
          transition: "all 0.3s ease",
          "&:hover": { transform: "translateY(-2px)" }
        }}>
          <Link
            to="/"
            onClick={() => setSelected("dashboard")}
            style={{
              color: selected === "dashboard" ? (palette as any).primary[500] : palette.grey[700],
              textDecoration: "none",
              fontWeight: "600",
              transition: "color 0.3s ease"
            }}
          >
            dashboard
          </Link>
        </Box>
        <Box sx={{ 
          transition: "all 0.3s ease",
          "&:hover": { transform: "translateY(-2px)" }
        }}>
          <Link
            to="/predictions"
            onClick={() => setSelected("predictions")}
            style={{
              color: selected === "predictions" ? (palette as any).primary[500] : palette.grey[700],
              textDecoration: "none",
              fontWeight: "600",
              transition: "color 0.3s ease"
            }}
          >
            predictions
          </Link>
        </Box>
      </FlexBetween>
    </FlexBetween>
  );
};

export default Navbar;
