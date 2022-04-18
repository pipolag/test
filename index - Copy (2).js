const app = require('express')();
//const http = require('http').Server(app);
const https = require('https').Server(app);;
//const io = require('socket.io')(http);
const io = require('socket.io')(https);
const port = process.env.PORT || 8081;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});
/*
http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});*/

https.listen(port, () => {
  console.log(`Socket.IO server running at https://localhost:${port}/`);
});
