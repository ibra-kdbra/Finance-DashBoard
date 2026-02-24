import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import kpiRoutes from './src/presentation/routes/kpi.route.js';
import productRoutes from './src/presentation/routes/product.route.js';
import transactionRoutes from './src/presentation/routes/transaction.route.js';
import authRoutes from "./src/presentation/routes/auth.route.js";
import ingestionRoutes from "./src/presentation/routes/ingestion.route.js";
import { verifyToken } from "./src/data/middleware/auth.middleware.js";
import prisma from "./src/data/prisma.js";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/kpi", verifyToken, kpiRoutes);
app.use("/product", verifyToken, productRoutes);
app.use("/transaction", verifyToken, transactionRoutes);
app.use("/ingest", ingestionRoutes);

/* PRISMA SETUP */
const PORT = process.env.PORT || 1337;
async function main() {
  try {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  } catch (error) {
    console.log(`${error} did not connect`);
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });