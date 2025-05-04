const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("crypto-data", (data) => {
    console.log("Received from consumer:", data);
    io.emit("crypto-data", data); // Send to frontend
  });
});

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});
