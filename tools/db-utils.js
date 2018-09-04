const { exec } = require('child_process');
const path = require('path');
const mongoose = require('mongoose');
const File = require('./file-utils');
const Post = require('../database/post');

const CONNECTION_STRING = process.env.MONGO_DB || 'mongodb://localhost:27017/blog';
mongoose.connect(CONNECTION_STRING);

const postsPath = path.resolve(__dirname, '..', 'repo', 'posts');

module.exports = class Database {
  static async initDatabase() {
    return new Promise(async (resolve, reject) => {
      try {
        const posts = await Database.listAllPosts();
        await Post.deleteAll();
        posts.forEach(async (filePath) => {
          const filePost = await File.getPost(filePath);
          // TODO: save with id from file
          const savePost = await Post.add(filePost);
          if (!filePost.id) {
            // save in file
          }
          console.log('filePost', filePost);
          console.log('savePost', savePost);
          // if (post.id) {
          //   // 4a. if post file has objectId, use it
          // } else {
          //   // 4b. if not, create objectId, update file and git commit
          // }
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  static async listAllPosts() {
    return new Promise((resolve, reject) => {
      exec(`ls ${postsPath}/*.md`, (err, stdout) => (err ? reject(err) : resolve(stdout.split('\n').filter(f => f))));
    });
  }
};
