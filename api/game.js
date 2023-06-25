import e from "express";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
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
  let q = req.body[0]?.questions;
  let j = q?.map((elem) => {
    return {
      question: elem[0],
      answer: elem[1],
    };
  });
  let gameData = {
    gameName: req.body[0].gameName,
    gameId: req.body[0].gameId,
    gameType: req.body[0].gameType,
    questions: j ? j : null,
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

const createRoomDb = async (req, res) => {
  let gameDatas = req.body[0].gameData;
  let roomNames = req.body[0].roomName;
  const readyToPlayGames = collection(db, "readyToPlayGames");
  let arr = [];
  gameDatas.forEach((game) => {
    let gameObj = {
      gameID: game[0],
      gameData: game[1],
    };
    arr.push(gameObj);
  });
  let data = {
    roomName: roomNames,
    gameData: arr,
  };
  console.log(gameDatas);
  let newGameId = await addDoc(readyToPlayGames, data);
  let gameIdName = await newGameId.id;
  res.json({ success: true, roomId: gameIdName });
};
const startGame1 = async (req, res) => {
  let roomName = req.body[0].room;
  let userName = req.body[0].user;
  const q = query(
    collection(db, "readyToPlayGames"),
    where("roomName", "==", roomName)
  );
  const querySnapshot = await getDocs(q);
  let dataResult = [];
  let isAdmin = false;
  querySnapshot.forEach(async (doc) => {
    dataResult.push(doc.data());
    console.log(doc.data());
    let users = doc.data().users;
    console.log(users);
    if (!users) {
      users = {};
      isAdmin = true;
    }
    users[userName] = 0;
    updateDoc(doc.ref, { users: users });
  });
  res.json({ success: true, isAdmin: isAdmin });
};
const startGame2 = async (req, res) => {
  let roomName = req.body[0].room;
  const q = query(
    collection(db, "readyToPlayGames"),
    where("roomName", "==", roomName)
  );
  let docData = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    console.log(doc.data());
    docData.push(doc.data());
  });
  res.json({ success: true, data: docData });
};
const userList = async (req, res) => {
  let roomName = req.body[0].roomName;
  const q = query(
    collection(db, "readyToPlayGames"),
    where("roomName", "==", roomName)
  );
  const querySnapshot = await getDocs(q);
  let docData = [];
  querySnapshot.forEach(async (doc) => {
    console.log(doc.data());
    docData.push(doc.data());
  });
  let users = docData[0].users;
  res.json({ success: true, waiting: false, userList: users });
};
const addPoints = async (req, res) => {
  console.log(req.body[0]);
  let vote = req.body[0].userName;
  let score = req.body[0].points;
  let roomName = req.body[0].roomName;

  const q = query(
    collection(db, "readyToPlayGames"),
    where("roomName", "==", roomName)
  );
  const querySnapshot = await getDocs(q);
  let docData = [];
  querySnapshot.forEach(async (doc) => {
    console.log(doc.data());
    docData.push(doc.data());
  });
  let users = docData[0].users;

  let socketsCount = docData[0].socketsCount;
  if (!socketsCount) {
    socketsCount = 0;
  }
  socketsCount++;
  users[vote] = users[vote] + score;
  console.log("Users", users);
  querySnapshot.forEach(async (doc) => {
    console.log("docData", doc.data());
    docData.push(doc.data());
    updateDoc(doc.ref, { users: users, socketsCount: socketsCount });
  });
  console.log("Users again", users);
  if (socketsCount === Object.keys(users).length) {
    res.json({ success: true, waiting: false, leaderBoard: users });
  } else {
    res.json({ success: true, waiting: false, leaderBoard: users });
  }
};
const votePerson = async (req, res) => {
  console.log(req.body[0]);
  let vote = req.body[0].vote;
  let roomName = req.body[0].roomName;
  let score = req.body[0].score;

  const q = query(
    collection(db, "readyToPlayGames"),
    where("roomName", "==", roomName)
  );
  const querySnapshot = await getDocs(q);
  let docData = [];
  querySnapshot.forEach(async (doc) => {
    console.log(doc.data());
    docData.push(doc.data());
  });
  let users = docData[0].users;

  let socketsCount = docData[0].socketsCount;
  if (!socketsCount) {
    socketsCount = 0;
  }
  socketsCount++;
  users[vote] = users[vote] - score;
  console.log("Users", users);
  querySnapshot.forEach(async (doc) => {
    console.log("docData", doc.data());
    docData.push(doc.data());
    updateDoc(doc.ref, { users: users, socketsCount: socketsCount });
  });
  console.log("Users again", users);
  if (socketsCount === Object.keys(users).length) {
    res.json({ success: true, waiting: false, leaderBoard: users });
  } else {
    res.json({ success: true, waiting: false, leaderBoard: users });
  }
};
const submitQuiz = async (req, res) => {
  let answers = req.body[0].answers;
  let roomName = req.body[0].roomName;
  let userName = req.body[0].userName;
  let ind = req.body[0].ind;
  const q = query(
    collection(db, "readyToPlayGames"),
    where("roomName", "==", roomName)
  );
  const querySnapshot = await getDocs(q);
  let docData = [];
  querySnapshot.forEach(async (doc) => {
    console.log(doc.data());
    docData.push(doc.data());
  });
  let allData = docData[0].gameData[ind].gameData.questions;
  let users = docData[0].users;
  let expectedAnswers = [];
  allData.forEach((e) => {
    expectedAnswers.push(e.answer);
  });
  let score = 0;
  for (let i = 0; i < expectedAnswers.length; i++) {
    if (expectedAnswers[i] === answers[i]) {
      score++;
    }
  }
  let socketsCount = docData[0].socketsCount;
  if (!socketsCount) {
    socketsCount = 0;
  }
  socketsCount++;
  users[userName] = users[userName] + score;
  querySnapshot.forEach(async (doc) => {
    console.log(doc.data());
    docData.push(doc.data());
    updateDoc(doc.ref, { users: users, socketsCount: socketsCount });
  });
  if (socketsCount === Object.keys(users).length) {
    res.json({ success: true, waiting: false, leaderBoard: users });
  } else {
    res.json({ success: true, waiting: false, leaderBoard: users });
  }
};
export {
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
  addPoints,
};
