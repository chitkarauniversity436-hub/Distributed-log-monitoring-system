import Product from "../models/Product.js";
import sendLog from "../utils/logger.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get products",
      error: error.message
    });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const product = await Product.create({
      name,
      price,
      description
    });

    await sendLog({
      level: "info",
      message: "Product created successfully",
      method: "POST",
      endpoint: "/api/products",
      statusCode: 201
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product",
      error: error.message
    });
  }
};