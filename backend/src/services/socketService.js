let io = null;

module.exports = {
  // 1. Initialize: Server.js calls this to give us the 'microphone'
  setIo: (ioInstance) => {
    io = ioInstance;
  },

  // 2. Register: Logs when a client connects (optional debug)
  registerSocket: (socket) => {
    console.log(`New Client Connected: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`Client Disconnected: ${socket.id}`);
    });
  },

  // 3. Emit: The Controller calls this to shout "UPDATE!"
  emit: (event, data) => {
    if (io) {
      io.emit(event, data); // Broadcast to everyone
    }
  }
};