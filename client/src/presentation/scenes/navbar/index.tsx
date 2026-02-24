import { useState } from "react";
import { Link } from "react-router-dom";
import PixIcon from "@mui/icons-material/Pix";
import { Box, Typography, useTheme, Divider } from "@mui/material";
import FlexBetween from "@/presentation/components/FlexBetween";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "@/data/state/authSlice";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import LogoutIcon from "@mui/icons-material/Logout";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DataImportModal from "@/presentation/components/DataImportModal";



const Navbar = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuth = Boolean(useSelector((state: any) => state.auth.token));
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
        {isAuth && (
          <>
            <Box sx={{ 
              transition: "all 0.3s ease",
              "&:hover": { transform: "translateY(-2px)" }
            }}>
              <Link
                to="/dashboard"
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
            <Box sx={{ 
              transition: "all 0.3s ease",
              "&:hover": { transform: "translateY(-2px)", cursor: "pointer" }
            }} onClick={() => setIsModalOpen(true)}>
              <Box display="flex" alignItems="center" gap="0.4rem">
                <CloudUploadIcon sx={{ fontSize: "18px", color: palette.grey[700] }} />
                <Typography
                  style={{
                    color: palette.grey[700],
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  import
                </Typography>
              </Box>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ borderColor: palette.grey[800], mx: "0.25rem" }} />

            <Box sx={{ 
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(129, 138, 248, 0.1)",
              p: "0.4rem 1rem",
              borderRadius: "2rem",
              border: `1px solid rgba(129, 138, 248, 0.2)`,
              transition: "all 0.3s ease",
              cursor: "pointer",
              "&:hover": { 
                background: "rgba(129, 138, 248, 0.2)",
                boxShadow: `0 0 15px rgba(129, 138, 248, 0.3)`
              }
            }}>
              <SmartToyIcon sx={{ fontSize: "18px", color: (palette as any).primary[500] }} />
              <Typography variant="h6" color={(palette as any).primary[500]} fontWeight="700">
                AURA AI
              </Typography>
            </Box>

            <Box sx={{ 
              ml: "1rem",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              "&:hover": { cursor: "pointer", color: (palette as any).tertiary[500] }
            }} onClick={() => dispatch(setLogout())}>
              <LogoutIcon sx={{ fontSize: "18px", color: palette.grey[700] }} />
              <Typography
                style={{
                  color: palette.grey[700],
                  fontWeight: "600",
                }}
              >
                logout
              </Typography>
            </Box>
          </>
        )}
      </FlexBetween>
      <DataImportModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </FlexBetween>
  );
};

export default Navbar;
