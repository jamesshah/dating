const socket = require("socket.io");
const LOGGER = require("./logger");

// Function to configure socket
const configSocket = (server) => {
  // Defining socket instance
  const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  global.onlineUsers = new Map();

  // Defining socket events and actions
  io.on("connection", (socket) => {
    LOGGER.info("Socket connection established");
    global.chatSocket = socket;

    // Add user to list of online users
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    // Receive message data from one user and send to receiver provided in the message if online
    socket.on("send-msg", (data) => {
      LOGGER.info("received a message on socket, sending to user", data);
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-receive", data.message);
      }
    });
  });
};
module.exports = { configSocket };
