const express = require("express");
const app = express();
const axios = require("axios");
app.set("view engine", "hbs");
app.use(express.static("./static/paster"));
app.use(express.static("./static/ace"));
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const api =
  "https://script.google.com/macros/s/AKfycbweN5vvRJJfIjDy_5czNK7JVKNmQ07AuLbieH2p0ysg861QR_KQeNrJQMV3x3LXqJMm/exec";
app.get("/", (req, res) => {
  res.render("index");
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("text", (json) => {
    axios.post(api, json).then((res) => {
      // console.log(res);
      socket.broadcast.emit("new text", JSON.stringify(res.data));
    });
  });
});

server.listen(process.env.PORT || 3000);
