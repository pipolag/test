const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors')
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  createGameRoom,
  getCurrentRoom,
  visitorJoin,
  getCurrentVisitor
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: '*'
}));

const botName = 'Game Engine Bot';

// Run when client connects
io.on('connection', socket => {
  console.log("Made socket connection", socket.id);
  socket.on("visited", (data) => {
    console.log('visited',data);
    
    visitorJoin(socket.id, data.userName, data.email); 
    
  });
  socket.on("createRoom", (data) => {
    console.log(data);
    roomId = data.gameId +'_'+ Math.floor(Math.random() * 26) + Date.now();
    createGameRoom(data.user1, data.user1Email, data.user2, data.user2Email, data.gameId, roomId); 
    

    var invitedPlayer = getCurrentVisitor(data.user2Email);
    console.log('invitedPlayer', invitedPlayer);

    if(invitedPlayer){
      socket.emit("roomCreated", roomId);
      io.to(invitedPlayer.id).emit("invited", {gameId:data.gameId, roomId, msg:formatMessage(data.user1, 'You are invited to play ember pong game.')});
    }else{
      socket.emit('message', formatMessage(botName, 'Hello, '+ data.user2 +'  is not online.'));
    }
    

  });

  socket.on("joinRoom", (data) => {
    console.log("joinRoom",data);
    const targetRoom = getCurrentRoom(data.roomid);
    console.log('targetRoom',targetRoom)
    const usersInRoom = getRoomUsers(data.roomid);
    console.log('usersInRoom',usersInRoom)
    var msgStr = 'Hello '+ data.user +' Welcome to ember gaming engine!';
    if(data.role == 'host'){
      msgStr += '\n Waiting for another player to accept invitation.'
    }
    if(usersInRoom.length > 2){
      console.log('full room')
      socket.emit('message', formatMessage(botName, 'full'));
    }else{
      console.log('vacancy room')
      const user = userJoin(socket.id, data.user, data.role, data.email, data.roomid, data.gameId, data.advanceMode );
      socket.join(user.roomid);
      socket.emit('message', formatMessage(botName, msgStr));

      socket.broadcast
        .to(user.roomid)
        .emit(
          'message',
          formatMessage(botName, `${user.userName} has joined the game`)
      );
    }
    

  });

  socket.on("gameStarted", (data) => {
    console.log("gameStarted",data);
    const targetRoom = getCurrentRoom(data.roomId);
    console.log('targetRoom',targetRoom)
    const usersInRoom = getRoomUsers(data.roomId);
    console.log('usersInRoom',usersInRoom)
    var otherPlayer = usersInRoom.find(user => user.userName != data.playerUserName);
    console.log('otherPlayer',otherPlayer)
    io.to(otherPlayer.id).emit("autoStartGame", {gameId:data.gameId, msg:formatMessage(botName, 'hello')});

    

  });

  socket.on("gamePlay", (data) => {
    console.log("gamePlay",data);
    const targetRoom = getCurrentRoom(data.roomId);
    console.log('targetRoom',targetRoom)
    const usersInRoom = getRoomUsers(data.roomId);
    console.log('usersInRoom',usersInRoom)
    var otherPlayer = usersInRoom.find(user => user.userName != data.playerUserName);
    console.log('otherPlayer',otherPlayer)
    if(otherPlayer){
      io.to(otherPlayer.id).emit("onGamePlay", {move:data.move,gameData:data.gameData,gameId:data.gameId, msg:formatMessage(botName, 'hello')});
    }  

    

  });



  socket.on('joinRoom1', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    
    socket.emit('message', formatMessage(botName, 'Welcome to ember gaming engine!'));

    
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the game`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the game`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
