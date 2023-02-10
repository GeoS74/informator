const config = require('./config');
const errorCatcher = require('./middleware/error.catcher');
const aboutCompanyRoutes = require('./routes/about.company.routes');
const cors = require('@koa/cors');

const Koa = require('koa');

const app = new Koa();

app.use(errorCatcher);
if (config.node.env === 'dev') {
  app.use(cors());
}

app.use(aboutCompanyRoutes);

module.exports = app;
