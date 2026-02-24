import { Box } from "@mui/material";
import { styled } from "@mui/system";

const DashboardBox = styled(Box)(({ theme }) => ({
  backgroundColor: (theme.palette as any).background.glass,
  backdropFilter: "blur(40px)",
  borderRadius: "1.5rem",
  border: `1px solid ${(theme.palette as any).background.glassBorder}`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  padding: "0.75rem 1rem",
  overflow: "hidden",
  height: "100%",
  display: "flex",
  flexDirection: "column" as const,
  "&:hover": {
    transform: "translateY(-3px)",
    backgroundColor: (theme.palette as any).background.glassSelected,
    borderColor: (theme.palette as any).primary[400],
    boxShadow: "0 12px 40px rgba(129, 140, 248, 0.15)",
  },
}));

export default DashboardBox;
