import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// Initialize Stripe SDK with the live secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
});

/**
 * Fetches recent balance transactions from Stripe and groups them by month.
 * Also parses out product sales for the transactions table.
 */
export const fetchStripeData = async () => {
    try {
        // Fetch the last 500 balance transactions to get a decent history window
        const balanceTransactions = await stripe.balanceTransactions.list({
            limit: 100, // For demo purposes, sticking to 100 requests to avoid rate limits
        });

        const monthlyMap = new Map();
        const parsedTransactions = [];
        let totalRevenue = 0;
        let totalExpenses = 0;
        let totalProfit = 0;

        // Grouping logic
        balanceTransactions.data.forEach((txn) => {
            // txn.created is in seconds epoch
            const date = new Date(txn.created * 1000);
            const monthYear = date.toLocaleString("en-US", { month: "long" }).toLowerCase();

            const amount = txn.amount / 100; // cents to dollars
            const fee = txn.fee / 100;
            const net = txn.net / 100;

            if (!monthlyMap.has(monthYear)) {
                monthlyMap.set(monthYear, { month: monthYear, revenue: 0, expenses: 0 });
            }

            const monthData = monthlyMap.get(monthYear);

            if (txn.type === "charge" || txn.type === "payment") {
                totalRevenue += amount;
                monthData.revenue += amount;
            }

            if (txn.type === "fee" || txn.type === "stripe_fee") {
                totalExpenses += Math.abs(amount);
                monthData.expenses += Math.abs(amount);
            } else if (fee > 0) {
                totalExpenses += fee;
                monthData.expenses += fee;
            }

            // Add to recent transactions array
            if (txn.type === "charge" || txn.type === "payment") {
                parsedTransactions.push({
                    buyer: "Stripe Customer", // Could fetch customer details if expand=['data.customer']
                    amount: amount,
                });
            }
        });

        totalProfit = totalRevenue - totalExpenses;

        return {
            success: true,
            kpiSummary: {
                totalRevenue,
                totalExpenses,
                totalProfit,
            },
            monthlyData: Array.from(monthlyMap.values()).reverse(), // Chronological roughly
            recentTransactions: parsedTransactions.slice(0, 50),
        };

    } catch (error) {
        console.error("Stripe SDK Error:", error.message);
        throw new Error("Failed to fetch Stripe data: " + error.message);
    }
};
