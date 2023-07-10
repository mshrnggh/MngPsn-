const express = require("express");
const mongoose = require("mongoose");
const app = express();

const Thread = require("./models/thread.js");

const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

//DB connection
mongoose
  .connect(
    "mongodb+srv://mshrngch:1mol0623MNG@clustermn.jyrlvq2.mongodb.net/foofdb_postman_test?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log(err));

//getメソッド
app.get("/api/v1/threads", async (req, res) => {
  try {
    const allThreads = await Thread.find({});
    res.status(200).json(allThreads);
  } catch (err) {
    console.log(err);
  }
});

app.post("/ap1/v1/thread", async (req, res) => {
  try {
    console.log("post");
    const createThread = await Thread.create(req.body);
    res.status(200).json(createThread);
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, console.log("server is started"));
