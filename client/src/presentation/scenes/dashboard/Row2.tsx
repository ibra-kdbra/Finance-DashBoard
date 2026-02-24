import React, { ReactNode } from "react";
import { Box } from "@mui/material";
import { useDashboardData } from "@/data/hooks/useDashboardData";
import OperationalExpensesLine from "./components/OperationalExpensesLine";
import CampaignTargetsCharts from "./components/CampaignTargetsCharts";
import PriceExpenseScatter from "./components/PriceExpenseScatter";

type Props = {
  onExpand: (title: string, subtitle: string, content: ReactNode) => void;
};

const Row2 = ({ onExpand }: Props) => {
  const { operationalExpenses, productExpenseData } = useDashboardData();

  return (
    <>
      <Box
        gridArea="d"
        onDoubleClick={() =>
          onExpand("Operational vs Non-Operational Expenses", "Expense breakdown comparison",
            <OperationalExpensesLine data={operationalExpenses} gridArea="" />)
        }
        sx={{ cursor: "pointer", "&:hover": { outline: "1px dashed rgba(129,140,248,0.2)", outlineOffset: "-2px", borderRadius: "1.5rem" } }}
      >
        <OperationalExpensesLine data={operationalExpenses} gridArea="d" />
      </Box>
      <Box
        gridArea="e"
        onDoubleClick={() =>
          onExpand("Campaigns and Targets", "Campaign performance metrics",
            <CampaignTargetsCharts gridArea="" />)
        }
        sx={{ cursor: "pointer", "&:hover": { outline: "1px dashed rgba(129,140,248,0.2)", outlineOffset: "-2px", borderRadius: "1.5rem" } }}
      >
        <CampaignTargetsCharts gridArea="e" />
      </Box>
      <Box
        gridArea="f"
        onDoubleClick={() =>
          onExpand("Product Prices vs Expenses", "Scatter plot analysis",
            <PriceExpenseScatter data={productExpenseData} gridArea="" />)
        }
        sx={{ cursor: "pointer", "&:hover": { outline: "1px dashed rgba(129,140,248,0.2)", outlineOffset: "-2px", borderRadius: "1.5rem" } }}
      >
        <PriceExpenseScatter data={productExpenseData} gridArea="f" />
      </Box>
    </>
  );
};

export default Row2;
