const fs = require('fs');
const path = require('path');

function getMeta(key, data) {
  const reg = new RegExp(`\\[\\/\\/\\]: # \\(${key}: [a-zA-Z0-9ıçÇşŞöÖüÜǧǦ\\-_,' ]{4,}\\)`);
  const raw = reg.exec(data);
  return raw ? raw[0].replace(`[//]: # (${key}: `, '').replace(')', '') : null;
}

module.exports = class File {
  static exists(pathToCheck) {
    return fs.existsSync(pathToCheck);
  }

  static async readDir(dirPath) {
    return new Promise((resolve, reject) => {
      fs.readdir(dirPath, 'utf8', (err, data) => (err ? reject(err) : resolve(data)));
    });
  }

  static async read(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => (err ? reject(err) : resolve(data)));
    });
  }

  static async getPost(filePath, fileName) {
    const file = await File.read(path.resolve(filePath, fileName));

    const meta = {
      title: getMeta('title', file),
      tags: getMeta('tags', file),
      pubDate: getMeta('publishdate', file) || getMeta('pubDate', file),
      published: getMeta('published', file),
      body: file.replace('\n\n', '=-=-=-=').split('=-=-=-=')[1],
    };

    return {
      id: fileName,
      title: meta.title || fileName.replace('.md', '').split('_')[1],
      tags: meta.tags ? meta.tags.replace(/ /g, '').split(',') : [],
      pubDate: meta.pubDate ? new Date(meta.pubDate) : new Date(),
      published: meta.published === 'true',
      body: meta.body,
    };
  }
};
