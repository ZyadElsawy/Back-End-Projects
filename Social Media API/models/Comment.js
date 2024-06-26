const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  postID: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
});

module.exports = mongoose.model("Comment", commentSchema);
