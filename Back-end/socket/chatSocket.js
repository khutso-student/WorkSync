// socket/chatSocket.js

const Message = require('../models/Message');

const onlineUsers = new Map();

const setupSocket = (io) => {
  io.on('connection', async (socket) => {
    console.log('🟢 Client connected:', socket.id);

    // Send last 50 messages on connection
    try {
      const messages = await Message.find().sort({ createdAt: 1 }).limit(50);
      socket.emit('chatHistory', messages);
    } catch (err) {
      console.error('❌ Failed to send chat history:', err);
    }

    // Handle new user connection
    socket.on('userConnected', (user) => {
      if (!user?.name) return; // Avoid pushing empty user

      onlineUsers.set(socket.id, user);
      io.emit('onlineUsers', Array.from(onlineUsers.values()));
      console.log(`👤 ${user.name} connected`);
    });

    // Handle chat message
    socket.on('chatMessage', async ({ user, message, role }) => {
      try {
        const newMsg = new Message({ user, message, role });
        await newMsg.save();
        io.emit('chatMessage', newMsg);
      } catch (err) {
        console.error('❌ Error saving message:', err);
      }
    });

    // Typing indicator
    socket.on('typing', (user) => {
      if (user) socket.broadcast.emit('typing', user);
    });

    socket.on('stopTyping', () => {
      socket.broadcast.emit('stopTyping');
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log('🔴 Client disconnected:', socket.id);
      onlineUsers.delete(socket.id);
      io.emit('onlineUsers', Array.from(onlineUsers.values()));
    });
  });
};

module.exports = setupSocket;
