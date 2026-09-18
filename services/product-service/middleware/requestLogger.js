import sendLog from "../utils/logger.js";

const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", async () => {
    const responseTime = Date.now() - startTime;

    let level = "info";

    if (res.statusCode >= 400 && res.statusCode < 500) {
      level = "warn";
    }

    if (res.statusCode >= 500) {
      level = "error";
    }

    await sendLog({
      level,
      message: `${req.method} ${req.originalUrl}`,
      method: req.method,
      endpoint: req.originalUrl,
      statusCode: res.statusCode
    });

    console.log(
      `${req.method} ${req.originalUrl} - ${res.statusCode} - ${responseTime}ms`
    );
  });

  next();
};

export default requestLogger;