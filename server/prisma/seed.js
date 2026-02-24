import { PrismaClient } from "@prisma/client";
import { kpis, products, transactions } from "../data/data.js";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding started...");

    // Clean existing data
    await prisma.transaction.deleteMany();
    await prisma.product.deleteMany();
    await prisma.monthData.deleteMany();
    await prisma.dayData.deleteMany();
    await prisma.kPI.deleteMany();

    console.log("Database cleaned.");

    const parseCurrency = (val) => {
        if (!val) return 0;
        return parseFloat(val.toString().replace("$", ""));
    };

    // Seed KPIs
    for (const kpi of kpis) {
        const expensesByCategory = {};
        for (const [key, value] of Object.entries(kpi.expensesByCategory)) {
            expensesByCategory[key] = parseCurrency(value);
        }

        await prisma.kPI.create({
            data: {
                totalProfit: parseCurrency(kpi.totalProfit),
                totalRevenue: parseCurrency(kpi.totalRevenue),
                totalExpenses: parseCurrency(kpi.totalExpenses),
                expensesByCategory: expensesByCategory,
                monthlyData: {
                    create: kpi.monthlyData.map((m) => ({
                        month: m.month,
                        revenue: parseCurrency(m.revenue),
                        expenses: parseCurrency(m.expenses),
                        operationalExpenses: parseCurrency(m.operationalExpenses),
                        nonOperationalExpenses: parseCurrency(m.nonOperationalExpenses),
                    })),
                },
                dailyData: {
                    create: kpi.dailyData.map((d) => ({
                        date: d.date,
                        revenue: parseCurrency(d.revenue),
                        expenses: parseCurrency(d.expenses),
                    })),
                },
            },
        });
    }
    console.log("KPIs seeded.");

    // Seed Products
    const seededProducts = [];
    for (const product of products) {
        const p = await prisma.product.create({
            data: {
                id: product._id, // Keep original ID for relation matching
                price: parseCurrency(product.price),
                expense: parseCurrency(product.expense),
            },
        });
        seededProducts.push(p);
    }
    console.log("Products seeded.");

    // Seed Transactions
    for (const transaction of transactions) {
        await prisma.transaction.create({
            data: {
                id: transaction._id,
                buyer: transaction.buyer,
                amount: parseCurrency(transaction.amount),
                products: {
                    connect: transaction.productIds.map((id) => ({ id })),
                },
            },
        });
    }
    console.log("Transactions seeded.");

    console.log("Seeding finished successfully!");
}

main()
    .catch((e) => {
        console.error("Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
