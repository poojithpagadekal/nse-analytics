import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "./env";

let io: Server;

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN ?? "https://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getSocket(): Server {
  if (!io) {
    throw new Error(`Socket.io not initialized`);
  }
  return io;
}
