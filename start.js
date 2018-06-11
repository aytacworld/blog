const path = require('path');
const mongoose = require('mongoose');
const Express = require('@aytacworld/express');
const ExpressLogin = require('@aytacworld/express-login');

const UserCollection = require('./database/user');
const Routes = require('./routes/index');

const CONNECTION_STRING = 'mongodb://localhost:27017/blog';
const PORT = process.env.PORT || 8016;

mongoose.connect(CONNECTION_STRING);

const app = new Express({
  templatePath: path.resolve(__dirname, 'views'),
  routes: [
    { route: '/', path: (new Routes()).router },
  ],
  staticPath: { route: '/public', path: path.resolve(__dirname, 'public') },
  login: ExpressLogin,
  authDatabase: { users: UserCollection },
});

app.listen(PORT);
