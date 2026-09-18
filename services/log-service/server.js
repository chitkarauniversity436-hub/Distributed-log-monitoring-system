import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import logRoutes from "./routes/logRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/logs", logRoutes);

// Create HTTP server
const httpServer = createServer(app);

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Make Socket.IO available to controllers
app.set("io", io);

// When dashboard connects
io.on("connection", (socket) => {
  console.log("Dashboard connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Dashboard disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3004;

httpServer.listen(PORT, () => {
  console.log(`Log Service running on port ${PORT}`);
});