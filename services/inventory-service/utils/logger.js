const LOG_SERVICE_URL = "http://localhost:3004/api/logs";

const sendLog = async ({
  level = "info",
  message,
  method,
  endpoint,
  statusCode
}) => {
  try {
    await fetch(LOG_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        service: "inventory-service",
        level,
        message,
        method,
        endpoint,
        statusCode
      })
    });
  } catch (error) {
    console.error("Failed to send log:", error.message);
  }
};

export default sendLog;