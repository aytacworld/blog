const { exec } = require('child_process');
const path = require('path');

const repoPath = process.env.REPOSITORY;

module.exports = class Git {
  static async init() {
    return new Promise((resolve, reject) => {
      exec(`git clone ${repoPath} "${path.resolve(__dirname, '..', 'repo')}"`, (err, stdout, stderr) => {
        if (err) return reject(err);
        console.log('stdout', stdout, 'stderr', stderr);
        return resolve();
      });
    });
  }
  // show all changes
  // git fetch && git diff-tree --no-commit-id --name-status -r HEAD^..origin/master
};
