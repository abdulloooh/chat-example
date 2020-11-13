const app = require("express")();

//socket.io mounts on node.js http server
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/static/index.html");
});

const people = [];

io.on("connection", (socket) => {
  //connect event

  socket.emit("random", "Welcome to Laplace chat");
  socket.emit("join", "What is your name?");

  socket.on("new user", (name) => {
    people.push({ [socket.id]: name });
    socket.broadcast.emit("random", `${name} joined`);
    io.emit("random", `${people.length} online`);
  });

  //typing
  socket.on("typing", (msg) => socket.broadcast.emit("typing", msg));

  // stop typing

  //receive message
  socket.on("sender message", (msg) => {
    socket.broadcast.emit("receiver response", { text: msg });
    //broadcast message
  });

  // Each socket also fires a special disconnect event:
  const disconn_msg = "A user disconnected";
  socket.on("disconnect", () => io.emit("left user", disconn_msg));
});

const PORT = process.env.port || 3000;
http.listen(PORT, () => console.log("Listening on port " + PORT));

//auto exposes an endpoint /socket.io/socket.io.js
//io.emit broadcast to every connected sockets
//sender.broadcast.emit broadcast to every socket except the emitting socket
//socket.emit to send to the emitting socket only
