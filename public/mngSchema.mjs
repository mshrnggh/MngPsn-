import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  content: {
    type: String,
    required: true,
  },
  straged: {
    type: String,
    required: true,
  },
});

const Thread = mongoose.model("Thread", threadSchema);

export { Thread };
