const jwt = require('jsonwebtoken');
const Message = require('./models/Message');

const onlineUsers = new Map();

const initSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.userId}`);
    onlineUsers.set(socket.userId, socket.id);
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));

    socket.on('sendMessage', async (data) => {
      try {
        const { receiver, content } = data;
        const conversationId = [socket.userId, receiver].sort().join('_');
        const message = await Message.create({
          sender: socket.userId, receiver, conversationId, content, delivered: onlineUsers.has(receiver),
        });
        const populated = await message.populate([
          { path: 'sender', select: 'name avatar' },
          { path: 'receiver', select: 'name avatar' },
        ]);
        socket.emit('messageSent', populated);
        const receiverSocket = onlineUsers.get(receiver);
        if (receiverSocket) io.to(receiverSocket).emit('newMessage', populated);
      } catch (err) {
        socket.emit('messageError', { error: 'Failed to send message' });
      }
    });

    socket.on('typing', ({ to }) => {
      const receiverSocket = onlineUsers.get(to);
      if (receiverSocket) io.to(receiverSocket).emit('userTyping', { from: socket.userId });
    });

    socket.on('stopTyping', ({ to }) => {
      const receiverSocket = onlineUsers.get(to);
      if (receiverSocket) io.to(receiverSocket).emit('userStopTyping', { from: socket.userId });
    });

    socket.on('markRead', async ({ conversationId }) => {
      await Message.updateMany({ conversationId, receiver: socket.userId, read: false }, { read: true });
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(socket.userId);
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    });
  });
};

module.exports = { initSocket, onlineUsers };
