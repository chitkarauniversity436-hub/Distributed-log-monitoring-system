import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import logRoutes from "./routes/logRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use("/api/logs", logRoutes);

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`Log Service running on port ${PORT}`);
});