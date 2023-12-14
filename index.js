const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"],
    }
  });

//const io = require('socket.io')(8000)(http,  { cors: { origin: '*' } });

const users = {};

io.on('connection', socket=>{
    socket.on('new-user-joined', name =>{
        console.log(name)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    })
    socket.on('send', message=>{
        socket.broadcast.emit('receive',{message:message, name:users[socket.id]});
    });
})

server.listen(8000, () => {
    console.log("server has started!");
  });
  