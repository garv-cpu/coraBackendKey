let connectedSockets = {};

export const initSocketServer = (io) => {
  io.on("connection", (socket) => {
    const { deviceId } = socket.handshake.query;
    console.log(`Device connected: ${deviceId}`);

    if (deviceId) {
      connectedSockets[deviceId] = socket;
    }

    socket.on("disconnect", () => {
      console.log(`Device disconnected: ${deviceId}`);
      delete connectedSockets[deviceId];
    });
  });
};

export const getSocketByDeviceId = (deviceId) => connectedSockets[deviceId];
