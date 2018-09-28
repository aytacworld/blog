const config = {
  channel: {
    title: 'Hello World',
    link: 'https://adem.ayt.ac',
    description: 'My personal blog',
    atomLink: 'https://adem.ayt.ac/rss',
  },
  database: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/blog',
  },
  repo: {
    remote: process.env.REPOSITORY || '~/test/posts-repo',
  },
  port: process.env.PORT || 3000,
};

module.exports = config;
