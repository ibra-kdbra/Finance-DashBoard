import { Box, Snackbar, Alert, Typography, useTheme } from "@mui/material";
import React, { useState, ReactNode, useCallback } from "react";
import Row1 from "./Row1";
import Row2 from "./Row2";
import Row3 from "./Row3";
import { motion } from "framer-motion";
import ChartExpandOverlay from "@/presentation/components/ChartExpandOverlay";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

type ExpandedChart = {
  title: string;
  subtitle?: string;
  content: ReactNode;
} | null;

const Dashboard = () => {
  const { palette } = useTheme();
  const [expandedChart, setExpandedChart] = useState<ExpandedChart>(null);
  const [notificationOpen, setNotificationOpen] = useState(true);

  const handleExpand = useCallback((title: string, subtitle: string, content: ReactNode) => {
    setExpandedChart({ title, subtitle, content });
  }, []);

  const handleClose = useCallback(() => {
    setExpandedChart(null);
  }, []);

  const handleCloseNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotificationOpen(false);
  };

  return (
    <>
      <Box
        className="dashboard-grid"
        component={motion.div}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <Row1 onExpand={handleExpand} />
        <Row2 onExpand={handleExpand} />
        <Row3 onExpand={handleExpand} />
      </Box>
      <ChartExpandOverlay
        open={!!expandedChart}
        onClose={handleClose}
        title={expandedChart?.title || ""}
        subtitle={expandedChart?.subtitle}
      >
        {expandedChart?.content}
      </ChartExpandOverlay>
      <Snackbar
        open={notificationOpen}
        autoHideDuration={8000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          icon={<InfoOutlinedIcon fontSize="inherit" sx={{ color: (palette as any).primary[400], mt: "0.25rem" }} />}
          sx={{
            background: `linear-gradient(135deg, ${(palette as any).secondary[900]}, ${(palette as any).primary[900]})`,
            color: palette.grey[100],
            border: `1px solid ${(palette as any).primary[500]}`,
            boxShadow: `0 0 15px rgba(26, 255, 214, 0.4), 0 0 30px rgba(129, 140, 248, 0.2)`,
            borderRadius: "0.5rem",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Pro Tip
          </Typography>
          <Typography variant="h6" color={palette.grey[300]}>
            Double-click on any graph to see the detailed full view!
          </Typography>
        </Alert>
      </Snackbar>
    </>
  );
};

export default Dashboard;
