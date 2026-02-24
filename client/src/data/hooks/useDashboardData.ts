import { useMemo } from "react";
import { useGetKpisQuery, useGetProductsQuery, useGetTransactionsQuery } from "@/data/api/api";

export const useDashboardData = () => {
    const { data: kpiData } = useGetKpisQuery();
    const { data: productData } = useGetProductsQuery();
    const { data: transactionData } = useGetTransactionsQuery();

    const revenueExpenses = useMemo(() => {
        return (
            kpiData && kpiData[0] &&
            kpiData[0].monthlyData.map(({ month, revenue, expenses }) => ({
                name: month.substring(0, 3),
                revenue: revenue,
                expenses: expenses,
            }))
        );
    }, [kpiData]);

    const revenueProfit = useMemo(() => {
        return (
            kpiData && kpiData[0] &&
            kpiData[0].monthlyData.map(({ month, revenue, expenses }) => ({
                name: month.substring(0, 3),
                revenue: revenue,
                profit: (revenue - expenses).toFixed(2),
            }))
        );
    }, [kpiData]);

    const monthlyRevenue = useMemo(() => {
        return (
            kpiData && kpiData[0] &&
            kpiData[0].monthlyData.map(({ month, revenue }) => ({
                name: month.substring(0, 3),
                revenue: revenue,
            }))
        );
    }, [kpiData]);

    const operationalExpenses = useMemo(() => {
        return (
            kpiData && kpiData[0] &&
            kpiData[0].monthlyData.map(({ month, operationalExpenses, nonOperationalExpenses }) => ({
                name: month.substring(0, 3),
                "Operational Expenses": operationalExpenses,
                "Non Operational Expenses": nonOperationalExpenses,
            }))
        );
    }, [kpiData]);

    const productExpenseData = useMemo(() => {
        return (
            productData &&
            productData.map(({ id, price, expense }) => ({
                id,
                price,
                expense,
            }))
        );
    }, [productData]);

    const pieChartData = useMemo(() => {
        if (kpiData && kpiData[0]) {
            const totalExpenses = kpiData[0].totalExpenses;
            return Object.entries(kpiData[0].expensesByCategory).map(([key, value]) => {
                const categoryValue = value as number;
                return [
                    { name: key, value: categoryValue },
                    { name: `${key} of Total`, value: totalExpenses - categoryValue },
                ];
            });
        }
    }, [kpiData]);

    return {
        kpiData,
        productData,
        transactionData,
        revenueExpenses,
        revenueProfit,
        monthlyRevenue,
        operationalExpenses,
        productExpenseData,
        pieChartData,
    };
};
