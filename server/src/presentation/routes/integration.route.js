import express from "express";
import { syncStripeData, runMockEngine, appendManualData } from "../controllers/integration.controller.js";

const router = express.Router();

router.post("/stripe/sync", syncStripeData);
router.post("/mock", runMockEngine);
router.post("/manual", appendManualData);

export default router;
