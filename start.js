const path = require('path');
const Express = require('@aytacworld/express');

const git = require('./tools/git-utils');
const db = require('./tools/db-utils');

const Routes = require('./routes/index');

const PORT = process.env.PORT || 8016;

(async () => {
  await git.clone();
  await db.initDatabase();

  const app = new Express({
    templatePath: path.resolve(__dirname, 'views'),
    routes: [
      { route: '/', path: (new Routes()).router },
    ],
    staticPath: { route: '/public', path: path.resolve(__dirname, 'public') },
  });

  app.listen(PORT);
})();
