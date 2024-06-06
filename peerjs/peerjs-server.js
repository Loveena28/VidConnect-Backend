const express = require('express');
const { ExpressPeerServer } = require('peer');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(
  cors({
    origin: ["https://vid-connect-theta.vercel.app"],
    credentials: true,
  })
);

const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

peerServer.on('connection', (client) => {
  console.log('Peer connected:', client.id);
});

peerServer.on('disconnect', (client) => {
  console.log('Peer disconnected:', client.id);
});

// Handle errors
peerServer.on('error', (error) => {
  console.error('PeerServer error:', error);
});

app.use('/peerjs', peerServer);

// Route for the root path
app.get("/", (req, res) => {
  res.send("Hello world!");
});

// Handle other errors
app.use((err, req, res, next) => {
  console.error('Express server error:', err);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
