const path = require('path');
const Express = require('@aytacworld/express');

const git = require('./tools/git-utils');
const dbUtils = require('./tools/db-utils');

const indexRouter = require('./routes/index');

const { port } = require('./config');

(async () => {
  await git.clone();
  await dbUtils.populate();

  const app = new Express({
    templatePath: path.resolve(__dirname, 'views'),
    routes: [
      { route: '/', path: indexRouter },
    ],
    staticPath: { route: '/public', path: path.resolve(__dirname, 'public') },
  });

  app.listen(port);
})();
