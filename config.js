const path = require('path');

const config = {
  channel: {
    title: 'Hello World',
    link: 'https://adem.ayt.ac',
    description: 'My personal blog',
    atomLink: 'https://adem.ayt.ac/rss',
  },
  repo: {
    remote: process.env.REPOSITORY || '~/test/posts-repo',
    local: path.resolve(__dirname, 'repo'),
  },
  port: process.env.PORT || 3000,
  postsDir: path.resolve(__dirname, 'repo/posts'),
  pageItemCount: 10,
};

module.exports = config;
