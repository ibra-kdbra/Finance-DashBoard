import prisma from "../../data/prisma.js";

export const getKpis = async (req, res) => {
    try {
        const kpis = await prisma.kPI.findMany({
            where: { userId: req.user.id },
            include: {
                monthlyData: true,
                dailyData: true,
            }
        });
        res.status(200).json(kpis);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
