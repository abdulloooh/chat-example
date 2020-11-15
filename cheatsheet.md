Emit cheatsheet

io.on('connection', onConnect);

function onConnect(socket){

- sending to the client
  `socket.emit('hello', 'can you hear me?', 1, 2, 'abc');`

- sending to all clients except sender
  `socket.broadcast.emit('broadcast', 'hello friends!');`

- Joining a "game" room `socket.join ('game room')`

- Broadcasting to a room `io.to("some room").emit("some event)`

- Broadcasting to several rooms `io.to("room1").to("room2").emit("some event)`

- Sending from a socket to a room `socket.to("some room").emit("some event")`.
  all sockets in the room will receive the event except the sender

- sending to all clients in 'game' room except sender
  `socket.to('game').emit('nice game', "let's play a game");`

- sending to all clients in 'game1' and/or in 'game2' room, except sender
  `socket.to('game1').to('game2').emit('nice game', "let's play a game (too)");`

- sending to all clients in 'game' room, including sender
  io.in('game').emit('big-announcement', 'the game will start soon');

##Sample use cases

> broadcast data to each device / tab of a given user

- Create a room for the user, add all its tabs/browser/device as they are being opended to the room
- Broadcast to that room

```
io.on("connection", async (socket)=>{
    const userId = await fetchId(socket) //sockets of dat user will av same userId

    socket.join(userId) //cos same user with several sockets, gather them in a room

    io.to(userId).emit("some events")
})
```

> or send notification about an action

```
io.on('connection', async (socket) => {
const projects = await fetchProjects(socket);

projects.forEach(project => socket.join('project:' + project.id));

socket.on('update project', async (payload) => {
    const project = await updateProject(payload);
    io.to('project:' + project.id).emit('project updated', project);
});
});
```

- To leave a room, `socket.leave ("a room")`

  ```
  Both `leave` and `join` are async so they can take callback
  ```

- Upon disconnection, all sockets leave all channels/room automatically, you can fetch the room the socket was it by listening to `disconnecting` event:

  ```
  io.on('connection', socket => {
  socket.on('disconnecting', () => {
      const rooms = Object.keys(socket.rooms);
      // the rooms array contains at least the socket ID
  });

  socket.on('disconnect', () => {
      // socket.rooms === {}
  });
  });
  ```

- sending to all clients in namespace 'myNamespace', including sender
  io.of('myNamespace').emit('bigger-announcement', 'the tournament will start soon');

- sending to a specific room in a specific namespace, including sender
  io.of('myNamespace').to('room').emit('event', 'message');

- sending to individual socketid (private message)
  `io.to(socketId).emit('hey', 'I just met you');`

- WARNING: If socket object is known, `socket.to(socket.id).emit()` will NOT work,as it will send to everyone in the room named `socket.id` but the sender. Please use the classic `socket.emit()` instead.
  i.e with the socket object, use `socket.emit(...)` else use `io.to(socketId).emit(...)`

- sending with acknowledgement
  `socket.emit('question', 'do you think so?', function (answer) {});`

- sending without compression
  `socket.compress(false).emit('uncompressed', "that's rough");`

- sending a message that might be dropped if the client is not ready to receive messages
  `socket.volatile.emit('maybe', 'do you really need it?');`

- specifying whether the data to send has binary data
  `socket.binary(false).emit('what', 'I have no binaries!');`

- sending to all clients on this node (when using multiple nodes)
  io.local.emit('hi', 'my lovely babies');

- sending to all connected clients
  io.emit('an event sent to all connected clients');

};

- Note: The following events are reserved and should not be used as event names by your application:

  - connect
  - connect_error
  - disconnect
  - disconnecting
  - newListener
  - removeListener
  - Caught a mistake? Edit this page on GitHub

```

```
