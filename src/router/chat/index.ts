import { Server } from "socket.io";
import chatController from "../../controllers/chat";


const chatRouter = (io: Server) => {
  io.on("connection", (socket) => {
    console.log(`🟢 New client connected: ${socket.id}`);

    socket.on("join-room", async (data) => {
      await chatController.joinRoom(socket, data);
    });

    socket.on("send-message", async (data) => {
      await chatController.sendMessage(socket, data);
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Client disconnected: ${socket.id}`);
    });

    // Handle errors
    socket.on("error", (data) => {
      console.error("⚠️ Error:", data.message);
      socket.emit("error-message", data);
    });
  });
};
export default chatRouter;
