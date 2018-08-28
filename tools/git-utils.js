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

  static async listChanges() {
    return new Promise((resolve, reject) => {
      exec(`cd "${repoPath}" && git fetch && git diff-tree --no-commit-id --name-status -r HEAD^..origin/master`,
        (err, stdout) => {
          if (err) return reject(err);
          const files = stdout
            .split('\n')
            .filter(f => f)
            .map(f => f.split('\t'));
          return resolve(files);
        });
    });
  }
};
