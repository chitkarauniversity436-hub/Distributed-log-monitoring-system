import Log from "../models/Log.js";

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

    // Send the new log to all connected dashboards
    const io = req.app.get("io");

    if (io) {
      io.emit("new-log", log);
    }

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add log",
      error: error.message
    });
  }
};


export const getAnalytics = async (req, res) => {
  try {
    const totalLogs = await Log.countDocuments();

    const infoLogs = await Log.countDocuments({
      level: "info"
    });

    const warningLogs = await Log.countDocuments({
      level: "warn"
    });

    const errorLogs = await Log.countDocuments({
      level: "error"
    });

    const errorRate =
      totalLogs === 0
        ? 0
        : ((errorLogs / totalLogs) * 100).toFixed(2);

    const serviceErrors = await Log.aggregate([
      {
        $match: {
          level: "error"
        }
      },
      {
        $group: {
          _id: "$service",
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          count: -1
        }
      }
    ]);

    const statusCodeErrors = await Log.aggregate([
      {
        $match: {
          level: "error"
        }
      },
      {
        $group: {
          _id: "$statusCode",
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          count: -1
        }
      }
    ]);

    res.status(200).json({
      totalLogs,
      infoLogs,
      warningLogs,
      errorLogs,
      errorRate: Number(errorRate),
      serviceErrors,
      statusCodeErrors
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get analytics",
      error: error.message
    });
  }
};