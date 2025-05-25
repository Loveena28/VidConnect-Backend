const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: ["https://vid-connect-theta.vercel.app", "http://localhost:4200"]
  }
});

app.use(
  cors({
    origin: ["https://vid-connect-theta.vercel.app", "http://localhost:4200"],
    credentials: true,
  })
);

// const roomUsers = {};

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, peerId, name) => {
    socket.join(roomId);
    // add debugging information
    console.log(`Socket ${socket.id} joined room ${roomId} as ${peerId} (${name})`);
    socket.data = { roomId, peerId, name };

    // if (!roomUsers[roomId]) roomUsers[roomId] = {};
    // roomUsers[roomId][peerId] = { name };

    // Send existing users in this room only
    // const existingUsers = Object.entries(roomUsers[roomId])
    //   .filter(([id]) => id !== peerId)
    //   .map(([id, data]) => ({ userId: id, name: data.name }));

    
    // socket.broadcast.to(roomId).emit("existing-users", existingUsers);

    console.log(`${name} (${peerId}) joined room ${roomId}`);
    socket.broadcast.to(roomId).emit("user-joined", peerId, name);

    socket.on("disconnect", () => {
      const { roomId, peerId, name } = socket.data;
      // if (roomUsers[roomId]) {
      //   delete roomUsers[roomId][peerId];
        socket.broadcast.to(roomId).emit("user-disconnected", peerId, name);
        console.log(`${name} (${peerId}) left room ${roomId}`);
      }
    );

    socket.on("mute-all", () => io.to(roomId).emit("mute-all"));
    socket.on("end-meeting", () => io.to(roomId).emit("end-meeting"));
  });
});


const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
