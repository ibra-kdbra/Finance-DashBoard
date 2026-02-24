import prisma from "../../data/prisma.js";

export const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                transactions: true,
            }
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
