const file = require('./file-utils');
const database = require('../database/index');

const { postsDir } = require('../config');

module.exports = class Database {
  static async populate() {
    const index = await file.readDir(postsDir);
    const dataArray = [];
    const data = {};

    for (let i = 0; i < index.length; i += 1) {
      dataArray.push(file.getPost(postsDir, index[i]));
    }

    const realData = await Promise.all(dataArray);

    for (let i = 0; i < index.length; i += 1) {
      data[index[i]] = realData[i];
    }

    database.populate({ index, data });
  }
};
