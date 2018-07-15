const mongoose = require('mongoose');
const Comment = require('./comment');

const { Schema } = mongoose;
const limit = 10;

const PostSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: {
    type: String, lowercase: true, trim: true, index: { unique: true },
  },
  body: { type: String, required: true },
  teaser: { type: String, required: true, maxlength: 150 },
  category: { type: String, required: true },
  tags: [String],
  published: { type: Boolean, required: true, default: false },
  createdAt: { type: Number },
  updatedAt: { type: Number },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

// update timestamps on save
PostSchema.pre('save', function presave(next) {
  this.updatedAt = Date.now();
  if (this.isNew) {
    this.createdAt = this.updatedAt;
    this.slug = `${this.title.replace(/\s/g, '-').substring(0, 15)}-${this.createdAt}`;
  }
  this.tags = this.tags[0].replace(/\s/g, '').split(',');
  next();
});

const Post = mongoose.model('Post', PostSchema);

function sortPosts(oldQuery, pg) {
  let query = oldQuery;
  return new Promise((resolve, reject) => {
    if (pg !== undefined) {
      query = query.skip((pg > 0 ? pg - 1 : 0) * limit)
        .limit(limit);
    }
    query.sort({ createdAt: 'desc' })
      .exec((err, posts) => {
        if (err) return reject(err);
        return resolve(posts);
      });
  });
}

class PostCollection {
  static async get(queryObject = {}, pg) {
    const query = Post.find(queryObject);
    return sortPosts(query, pg);
  }

  static async getPublished(pg) {
    return PostCollection.get({ published: true }, pg);
  }

  static async getByTag(tag, pg) {
    return PostCollection.get({ published: true, tags: tag }, pg);
  }

  static async getById(id) {
    return new Promise((resolve, reject) => {
      Post.findById(id)
        .exec((err, post) => {
          if (err) return reject(err);
          return resolve(post);
        });
    });
  }

  static async getBySlug(slug) {
    return new Promise((resolve, reject) => {
      Post.findOne({ slug })
        .populate('comments')
        .exec((err, post) => {
          if (err) return reject(err);
          return resolve(post);
        });
    });
  }

  static async search(keywords, pg, searchAll) {
    const queryRegex = { $regex: keywords.replace(/\s/g, '|'), $options: 'gi' };
    const firstQuery = searchAll ? {} : { published: true };
    let query = Post.find(firstQuery);

    query = query.or([
      { title: queryRegex },
      { teaser: queryRegex },
      { body: queryRegex },
      { category: queryRegex },
      { tags: queryRegex },
    ]);

    return sortPosts(query, pg);
  }

  static async count(pg) {
    return Post.count({ published: pg !== undefined });
  }

  static async add(post) {
    return new Promise((resolve, reject) => {
      const p = new Post(Object.assign({}, post, { published: post.published === 'on' }));
      p.save((err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }

  static async save(post) {
    return new Promise(async (resolve, reject) => {
      try {
        const p = await PostCollection.getById(post.id);
        p.title = post.title;
        p.teaser = post.teaser;
        p.body = post.body;
        p.category = post.category;
        p.tags = post.tags;
        p.published = post.published === 'on';
        p.save((err) => {
          if (err) return reject(err);
          return resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      Post.deleteOne({ _id: id })
        .exec((err) => {
          if (err) return reject(err);
          return resolve();
        });
    });
  }

  static async addComment(postId, comment) {
    return new Promise((resolve, reject) => {
      const c = new Comment({
        name: comment.name,
        email: comment.email,
        message: comment.message,
      });

      c.save(async (err) => {
        if (err) return reject(err);
        try {
          const p = await PostCollection.getById(postId);
          p.comments.push(c.id);
          return p.save((err2) => {
            if (err2) return reject(err2);
            return resolve();
          });
        } catch (err3) {
          return reject(err3);
        }
      });
    });
  }
}

// create and export our model
module.exports = PostCollection;
