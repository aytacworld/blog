const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, trim: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

class UserCollection {
  static async findById(id) {
    return new Promise((resolve, reject) => {
      User.findById(id)
        .exec((err, user) => {
          if (err) return reject(err);
          return resolve(user);
        });
    });
  }

  static async findByUsername(username) {
    return new Promise((resolve, reject) => {
      User.findOne({ username })
        .exec((err, user) => {
          if (err) return reject(err);
          return resolve(user);
        });
    });
  }
}

module.exports = UserCollection;
