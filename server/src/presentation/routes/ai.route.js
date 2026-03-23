import express from "express";
import { chat, predictAnalysis } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/chat", chat);
router.post("/predict-analysis", predictAnalysis);

export default router;
