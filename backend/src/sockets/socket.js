let io;

const initializeSocket = (server) => {
  const socketIo = require("socket.io");

  io = socketIo(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket Disconnected");
    });
  });

  return io;
};

const getIO = () => io;

module.exports = {
  initializeSocket,
  getIO,
};