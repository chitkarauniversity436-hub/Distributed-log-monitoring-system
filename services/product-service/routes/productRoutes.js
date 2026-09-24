import express from "express";

import {
  getProducts,
  getProductById,
  addProduct
} from "../controllers/productController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post(
  "/",
  upload.single("image"),
  addProduct
);

export default router;