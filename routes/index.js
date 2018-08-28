const marked = require('marked');
const { Router } = require('express');
const Posts = require('../database/post');

class Routes {
  constructor() {
    this.router = Router();
    this.editPostRouting();
    this.readPostRouting();
    this.commentRouting();
  }

  readPostRouting() {
    this.router.get('/', async (req, res) => {
      let posts = [];
      const pg = req.query.p === 'all' ? undefined : parseInt(req.query.p, 10) || 0;
      if (req.query.s) {
        posts = await Posts.search(req.query.s, pg, Boolean(req.user));
      } else if (req.user) {
        posts = await Posts.get({}, pg);
      } else if (req.query.t) {
        posts = await Posts.getByTag(req.query.t, pg);
      } else {
        posts = await Posts.getPublished(pg);
      }
      const total = await Posts.count(pg);
      const tt = parseInt(total / 10, 10);
      const nav = {
        show: pg !== undefined,
        prev: pg > 0 ? pg - 1 : 0,
        next: pg < tt ? pg + 1 : tt,
        last: tt,
      };
      res.render('index', { posts, user: req.user, nav });
    });

    this.router.get('/p/:slug', async (req, res) => {
      const post = await Posts.getBySlug(req.params.slug);
      if ((!post) || (!req.user && !post.published)) {
        res.redirect('/');
      }
      post.body = marked(post.body);
      res.render('blog-post', { post, user: req.user });
    });

    this.router.get('/rss', async (req, res) => {
      const posts = await Posts.getPublished();
      res.render('rss', { posts, host: `${req.protocol}://${req.get('host')}` });
    });

    this.router.get('/s', (req, res) => {
      res.render('search', { user: req.user });
    });
  }

  editPostRouting() {
    this.router.get('/e(/:id)?', async (req, res) => {
      const resBody = { id: req.params.id, user: req.user };
      if (req.params.id) {
        const post = await Posts.getById(req.params.id);
        if (post) {
          resBody.title = post.title;
          resBody.teaser = post.teaser;
          resBody.body = post.body;
          resBody.category = post.category;
          resBody.tags = post.tags;
          resBody.published = post.published;
        }
      }
      res.render('edit', resBody);
    });

    this.router.post('/e', async (req, res) => {
      if (req.body.id) {
        await Posts.save(req.body);
      } else {
        await Posts.add(req.body);
      }
      res.redirect('/');
    });
  }

  commentRouting() {
    this.router.post('/c', async (req, res) => {
      await Posts.addComment(req.body.postid, req.body);
      res.redirect(`/p/${req.body.postslug}`);
    });
  }
}

module.exports = Routes;
