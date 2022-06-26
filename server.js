const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const app = express();

const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3000;
app.use('/', express.static(__dirname + '/public'));
const users = [];

//executed once per connection -- middleware
io.use((socket, next) => {
    const userName = socket.handshake.auth.userName;
    if (!userName) {
      return next(new Error("invalid username"));
    }
    socket.userName = userName;
    next();
});

io.on('connection', (socket) => {
    const users = [];
    // send all useers to FE
    // all connection in this namespace
    for (let [id, socket] of io.of("/").sockets) {
        users.push({
        userId: id,
        userName: socket.userName,
        });
    }
    socket.emit("listUsers", users);

    // send all except self
    socket.broadcast.emit("user connected", {
        userId: socket.id,
        userName: socket.userName,
    });

    socket.on("send text", ({ message, to }) => {
        console.log(to);
        console.log(socket.id);
        socket.to(to).emit("send text", {
          message : message,
          from : socket.id
        });
      });
});

server.listen(PORT, () => {
    console.log('running on http://localhost:3000');
});