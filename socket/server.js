const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "https://vid-connect-theta.vercel.app"
  }
});

app.use(
  cors({
    origin: ["https://vid-connect-theta.vercel.app"],
    credentials: true,
  })
);

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, peerId) => {
    socket.join(roomId);
    console.log(socket.id, 'has joined the room', roomId);

    // Broadcast user joined to other participants in the room
    socket.broadcast.to(roomId).emit('user-joined', peerId);

    // Handle signaling events (mute, unmute, etc.)
    socket.on('signal', (data) => {
      io.to(data.to).emit('signal', data.signal);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected');
      // Broadcast user left to other participants
      socket.broadcast.to(roomId).emit('user-left', peerId);
    });
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
