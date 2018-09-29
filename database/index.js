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

class Database {
  static populate(data) {
    storage.index = data.index;
    storage.data = data.data;
    storage.length = data.index.length;
    storage.list = storage.index.sort().reverse().filter(i => storage.data[i].published === true);
  }

  static count() {
    return storage.length;
  }

  static getAll(page, count) {
    if (page) {
      console.log('111', storage.list.slice(page * count, count));
      return mapToArray(storage.list.slice(page * count, count));
    }
    console.log('222', storage.list);
    return mapToArray(storage.list);
  }

  static getPost(id) {
    return Object.assign({}, storage.data[id]);
  }

  static getByTag(tag) {
    return mapToArray(contains('tags', tag));
  }

  static search(keyword) {
    const titleSearch = contains('title', keyword);
    const tagSearch = contains('tags', keyword);
    const bodySearch = contains('body', keyword);
    const allSearchs = [...titleSearch, ...tagSearch, ...bodySearch];
    const results = allSearchs.filter((i, p) => allSearchs.indexOf(i) === p);
    return mapToArray(results);
  }
}


module.exports = Database;
