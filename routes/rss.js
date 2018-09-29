const { Router } = require('express');
const marked = require('marked');
const rss = require('@aytacworld/rss');
const database = require('../database/index');
const config = require('../config');

const router = Router();

router.get('/', (req, res) => {
  const posts = database.getAll();
  const max = posts.length;
  let allTags = [];
  for (let i = 0; i < max; i += 1) {
    allTags = [...allTags, ...posts[i].tags];
  }
  const tags = allTags.filter((i, p) => allTags.indexOf(i) === p);
  res.render('rss', { tags });
});

function mapToRss(item) {
  return Object.assign({}, item, {
    link: `${config.channel.link}/p/${item.id}`,
    guid: `${config.channel.link}/p/${item.id}`,
    description: `<![CDATA[\n${marked(item.body)}\n]]>`,
  });
}

function sendRss(res, atomLink, dataMethod) {
  const items = dataMethod.map(mapToRss);
  res.set('Content-Type', 'text/xml').send(rss(Object.assign({}, config.channel, {
    items,
    atomLink: `${config.channel.atomLink}/${atomLink}`,
  })));
}

router.get('/all', (req, res) => {
  sendRss(res, 'all', database.getAll());
});

router.get('/:tag', (req, res) => {
  sendRss(res, req.params.tag, database.getByTag(req.params.tag));
});

module.exports = router;
