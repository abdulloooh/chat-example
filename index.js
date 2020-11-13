const app = require("express")();

//socket.io mounts on node.js http server
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/static/index.html");
});

io.on("connection", (socket) => {
  //connect event
  const conn_msg = "A user connected";
  socket.broadcast.emit("new user", conn_msg);

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
