import Log from "../models/Log.js";
import sendLog from "../../user-service/utils/logger.js";

export const getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get logs",
      error: error.message
    });
  }
};

export const addLog = async (req, res) => {
  try {
    const {
      service,
      level,
      message,
      method,
      endpoint,
      statusCode
    } = req.body;

    const log = await Log.create({
      service,
      level,
      message,
      method,
      endpoint,
      statusCode
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add log",
      error: error.message
    });
  }
};