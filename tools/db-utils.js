const { exec } = require('child_process');
const path = require('path');
// const mongoose = require('mongoose');
// const CONNECTION_STRING = 'mongodb://localhost:27017/blog';
// mongoose.connect(CONNECTION_STRING);

const postsPath = path.resolve(__dirname, '..', 'repo', 'posts');

module.exports = class Database {
  static async initDatabase() {
    return new Promise(async (resolve, reject) => {
      /**
       * 1. get all post files
       * 2. remove all posts from db
       * 3. foreach post file, insert file in db
       * 4a. if post file has objectId, use it
       * 4b. if not, create objectId, update file and git commit
       */
      const posts = await Database.listAllPosts();
    });
  }

  static async listAllPosts() {
    return new Promise((resolve, reject) => {
      exec(`ls ${postsPath}/*.md`, (err, stdout) => (err ? reject(err) : resolve(stdout.split(' '))));
    });
  }
};
