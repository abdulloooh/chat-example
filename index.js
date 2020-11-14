const app = require("express")();

//socket.io mounts on node.js http server
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/static/index.html");
});

app.get("/assets/jquery.js", (req, res) =>
  res.sendFile(__dirname + "/assets/jquery.js")
);

const people = [];

io.on("connection", (socket) => {
  //connect event

  socket.emit("join", "What is your name?");

  socket.on("new user", (name) => {
    if (name === null || name === undefined || name === "null") {
      socket.emit("random", "Not Joined, Please refresh this page");
      socket.disconnect();
      return;
    }

    people.push({ id: socket.id, name });
    socket.emit("random", "Welcome to Laplace chat");
    socket.broadcast.emit("random", `${name} joined`);
    io.emit("random", `${people.length} online`);
  });

  //typing
  socket.on("typing", () =>
    socket.broadcast.emit(
      "typing",
      `${people.find((p) => p.id === socket.id).name} is typing`
    )
  );

  // stop typing
  socket.on("stop typing", () => socket.broadcast.emit("typing", ""));

  //receive broadcast message
  socket.on("sender message", (msg) => {
    socket.broadcast.emit("receiver response", {
      text: msg,
      sender: people.find((p) => p.id === socket.id).name,
    });
    //broadcast message
  });

  // Each socket also fires a special disconnect event:
  socket.on("disconnect", () => {
    if (people.length < 1) return;
    const client = people.find((x) => x.id === socket.id);
    if (!client) return;
    const clientIndex = people.indexOf(client);
    socket.broadcast.emit("left user", [`${client.name} left`]);
    people.splice(clientIndex, 1);
    io.emit("random", `${people.length} online`);
  });
});

const PORT = process.env.port || 3000;
http.listen(PORT, () => console.log("Listening on port " + PORT));

//auto exposes an endpoint /socket.io/socket.io.js
//io.emit broadcast to every connected sockets
//sender.broadcast.emit broadcast to every socket except the emitting socket
//socket.emit to send to the emitting socket only
//socket.disconnect()
