import express, { Application } from "express";
import { createServer } from "http";
import { config } from "dotenv";
import registerRouter from "./router";
import registerMiddlewares from "./middlewares";
import { Server as SocketIOServer } from "socket.io";

const app: Application = express();
const server = createServer(app);

registerMiddlewares(app);
registerRouter(app);

config();

const io = new SocketIOServer(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log(`🟢 New client connected: ${socket.id}`);

  socket.on("join-room", ({ room, role }) => {
    socket.join(room);
    console.log(`📌 ${role} joined room: ${room}`);

    if (role === "tutor") {
      io.to(room).emit("session-started", { room });
    } else if (role === "student") {
      io.to(room).emit("student-joined", { studentId: socket.id });
    }
  });

  socket.on("send-offer", ({ offer, to }) => {
    console.log(`📡 Forwarding offer to student: ${to}`);
    io.to(to).emit("receive-offer", { offer, from: socket.id });
  });

  socket.on("send-answer", ({ answer, to }) => {
    console.log(`📡 Forwarding answer to tutor: ${to}`);
    io.to(to).emit("receive-answer", { answer });
  });

  socket.on("ice-candidate", ({ candidate, to }) => {
    console.log(`📡 Forwarding ICE candidate to: ${to}`);
    io.to(to).emit("ice-candidate", { candidate });
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});

const PORT: string | number = process.env.PORT || 5000;
const ENV: string = process.env.NODE_ENV || "development";

server.listen(PORT, () =>
  console.log(` 📡 Backend server: Running in ${ENV} mode on port ${PORT}`)
);
