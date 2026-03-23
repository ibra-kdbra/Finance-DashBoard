import prisma from "../../data/prisma.js";
import csv from "csv-parser";
import fs from "fs";

// Helper to clean currency strings from CSV (e.g., "$1,234.56" -> 1234.56)
const cleanCurrency = (val) => {
    if (!val) return 0;
    if (typeof val === "number") return val;
    return parseFloat(val.replace(/[$,]/g, ""));
};

export const ingestCSV = async (req, res) => {
    try {
        const { type } = req.body;
        const userId = req.user.id;
        const results = [];
        const filePath = req.file.path;

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", async () => {
                try {
                    if (type === "kpi") {
                        // Assuming CSV has a single row of totals and a JSON expensesByCategory.
                        // For a real CSV containing 12 rows of months, we aggregate it first.
                        await prisma.$transaction(async (tx) => {
                            // 1. Wipe old CSV KPI data for user
                            await tx.monthData.deleteMany({ where: { kpi: { userId } } });
                            await tx.dayData.deleteMany({ where: { kpi: { userId } } });
                            await tx.kPI.deleteMany({ where: { userId } });

                            // 2. Aggregate the CSV if it's multiple rows of monthly data
                            let totalRev = 0;
                            let totalExp = 0;

                            for (const row of results) {
                                totalRev += cleanCurrency(row.revenue);
                                totalExp += cleanCurrency(row.expenses);
                            }

                            // 3. Create the Main KPI record
                            const kpi = await tx.kPI.create({
                                data: {
                                    userId,
                                    totalRevenue: totalRev,
                                    totalExpenses: totalExp,
                                    totalProfit: totalRev - totalExp,
                                    expensesByCategory: results[0].expensesByCategory ? JSON.parse(results[0].expensesByCategory) : {},
                                },
                            });

                            // 4. Create the nested monthly items
                            const monthPromises = results.map((row) => {
                                return tx.monthData.create({
                                    data: {
                                        kpiId: kpi.id,
                                        month: row.month,
                                        revenue: cleanCurrency(row.revenue),
                                        expenses: cleanCurrency(row.expenses),
                                        operationalExpenses: cleanCurrency(row.operationalExpenses) || cleanCurrency(row.expenses) * 0.7,
                                        nonOperationalExpenses: cleanCurrency(row.nonOperationalExpenses) || cleanCurrency(row.expenses) * 0.3,
                                    }
                                });
                            });

                            await Promise.all(monthPromises);
                        });
                    } else if (type === "product") {
                        const data = results.map((row) => ({
                            userId,
                            price: cleanCurrency(row.price),
                            expense: cleanCurrency(row.expense),
                        }));
                        await prisma.product.createMany({ data });
                    } else if (type === "transaction") {
                        const data = results.map((row) => ({
                            userId,
                            buyer: row.buyer,
                            amount: cleanCurrency(row.amount),
                        }));
                        await prisma.transaction.createMany({ data });
                    }

                    // Clean up the temporary file
                    fs.unlinkSync(filePath);
                    res.status(200).json({ message: `${type} data ingested successfully` });
                } catch (err) {
                    res.status(500).json({ error: "Database insertion failed: " + err.message });
                }
            });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
