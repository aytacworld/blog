const { exec } = require('child_process');
const path = require('path');

const repoRemotePath = process.env.REPOSITORY;
const repoPath = path.resolve(__dirname, '..', 'repo');

module.exports = class Git {
  static async clone() {
    return new Promise((resolve, reject) => {
      exec(`git clone ${repoRemotePath} "${repoPath}"`, err => (err ? reject(err) : resolve()));
    });
  }
};
