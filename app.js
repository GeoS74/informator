const Koa = require('koa');
const cors = require('@koa/cors');

const config = require('./config');
const errorCatcher = require('./middleware/error.catcher');
const aboutCompanyRoutes = require('./routes/about.company.routes');
const userRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');
const directingRoutes = require('./routes/directing.routes');
const taskRoutes = require('./routes/task.routes');
const actionRoutes = require('./routes/action.routes');
const accessSettingRoutes = require('./routes/access.setting.routes');

const app = new Koa();

app.use(errorCatcher);
if (config.node.env === 'dev') {
  app.use(cors());
}

app.use(aboutCompanyRoutes);
app.use(userRoutes.routes);
app.use(userRoutes.static);
app.use(roleRoutes);
app.use(directingRoutes);
app.use(taskRoutes);
app.use(actionRoutes);
app.use(accessSettingRoutes);

module.exports = app;
