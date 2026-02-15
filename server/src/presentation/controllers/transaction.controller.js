import Transaction from "../../data/models/Transactions.js";

export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().limit(50).sort({ createdAt: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
