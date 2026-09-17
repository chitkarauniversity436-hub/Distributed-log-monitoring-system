// controllers/inventoryController.js
import InventoryItem from "../models/Inventory.js";

export const getItems = async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get inventory items",
      error: error.message,
    });
  }
};

export const addItem = async (req, res) => {
  try {
    const { name, quantity, location } = req.body;
    const item = await InventoryItem.create({ name, quantity, location });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add inventory item",
      error: error.message,
    });
  }
};

