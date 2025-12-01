const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// middle ware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/partners", async (req, res) => {
  // const users = req.body;
  // const cursor = users.find();
  // const result = await cursor.toArray();
  res.send("geted");
});
app.post("/partners", async (req, res) => {
  res.send("post");
});
app.patch("/partners", async (req, res) => {
  res.send("pastch");
});
app.delete("/partners", async (req, res) => {
  res.send("pastch");
});

app.post("users", async (res, req) => {});

const post = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
