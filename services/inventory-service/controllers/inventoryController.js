import InventoryItem from "../models/Inventory.js";
import sendLog from "../utils/logger.js";
export const getItems = async (req, res) => {
  try {
    const items = await InventoryItem.find();

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get inventory items",
      error: error.message
    });
  }
};

export const addItem = async (req, res) => {
  try {
    const { productId, name, quantity, location } = req.body;

    const item = await InventoryItem.create({
      productId,
      name,
      quantity,
      location
    });

    await sendLog({
      level: "info",
      message: "Inventory item added successfully",
      method: "POST",
      endpoint: "/api/inventory",
      statusCode: 201
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add inventory item",
      error: error.message
    });
  }
};