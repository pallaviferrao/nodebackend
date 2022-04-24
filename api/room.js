import { createClient } from "redis";
import { Server } from "socket.io";
import { httpServer } from "./server.js";
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

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
};
const createRoom = (req, res) => {
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
};
export { createRedis, createRoom, createRedisClient };
