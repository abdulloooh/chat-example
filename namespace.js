module.exports = function (io, log) {
  const nsp = io.of("/first-namespace");

  nsp.use((socket, next) => {
    log("testing", socket.nsp);
    const workspace = socket.nsp;

    //do something or check something like if the user is an admin (if this is admin namespace)
    // /**if fail*/ return;
    /**else pass*/ next();
  });

  nsp.on("connection", (socket) => {
    log("inside first namespace now");
  });

  nsp.emit("hi", "everyone");
};
