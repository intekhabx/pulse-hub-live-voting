import { Server } from "socket.io";
import { socketAuthMiddleware } from "../middleware/socket-auth.middleware";


export function initializeSocket(io: Server) {

  io.use(socketAuthMiddleware); // middleware that authenticate the user and add socketid

  io.on("connection", (socket) => {
    console.log("Authenticated socket:", socket.id);
    console.log("User:", socket.data.user);

    const userId = socket.data?.user?.id;

    socket.join(`user:${userId}`); // User ko apne personal room mein join karao
    // console.log(`User ${userId} joined room user:${userId}`);

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });
}
