import { httpServer, app } from "./api/server.js";
import { createRedis, createRoom } from "./api/room.js";
import {
  addGame,
  getGames,
  getGame,
  createGame,
  createRoomDb,
  startGame1,
  startGame2,
  submitQuiz,
  userList,
  votePerson,
} from "./api/game.js";
import { signUp, login } from "./api/auth.js";
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Server PAllu is up");
});
app.post("/signup", signUp);
app.post("/login", login);
app.post("/createGame", createGame);
app.post("/getGames", getGames);
app.post("/addGame", addGame);

app.post("/getGame", getGame);
app.post("/createRoom", createRoom);
app.get("/redis", createRedis);
app.post("/createRoomDb", createRoomDb);
app.post("/startGame1", startGame1);
app.post("/startGame2", startGame2);
app.post("/submitQuiz", submitQuiz);
app.post("/userList", userList);
app.post("/votePerson", votePerson);
httpServer.listen(port);
