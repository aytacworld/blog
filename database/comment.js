const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
  name: String,
  email: String,
  message: { type: String, required: true },
  createdAt: Number,
  updatedAt: Number,
  // users can upvote/downvote, but needs to know how, because anon users can upvote multiple time
  // points: Number,
});

// update timestamps on save
CommentSchema.pre('save', function presave(next) {
  this.updatedAt = Date.now();
  if (this.isNew) {
    this.createdAt = this.updatedAt;
  }
  next();
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
