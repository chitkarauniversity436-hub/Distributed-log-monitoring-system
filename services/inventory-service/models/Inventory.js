// Inventory model
import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 0
    },

    location: {
      type: String
    },
  },
  {
    timestamps: true
  }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;