const { exec } = require('child_process');
const config = require('../config');
const file = require('./file-utils');

const { remote, local } = config.repo;

module.exports = class Git {
  static async cloneOrPull() {
    return new Promise(async (resolve, reject) => {
      try {
        if (file.exists(local)) {
          await Git.pull();
        } else {
          await Git.clone();
        }
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  static async pull() {
    return new Promise((resolve, reject) => {
      exec(`cd ${local} && git pull`, err => (err ? reject(err) : resolve()));
    });
  }

  static async clone() {
    return new Promise((resolve, reject) => {
      exec(`git clone ${remote} "${local}"`, err => (err ? reject(err) : resolve()));
    });
  }
};
