import express from "express";

import {
  getLogs,
  addLog,
  getAnalytics
} from "../controllers/logController.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", adminMiddleware, getLogs);

router.get("/analytics", adminMiddleware, getAnalytics);

router.post("/", addLog);

export default router;