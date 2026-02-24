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
        const results = [];
        const filePath = req.file.path;

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", async () => {
                try {
                    if (type === "kpi") {
                        for (const row of results) {
                            await prisma.kPI.create({
                                data: {
                                    totalProfit: cleanCurrency(row.totalProfit),
                                    totalRevenue: cleanCurrency(row.totalRevenue),
                                    totalExpenses: cleanCurrency(row.totalExpenses),
                                    expensesByCategory: row.expensesByCategory ? JSON.parse(row.expensesByCategory) : {},
                                    // Relational nested data would be handled here if available in CSV
                                },
                            });
                        }
                    } else if (type === "product") {
                        const data = results.map((row) => ({
                            price: cleanCurrency(row.price),
                            expense: cleanCurrency(row.expense),
                        }));
                        await prisma.product.createMany({ data });
                    } else if (type === "transaction") {
                        const data = results.map((row) => ({
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
