import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 50,
  },
  createdAt: { type: Date, default: Date.now },
  content: {
    type: String,
    required: true,
  },
});

const Thread = mongoose.model("Thread", threadSchema);

export { Thread };
