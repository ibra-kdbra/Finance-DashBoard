import { Box } from "@mui/material";
import { styled } from "@mui/system";

const DashboardBox = styled(Box)(({ theme }) => ({
  backgroundColor: (theme.palette as any).background.glass,
  backdropFilter: "blur(20px)",
  borderRadius: "1.25rem",
  border: `1px solid ${(theme.palette as any).background.glassBorder}`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-5px)",
    backgroundColor: (theme.palette as any).background.glassSelected,
    borderColor: (theme.palette as any).primary[300],
    boxShadow: `0 12px 40px 0 rgba(${(theme.palette as any).primary[500]}, 0.15)`,
  },
}));

export default DashboardBox;
