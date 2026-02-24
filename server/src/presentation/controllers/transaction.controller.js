import prisma from "../../data/prisma.js";

export const getTransactions = async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            take: 50,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                products: true,
            }
        });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
