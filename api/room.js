import { createClient } from "redis";
import { Server } from "socket.io";
import { httpServer } from "./server.js";
const io = new Server(httpServer, {
  cors: { origin: "*" },
});
const dataGlo = {
  data: [
    {
      type: "articles",
      id: "1",
      attributes: {
        title: "JSON:API paints my bikeshed!",
        body: "The shortest article. Ever.",
      },
      relationships: {
        author: {
          data: { id: "42", type: "people" },
        },
      },
    },
  ],
};
const createRedisClient = async (name, value) => {
  const client = createClient({
    url: "redis://redis-13382.c299.asia-northeast1-1.gce.cloud.redislabs.com:13382",
    password: process.env.REDIS_PASS,
  });
  await client.connect();
  client.set(name, value);
  const values = await client.get("room1Pall");
  console.log(values);
  await client.quit();
  return client;
};

const createRedis = async (req, res) => {
  // const createRedis = async () => {
  console.log("Redis connect");
  const client = createClient({
    url: "redis://redis-13382.c299.asia-northeast1-1.gce.cloud.redislabs.com:13382",
    password: process.env.REDIS_PASS,
  });
  await client.connect();
  client.set("names", "Flavio");
  const values = await client.get("names");
  console.log(values);
  //   await client.quit();
};
const createRoom = async (req, res) => {
  console.log("Creat Room Here");
  const client = createClient({
    url: "redis://redis-13382.c299.asia-northeast1-1.gce.cloud.redislabs.com:13382",
    password: process.env.REDIS_PASS,
  });
  await client.connect();
  // console.log(req.body[0].gameData);
  let gameData = req.body[0].gameData;
  io.on("connection", (socket) => {
    console.log("Socket Connected");
    socket.on("create-room", async (room) => {
      // console.log(room);
      socket.join(room);
      client.set(socket.id, "admin");
      client.set(room, JSON.stringify(gameData));
      socket.emit("room-joined", socket.id);
    });
    socket.on("join-room", async (room) => {
      console.log(room);
      socket.join(room);
      client.set(socket.id, Math.random() * 10);
      socket.emit("room-joined", socket.id);
    });
    socket.on("get-score", async (room) => {
      console.log("get sCore");
      const sockets = (await io.in(room).fetchSockets()).map(
        (socket) => socket.id
      );
      console.log(sockets);
      let arr = [];
      sockets.forEach(async (ele) => {
        //do something'console.log(sockets);
        let score = await client.get(ele);
        console.log(score);
        arr.push([ele, score]);
        console.log(arr);
        console.log("test", ele);
      });

      //   const joinsockets = sockets.join(",");
      //   socket.in(room).emit("hello-message", joinsockets);
    });
    socket.on("sendMessage", async (room, socketId) => {
      console.log("In the sendMassage Place");
      console.log(room);
      socket.join(room);

      const xyz = await client.get(room);
      console.log(xyz);

      // io.to(room).emit("room-joineds", "Whats up");
      // socket.to(room).emit("room-joineds", "Whats up");

      io.to(room).emit("room-joineds", xyz);
    });
    // console.log(socket.id);
    // socket.join("some room");
  });
};
export { createRedis, createRoom, createRedisClient };
