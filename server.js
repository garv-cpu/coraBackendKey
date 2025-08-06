import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { initSocketServer } from "./sockets.js";

dotenv.config();
const app = express();

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

initSocketServer(io);

// Routes
app.use("/api/devices", deviceRoutes);

// Start
const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
