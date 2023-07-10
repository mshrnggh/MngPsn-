const express = require("express");
const app = express();
const foodModel = require("../models/food.js");
app.use(express.json());

app.get("/foods", async (req, res) => {
  const foods = await foodModel.find({});
  try {
    res.send(foods);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Data追加作成
app.post("/food", async (req, res) => {
  const food = new foodModel(req.body);
  try {
    await food.save();
    res.send(food);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Data部分修正
app.patch("/food/:id", async (req, res) => {
  try {
    const food = await foodModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(food);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/food/:id", async (req, res) => {
  try {
    await foodModel.findByIdAndDelete(req.params.id);
    res.send("Deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = app;
