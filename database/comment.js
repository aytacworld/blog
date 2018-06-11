const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
  name: String,
  email: String,
  message: { type: String, required: true },
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
