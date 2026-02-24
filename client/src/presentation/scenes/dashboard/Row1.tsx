import React, { ReactNode } from "react";
import { Box } from "@mui/material";
import { useDashboardData } from "@/data/hooks/useDashboardData";
import RevenueExpensesArea from "./components/RevenueExpensesArea";
import ProfitRevenueLine from "./components/ProfitRevenueLine";
import MonthlyRevenueBar from "./components/MonthlyRevenueBar";

type Props = {
  onExpand: (title: string, subtitle: string, content: ReactNode) => void;
};

const Row1 = ({ onExpand }: Props) => {
  const { revenueExpenses, revenueProfit, monthlyRevenue } = useDashboardData();

  return (
    <>
      <Box
        gridArea="a"
        onDoubleClick={() =>
          onExpand("Revenue and Expenses", "Top line: revenue, bottom line: expenses",
            <RevenueExpensesArea data={revenueExpenses} gridArea="" />)
        }
        sx={{ cursor: "pointer", "&:hover": { outline: "1px dashed rgba(129,140,248,0.2)", outlineOffset: "-2px", borderRadius: "1.5rem" } }}
      >
        <RevenueExpensesArea data={revenueExpenses} gridArea="a" />
      </Box>
      <Box
        gridArea="b"
        onDoubleClick={() =>
          onExpand("Profit and Revenue", "Top line: revenue, bottom line: profit",
            <ProfitRevenueLine data={revenueProfit} gridArea="" />)
        }
        sx={{ cursor: "pointer", "&:hover": { outline: "1px dashed rgba(129,140,248,0.2)", outlineOffset: "-2px", borderRadius: "1.5rem" } }}
      >
        <ProfitRevenueLine data={revenueProfit} gridArea="b" />
      </Box>
      <Box
        gridArea="c"
        onDoubleClick={() =>
          onExpand("Revenue Month by Month", "Monthly revenue breakdown",
            <MonthlyRevenueBar data={monthlyRevenue} gridArea="" />)
        }
        sx={{ cursor: "pointer", "&:hover": { outline: "1px dashed rgba(129,140,248,0.2)", outlineOffset: "-2px", borderRadius: "1.5rem" } }}
      >
        <MonthlyRevenueBar data={monthlyRevenue} gridArea="c" />
      </Box>
    </>
  );
};

export default Row1;
