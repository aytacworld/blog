const path = require('path');
// const mongoose = require('mongoose');
const Express = require('@aytacworld/express');

const Git = require('./tools/git-utils');

const Routes = require('./routes/index');

// const CONNECTION_STRING = 'mongodb://localhost:27017/blog';
const PORT = process.env.PORT || 8016;

(async () => {
  await Git.clone();
  // mongoose.connect(CONNECTION_STRING);

  const app = new Express({
    templatePath: path.resolve(__dirname, 'views'),
    routes: [
      { route: '/', path: (new Routes()).router },
    ],
    staticPath: { route: '/public', path: path.resolve(__dirname, 'public') },
  });

  app.listen(PORT);
})();
