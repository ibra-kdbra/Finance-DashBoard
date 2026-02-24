import React, { ReactNode } from "react";
import { Box } from "@mui/material";
import { useDashboardData } from "@/data/hooks/useDashboardData";
import ProductListGrid from "./components/ProductListGrid";
import RecentOrdersGrid from "./components/RecentOrdersGrid";
import ExpenseBreakdownPies from "./components/ExpenseBreakdownPies";
import SummaryBox from "./components/SummaryBox";

type Props = {
  onExpand: (title: string, subtitle: string, content: ReactNode) => void;
};

const Row3 = ({ onExpand }: Props) => {
  const { productData, transactionData, pieChartData } = useDashboardData();

  return (
    <>
      <Box
        gridArea="g"
        onDoubleClick={() =>
          onExpand("Product Catalog", "Full product listing",
            <ProductListGrid data={productData} gridArea="" />)
        }
        sx={{ cursor: "pointer", "&:hover": { outline: "1px dashed rgba(129,140,248,0.2)", outlineOffset: "-2px", borderRadius: "1.5rem" } }}
      >
        <ProductListGrid data={productData} gridArea="g" />
      </Box>
      <Box
        gridArea="h"
        onDoubleClick={() =>
          onExpand("Recent Orders", "Transaction history",
            <RecentOrdersGrid data={transactionData} gridArea="" />)
        }
        sx={{ cursor: "pointer", "&:hover": { outline: "1px dashed rgba(129,140,248,0.2)", outlineOffset: "-2px", borderRadius: "1.5rem" } }}
      >
        <RecentOrdersGrid data={transactionData} gridArea="h" />
      </Box>
      <Box
        gridArea="i"
        onDoubleClick={() =>
          onExpand("Expense Breakdown By Category", "Category distribution",
            <ExpenseBreakdownPies data={pieChartData} gridArea="" />)
        }
        sx={{ cursor: "pointer", "&:hover": { outline: "1px dashed rgba(129,140,248,0.2)", outlineOffset: "-2px", borderRadius: "1.5rem" } }}
      >
        <ExpenseBreakdownPies data={pieChartData} gridArea="i" />
      </Box>
      <Box
        gridArea="j"
        onDoubleClick={() =>
          onExpand("Financial Summary", "Key performance indicators",
            <SummaryBox gridArea="" />)
        }
        sx={{ cursor: "pointer", "&:hover": { outline: "1px dashed rgba(129,140,248,0.2)", outlineOffset: "-2px", borderRadius: "1.5rem" } }}
      >
        <SummaryBox gridArea="j" />
      </Box>
    </>
  );
};

export default Row3;
