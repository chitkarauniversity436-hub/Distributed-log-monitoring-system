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

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get product",
      error: error.message
    });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description
    } = req.body;

    let image = "";

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.create({
      name,
      price,
      description,
      image
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

    await sendLog({
      level: "error",
      message: `Failed to create product: ${error.message}`,
      method: "POST",
      endpoint: "/api/products",
      statusCode: 500
    });

    res.status(500).json({
      message: "Failed to add product",
      error: error.message
    });
  }
};