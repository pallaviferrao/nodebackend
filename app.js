import { createServer } from "http";
import { Server } from "socket.io";
import { createClient } from "redis";
import { addGame, getGames, getGame, createGame } from "./api/game.js";
import { signUp, login } from "./api/auth.js";
import express from "express";
const app = express();
import cors from "cors";

const httpServer = createServer(app);

const port = process.env.PORT || 5000;
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.send("Server PAllu is up");
});
app.post("/signup", signUp);
app.post("/login", login);
app.post("/createGame", createGame);
app.post("/getGames", getGames);
app.post("/addGame", addGame);

app.post("/getGame", getGame);
app.post("/createRoom", (req, res) => {
  console.log("Here");
  io.on("connection", (socket) => {
    socket.on("create-room", (room) => {
      console.log(room);
      socket.join(room);
      socket.emit("room-joined", socket.id);
    });
    // console.log(socket.id);
    // socket.join("some room");
  });
});
httpServer.listen(port);
