const Koa = require('koa');
const cors = require('@koa/cors');

const config = require('./config');
const errorCatcher = require('./middleware/error.catcher');
const aboutCompanyRoutes = require('./routes/about.company.routes');
const UserRoutes = require('./routes/user.routes');

const app = new Koa();

app.use(errorCatcher);
if (config.node.env === 'dev') {
  app.use(cors());
}

app.use(aboutCompanyRoutes);
app.use(UserRoutes.routes);
app.use(UserRoutes.static);

module.exports = app;
