import express from "express";
import multer from "multer";
import { ingestCSV } from "../controllers/ingestion.controller.js";
import { verifyToken } from "../../data/middleware/auth.middleware.js";

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

router.post("/csv", verifyToken, upload.single("file"), ingestCSV);

export default router;
