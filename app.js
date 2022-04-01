const express = require("express");
const app = express();
var cors = require("cors");
const { request } = require("http");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.post("/hello", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(req.body);
  var username = req.body;
  res.json({ a: username });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
