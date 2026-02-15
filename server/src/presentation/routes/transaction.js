import express from "express";
import Transaction from "../models/Transactions.js";

const router = express.Router();

router.get("/transactions", async (req, res) => {
  try {
    const transaction = await Transaction.find().limit(50).sort({creadtedOn : -1 });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;