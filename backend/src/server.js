import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { logger } from "./config/logger.js";
import { connectDB } from "./config/db.js";
import { sequelize } from "./config/db.js";
import { User } from "./models/User.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);



// Sync models
connectDB().then(() => {
  sequelize.sync({ alter: true });
});


// Socket.io for real-time notifications
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  logger.info("New client connected");
  socket.on("disconnect", () => logger.info("Client disconnected"));
});

server.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});

// Sync models
connectDB().then(() => {
  sequelize.sync({ alter: true });
});
