import prisma from "../../data/prisma.js";

/**
 * Utility to generate realistic mock financial data for the dashboard.
 */
export const generateMockData = async (userId) => {
    console.log("Mock start: clearing old data");
    // 1. Wipe existing user data
    await prisma.monthData.deleteMany({ where: { kpi: { userId } } });
    await prisma.dayData.deleteMany({ where: { kpi: { userId } } });
    await prisma.kPI.deleteMany({ where: { userId } });
    await prisma.transaction.deleteMany({ where: { userId } });
    await prisma.product.deleteMany({ where: { userId } });

    console.log("Mock start: creating base KPI");
    // 2. Generate Base KPI
    let totalRev = 0;
    let totalExp = 0;

    const kpi = await prisma.kPI.create({
        data: {
            userId,
            totalProfit: 0,
            totalRevenue: 0,
            totalExpenses: 0,
            expensesByCategory: {
                "Salaries": 40000,
                "Marketing": 15000,
                "Infrastructure": 8000,
                "Platform Fees": 4000
            }
        }
    });

    console.log("Mock start: creating Month array");
    // 3. Generate 12 Months of Data with a growth curve
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let baseRev = 20000;

    const monthDataArray = months.map((month, i) => {
        const currentRev = baseRev + (i * 2000) + (Math.random() * 5000 - 2500);
        const currentExp = currentRev * 0.6 + (Math.random() * 2000 - 1000);
        totalRev += currentRev;
        totalExp += currentExp;
        return {
            kpiId: kpi.id,
            month: month,
            revenue: currentRev,
            expenses: currentExp,
            operationalExpenses: currentExp * 0.7,
            nonOperationalExpenses: currentExp * 0.3
        };
    });

    await prisma.monthData.createMany({ data: monthDataArray });

    console.log("Mock start: updating base KPI");
    // Update top-level KPI
    await prisma.kPI.update({
        where: { id: kpi.id },
        data: {
            totalRevenue: totalRev,
            totalExpenses: totalExp,
            totalProfit: totalRev - totalExp
        }
    });

    console.log("Mock start: creating Products in bulk");
    // 4. Generate 20 Products
    const productDataArray = Array.from({ length: 20 }, () => {
        const price = 50 + Math.random() * 200;
        return {
            userId,
            price: price,
            expense: price * 0.4
        };
    });
    await prisma.product.createMany({ data: productDataArray });
    const products = await prisma.product.findMany({ where: { userId } });

    console.log("Mock start: creating transactions in bulk");
    // 5. Generate 50 Transactions
    const transactionDataArray = Array.from({ length: 50 }, () => {
        const numProducts = Math.floor(Math.random() * 3) + 1;
        let amount = 0;

        // Approximate amount based on random product prices
        for (let j = 0; j < numProducts; j++) {
            const p = products[Math.floor(Math.random() * products.length)];
            if (p) {
                amount += Number(p.price);
            }
        }

        return {
            userId,
            buyer: `Customer ${Math.floor(Math.random() * 10000)}`,
            amount: amount || 50
        };
    });

    await prisma.transaction.createMany({ data: transactionDataArray });

    console.log("Mock engine successfully reached end of transaction loop.");
    return { message: "Mock data engine successfully populated ledger." };
};
