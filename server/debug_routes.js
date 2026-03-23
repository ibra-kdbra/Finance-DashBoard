import express from "express";
import authRoutes from "./src/presentation/routes/auth.route.js";

const app = express();
app.use("/auth", authRoutes);

console.log("Routes in /auth:");
authRoutes.stack.forEach((layer) => {
  if (layer.route) {
    console.log(`${Object.keys(layer.route.methods).join(", ").toUpperCase()} ${layer.route.path}`);
  }
});
