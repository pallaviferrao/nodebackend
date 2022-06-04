import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
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
const login = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  var userreq = req.body;
  signInWithEmailAndPassword(auth, userreq[0].username, userreq[0].password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      //   console.log(user.uid);
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
};
const signUp = (req, res) => {
  console.log("Signing up");
  res.setHeader("Content-Type", "application/json");
  var userreq = req.body;
  createUserWithEmailAndPassword(auth, userreq[0].username, userreq[0].password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      //  console.log(user);
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
};
export { signUp, login };
