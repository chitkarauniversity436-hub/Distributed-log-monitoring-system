const LOG_SERVICE_URL = "http://localhost:3004/api/logs";

export const getLogs = async () => {
  const response = await fetch(LOG_SERVICE_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch logs");
  }

  return response.json();
};