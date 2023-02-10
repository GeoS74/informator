require('dotenv').config({ path: './secret.env' });

module.exports = {
  node: {
    env: process.env.NODE_ENV || 'dev',
  },
  server: {
    host: process.env.SERVER_HOST || 'localhost',
    port: process.env.SERVER_PORT || 3200,
  },
  mongodb: {
    uri: process.env.MONGO_DB || 'mongodb://localhost:27017/magnus',
    autoindex: (process.env.NODE_ENV === 'dev' ? true : false),
  },
  log: {
    file: 'app.log',
  },
};
