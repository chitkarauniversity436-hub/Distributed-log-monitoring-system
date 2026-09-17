import express from "express";

import {
  getUsers,
  registerUser,
  loginUser
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/", authMiddleware, getUsers);

export default router;