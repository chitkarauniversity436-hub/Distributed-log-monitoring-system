import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import requestLogger from "./middleware/requestLogger.js";
import cors from "cors";

dotenv.config();

connectDB();

const app = express();
app.use(cors());

app.use(express.json());


// SERVE UPLOADED IMAGES
app.use(
  "/uploads",
  express.static("uploads")
);


app.use(requestLogger);

app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});