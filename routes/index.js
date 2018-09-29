const marked = require('marked');
const { Router } = require('express');
const database = require('../database/index');
const git = require('../tools/git-utils');

const router = Router();

router.get('/', (req, res) => {
  let posts = [];
  const pn = req.query.p === 'all' ? undefined : parseInt(req.query.p, 10) || 0;
  if (req.query.s) {
    posts = database.search(req.query.s, pn);
  } else if (req.query.t) {
    posts = database.getByTag(req.query.t, pn);
  } else {
    posts = database.getAll(pn);
  }
  posts = posts.map(i => Object.assign({}, i, { body: marked(i.body) }));
  const total = database.count();
  const tt = parseInt(total / 10, 10);
  const nav = {
    show: pn !== undefined,
    prev: pn > 0 ? pn - 1 : 0,
    next: pn < tt ? pn + 1 : tt,
    last: tt,
  };
  res.render('index', { posts, nav });
});

router.get('/p/:id', (req, res) => {
  const post = database.getPost(req.params.id);
  if (!post) {
    res.redirect('/');
  }
  post.body = marked(post.body);
  res.render('blog-post', { post });
});

router.get('/s', (req, res) => {
  res.render('search');
});

router.get('/update', async (req, res) => {
  try {
    await git.pull();
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
