import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Cart from "./models/mongooseDB.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

app.post("/api/cart", async (req, res) => {
  try {
    const product = req.body;

    const existingProduct = await Cart.findOne({
      productId: product.id,
    });

    if (existingProduct) {
      existingProduct.quantity += 1;
      await existingProduct.save();
    } else {
      await Cart.create({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    const cart = await Cart.find();

    res.status(200).json({
      message: "Product added successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding product",
      error: error.message,
    });
  }
});

app.get("/api/cart", async (req, res) => {
  try {
    const cart = await Cart.find();

    res.status(200).json({
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching cart",
      error: error.message,
    });
  }
});

app.delete("/api/cart/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await Cart.findOne({
      productId: id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.quantity > 1) {
      product.quantity -= 1;
      await product.save();
    } else {
      await Cart.deleteOne({
        productId: id,
      });
    }

    const cart = await Cart.find();

    res.status(200).json({
      message: "Product removed successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error removing product",
      error: error.message,
    });
  }
});

