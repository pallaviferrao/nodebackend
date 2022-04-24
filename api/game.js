import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { createRedisClient } from "./room.js";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "game-ae656.firebaseapp.com",
  projectId: "game-ae656",
  storageBucket: "game-ae656.appspot.com",
  messagingSenderId: process.env.MESSAGE_SENDER_ID,
  appId: process.env.API_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

const apps = initializeApp(firebaseConfig);
const db = getFirestore(apps);
const createGame = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let values = req.body[0];
  let userId = values.userId;
  let gameName = values.gameName;
  const newCityRef = collection(db, "usergames");
  let data = {
    name: "Pallasvi3",
    gameName: gameName,
    userId: userId,
  };
  let gamesId = await addDoc(newCityRef, data);
  let gameId = await gamesId.id;
  res.json({ success: true, gameId: gameId });
};

const getGames = async (req, res) => {
  const q = query(
    collection(db, "usergames"),
    where("userId", "==", req.body[0].userId)
  );
  // console.log(q);
  const querySnapshot = await getDocs(q);
  let games = [];
  querySnapshot.forEach((doc) => {
    let x = [doc.id, doc.data().gameName];
    games.push(x);
  });
  res.json({ success: true, games: games });
};
const addGame = async (req, res) => {
  const gamesRef = collection(db, "Games");
  let q = req.body[0].questions;
  let j = q.map((elem) => {
    return {
      question: elem[0],
      answer: elem[1],
    };
  });
  let gameData = {
    gameName: req.body[0].gameName,
    gameId: req.body[0].gameId,
    questions: j,
  };
  const gameId = await addDoc(gamesRef, gameData);
  res.json({ success: true, gameId: gameId.id });
};

const getGame = async (req, res) => {
  const q = query(
    collection(db, "Games"),
    where("gameId", "==", req.body[0].gameId)
  );
  const querySnapshot = await getDocs(q);
  //   const client = createRedisClient();
  //   await client.connect();
  let games = [];
  querySnapshot.forEach((doc) => {
    let x = [doc.id, doc.data()];
    // createRedisClient("room1Pall", JSON.stringify(doc.data()));
    // client.set("room1Pall", JSON.stringify(doc.data()));
    games.push(x);
  });

  //   const value = await client.get("room1Pall");
  //   console.log(value);
  //   await client.quit();
  res.json({ success: true, games: games });
};
export { addGame, getGames, getGame, createGame };