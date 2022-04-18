const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
//const io = require('socket.io')(http, {
  //'transports': ['websocket']
//});
const port = process.env.PORT || 8081;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.set('transports', ['websocket']);


io.on('connection', (socket) => {
	console.log("connection made");
  socket.on('chat message', msg => {
	  console.log("chat message received on server");
	  io.emit('chat message', msg);
	  console.log("chat message forwarded from server");
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
