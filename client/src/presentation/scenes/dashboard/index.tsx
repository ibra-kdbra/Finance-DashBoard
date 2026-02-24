import { Box } from "@mui/material";
import React, { useState, ReactNode, useCallback } from "react";
import Row1 from "./Row1";
import Row2 from "./Row2";
import Row3 from "./Row3";
import { motion } from "framer-motion";
import ChartExpandOverlay from "@/presentation/components/ChartExpandOverlay";

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
  const [expandedChart, setExpandedChart] = useState<ExpandedChart>(null);

  const handleExpand = useCallback((title: string, subtitle: string, content: ReactNode) => {
    setExpandedChart({ title, subtitle, content });
  }, []);

  const handleClose = useCallback(() => {
    setExpandedChart(null);
  }, []);

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
    </>
  );
};

export default Dashboard;
