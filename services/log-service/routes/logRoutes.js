import express from "express";

import {
  getLogs,
  addLog,
  getAnalytics
} from "../controllers/logController.js";

const router = express.Router();

router.get("/", getLogs);

router.post("/", addLog);
router.get("/analytics", getAnalytics);

export default router;