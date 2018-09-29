const { exec } = require('child_process');
const config = require('../config');

const { remote, local } = config.repo;

module.exports = class Git {
  static async clone() {
    return new Promise((resolve, reject) => {
      exec(`git clone ${remote} "${local}"`, err => (err ? reject(err) : resolve()));
    });
  }
};
