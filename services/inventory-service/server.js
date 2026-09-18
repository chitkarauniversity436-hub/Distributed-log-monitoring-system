// server.js for inventory-service
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import requestLogger from "./middleware/requestLogger.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(requestLogger);

app.use("/api/inventory", inventoryRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Inventory Service running on port ${PORT}`);
});
