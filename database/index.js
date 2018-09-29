const storage = {
  index: [],
  data: {},
};

function mapToArray(array) {
  return array.map(i => storage.data[i]);
}

function filter(prop, keyword) {
  return storage.index.filter(i => storage.data[i][prop].indexOf(keyword) !== -1);
}

class Database {
  static populate(data) {
    storage.index = data.index;
    storage.data = data.data;
    storage.length = data.index.length;
  }

  static count() {
    return storage.length;
  }

  static getAll() {
    return mapToArray(storage.index);
  }

  static getPost(id) {
    return Object.assign({}, storage.data[id]);
  }

  static getByTag(tag) {
    return mapToArray(filter('tags', tag));
  }

  static search(keyword) {
    const titleSearch = filter('title', keyword);
    const tagSearch = filter('tags', keyword);
    const bodySearch = filter('body', keyword);
    const allSearchs = [...titleSearch, ...tagSearch, ...bodySearch];
    const results = allSearchs.filter((i, p) => allSearchs.indexOf(i) === p);
    return mapToArray(results);
  }
}


module.exports = Database;
