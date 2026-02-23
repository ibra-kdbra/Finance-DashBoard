import KPI from "../../data/models/KPI.js";
import Product from "../../data/models/Product.js";
import Transaction from "../../data/models/Transactions.js";
import csv from "csv-parser";
import fs from "fs";

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
                        // Bulk insert/update KPIs
                        // Note: In a real production scenario, we would validate & transform here
                        await KPI.insertMany(results);
                    } else if (type === "product") {
                        await Product.insertMany(results);
                    } else if (type === "transaction") {
                        await Transaction.insertMany(results);
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
