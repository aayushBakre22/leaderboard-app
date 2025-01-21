import { Server } from "socket.io";

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("A client disconnected:", socket.id);
    });
  });
};

const emitEvent = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

export { initSocket, emitEvent };
