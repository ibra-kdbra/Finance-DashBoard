import express from "express";
import { getKpis } from "../controllers/kpi.controller.js";

const router = express.Router();

router.get("/kpis", getKpis);

export default router;
