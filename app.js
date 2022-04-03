// const express = require("express");
import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";
// import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import express from "express";
const app = express();
import cors from "cors";
// var cors = require("cors");
// const { request } = require("http");
const port = process.env.PORT || 5000;
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
let uid = "";
const auth = getAuth();
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// const database = getDatabase(app);
app.get("/", (req, res) => {
  async function getCities(db) {
    const citiesCol = collection(db, "usergames");
    console.log(citiesCol);
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map((doc) => doc.data());
    console.log(cityList);
  }
  getCities(db);
  res.send("Server PAllu is up");
});
app.post("/signup", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  var userreq = req.body;
  console.log(userreq[0]);
  console.log(typeof userreq[0]);
  console.log(typeof userreq[0].username);
  console.log(userreq[0].username);
  createUserWithEmailAndPassword(auth, userreq[0].username, userreq[0].password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      uid = user.uid;
      res.json({ userId: uid, success: true });
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      res.json({ success: false, errorMessage: errorMessage });
    });
  //   res.json({ b: true });
});
app.post("/login", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  var userreq = req.body;
  console.log(userreq[0]);
  console.log(typeof userreq[0]);
  console.log(typeof userreq[0].username);
  console.log(userreq[0].username);
  signInWithEmailAndPassword(auth, userreq[0].username, userreq[0].password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user.uid);
      uid = user.uid;
      // ...
      res.json({ userId: uid, success: true });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      res.json({ success: false });
    });
});
app.post("/createGame", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let values = req.body[0];
  console.log(values);
  let userId = values.userId;
  let gameName = values.gameName;
  const addDatas = async (userId, gameName) => {
    const newCityRef = collection(db, "usergames");
    let data = {
      name: "Pallasvi3",
      gameName: gameName,
      userId: userId,
    };
    let gamesId = await addDoc(newCityRef, data);

    const gamesRef = collection(db, "Games");
    let gameData = {
      gameName: gameName,
      userId: userId,
      gameId: gamesId,
    };
    const gameId = await addDoc(gamesRef, gameData);
    console.log(gameId.Id);
  };
  addDatas(userId, gameName);
});
app.post("/getGames", (req, res) => {
  const getData = async () => {
    const q = query(
      collection(db, "usergames"),
      where("userId", "==", req.body[0].userId)
    );
    // console.log(q);
    const querySnapshot = await getDocs(q);
    let games = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      let x = [doc.id, doc.data().gameName];
      games.push(x);
    });
    res.json({ success: true, games: games });
  };
  getData();
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
