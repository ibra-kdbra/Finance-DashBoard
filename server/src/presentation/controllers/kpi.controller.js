import KPI from "../../data/models/KPI.js";

export const getKpis = async (req, res) => {
    try {
        const kpis = await KPI.find();
        res.status(200).json(kpis);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
