const { pageItemCount } = require('../config');

const storage = {
  index: [],
  data: {},
  length: 0,
  list: [],
};

function mapToArray(array) {
  return array.map(i => storage.data[i]);
}

function contains(prop, keyword) {
  return storage.list.filter(i => storage.data[i][prop].indexOf(keyword) !== -1);
}

function pagination(array, pn) {
  if (pn || pn === 0) {
    const i = pn * pageItemCount * pn;
    return mapToArray(array.slice(i, i + pageItemCount));
  }
  return mapToArray(array);
}

class Database {
  static populate(data) {
    storage.index = data.index;
    storage.data = data.data;
    storage.list = storage.index.sort().reverse().filter(i => storage.data[i].published === true);
    storage.length = storage.list.length;
  }

  static count() {
    return storage.length;
  }

  static getAll(pn) {
    return pagination(storage.list, pn);
  }

  static getPost(id) {
    return Object.assign({}, storage.data[id]);
  }

  static getByTag(tag, pn) {
    return pagination(contains('tags', tag), pn);
  }

  static search(keyword, pn) {
    const titleSearch = contains('title', keyword);
    const tagSearch = contains('tags', keyword);
    const bodySearch = contains('body', keyword);
    const allSearchs = [...titleSearch, ...tagSearch, ...bodySearch];
    const results = allSearchs.filter((i, p) => allSearchs.indexOf(i) === p);
    return pagination(results, pn);
  }
}


module.exports = Database;
