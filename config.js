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
    uri: process.env.DB_HOST || 'mongodb://localhost:27017/informator',
    autoindex: (process.env.NODE_ENV === 'dev'),
  },
  log: {
    file: 'app.log',
  },
};
