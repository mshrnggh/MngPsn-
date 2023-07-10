const mongoose = require("mongoose");
const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowewrcase: true, //空白削除
  },
  calories: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) throw new Error("マイナスカロリーの存在はない前提");
    },
  },
});
const foodModel = mongoose.model("Food", FoodSchema);
module.exports = foodModel;
