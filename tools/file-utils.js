const fs = require('fs');
const path = require('path');

function getMeta(key, data) {
  const reg = new RegExp(`\\[\\/\\/\\]: # \\(${key}: [a-zA-Z0-9\\-_ ]{4,}\\)`);
  const raw = reg.exec(data);
  return raw ? raw[0].replace(`[//]: # (${key} `, '').replace(')', '') : null;
}

module.exports = class File {
  static async read(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => (err ? reject(err) : resolve(data)));
    });
  }

  static async getPost(filePath) {
    const result = {};
    const file = await File.read(path.resolve('..', filePath));
    result.id = getMeta('id', file);
    result.title = getMeta('title', file);
    result.slug = getMeta('slug', file);
    result.tags = getMeta('tags', file);
    result.createdAt = getMeta('createdAt', file);
    result.updatedAt = getMeta('updatedAt', file);
    result.published = getMeta('published', file);
    result.body = file;
    return result;
  }
};
