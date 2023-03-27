const connection = require('./connection');
const logger = require('./logger');
const config = require('../config');
const Action = require('../models/Action');

(async () => {
  // dropped database
  if (process.argv[2] === '--drop') {
    await connection.dropDatabase()
      .then(() => logger.info(`database "${config.mongodb.database}" dropped`))
      .catch((error) => logger.warn(error.message))
      .finally(() => process.exit());
  }

  Action.insertMany([
    { title: 'Создать' },
    { title: 'Редактировать' },
    { title: 'Удалить' },
    { title: 'Утвердить' },
    { title: 'Согласовать' },
    { title: 'Ознакомиться' },
  ])
    .then(() => logger.info('create and init collection "actions"'))
    .catch((error) => logger.warn(error.message))
    .finally(() => process.exit());
})();
