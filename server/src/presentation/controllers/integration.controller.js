import prisma from "../../data/prisma.js";
import { fetchStripeData } from "../../domain/services/stripe.service.js";
import { generateMockData } from "../../domain/services/mock.service.js";

export const syncStripeData = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Fetch live data from Stripe via Service
        const stripeData = await fetchStripeData();

        // 2. Wrap everything in a Prisma Transaction to ensure atomic upserts
        await prisma.$transaction(async (tx) => {
            // Optional: Wipe existing user data before syncing to prevent duplication
            // Not doing this for now to preserve old manually imported products, 
            // but we will clear KPIs and Transactions to replace with Stripe truth.
            await tx.monthData.deleteMany({ where: { kpi: { userId } } });
            await tx.dayData.deleteMany({ where: { kpi: { userId } } });
            await tx.kPI.deleteMany({ where: { userId } });
            await tx.transaction.deleteMany({ where: { userId } });

            // Create new KPI wrapper
            const newKPI = await tx.kPI.create({
                data: {
                    userId,
                    totalRevenue: stripeData.kpiSummary.totalRevenue,
                    totalExpenses: stripeData.kpiSummary.totalExpenses,
                    totalProfit: stripeData.kpiSummary.totalProfit,
                    expensesByCategory: { "Platform Fees": stripeData.kpiSummary.totalExpenses },
                }
            });

            // Create Monthly Data
            if (stripeData.monthlyData.length > 0) {
                const monthPromises = stripeData.monthlyData.map((m) =>
                    tx.monthData.create({
                        data: {
                            kpiId: newKPI.id,
                            month: m.month,
                            revenue: m.revenue,
                            expenses: m.expenses,
                            operationalExpenses: m.expenses * 0.8, // Approximation
                            nonOperationalExpenses: m.expenses * 0.2,
                        }
                    })
                );
                await Promise.all(monthPromises);
            }

            // Create Transactions
            if (stripeData.recentTransactions.length > 0) {
                const txPromises = stripeData.recentTransactions.map((t) =>
                    tx.transaction.create({
                        data: {
                            userId,
                            buyer: t.buyer,
                            amount: t.amount,
                        }
                    })
                );
                await Promise.all(txPromises);
            }
        });

        res.status(200).json({ message: "Successfully synchronized live Stripe data!" });
    } catch (error) {
        console.error("Stripe Sync Controller Error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const runMockEngine = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await generateMockData(userId);
        res.status(200).json(result);
    } catch (error) {
        console.error("Mock Engine Error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const appendManualData = async (req, res) => {
    try {
        const userId = req.user.id;
        const { month, revenue, expenses } = req.body;

        if (!month || !revenue || !expenses) {
            return res.status(400).json({ error: "Month, Revenue, and Expenses are required." });
        }

        const revNumber = parseFloat(revenue);
        const expNumber = parseFloat(expenses);

        await prisma.$transaction(async (tx) => {
            // 1. Get or Create user's base KPI
            let kpi = await tx.kPI.findFirst({ where: { userId } });

            if (!kpi) {
                kpi = await tx.kPI.create({
                    data: {
                        userId,
                        totalRevenue: 0,
                        totalExpenses: 0,
                        totalProfit: 0,
                        expensesByCategory: {}
                    }
                });
            }

            // 2. Check if this month already exists, update if so, else create
            const existingMonth = await tx.monthData.findFirst({
                where: { kpiId: kpi.id, month: month }
            });

            if (existingMonth) {
                await tx.monthData.update({
                    where: { id: existingMonth.id },
                    data: {
                        revenue: revNumber,
                        expenses: expNumber,
                        operationalExpenses: expNumber * 0.7,
                        nonOperationalExpenses: expNumber * 0.3
                    }
                });
            } else {
                await tx.monthData.create({
                    data: {
                        kpiId: kpi.id,
                        month: month,
                        revenue: revNumber,
                        expenses: expNumber,
                        operationalExpenses: expNumber * 0.7,
                        nonOperationalExpenses: expNumber * 0.3
                    }
                });
            }

            // 3. Recalculate top level KPI totals
            const allMonths = await tx.monthData.findMany({ where: { kpiId: kpi.id } });
            const totalRev = allMonths.reduce((acc, m) => Number(acc) + Number(m.revenue), 0);
            const totalExp = allMonths.reduce((acc, m) => Number(acc) + Number(m.expenses), 0);

            await tx.kPI.update({
                where: { id: kpi.id },
                data: {
                    totalRevenue: totalRev,
                    totalExpenses: totalExp,
                    totalProfit: totalRev - totalExp
                }
            });
        });

        res.status(200).json({ message: `Successfully logged data for ${month}.` });
    } catch (error) {
        console.error("Manual Entry Error:", error);
        res.status(500).json({ error: error.message });
    }
};
