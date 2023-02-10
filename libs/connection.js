const mongoose = require('mongoose');
const config = require('../config');

console.log("config")
console.log(config)

mongoose.plugin(require('mongoose-unique-validator'));

module.exports = mongoose.createConnection(
  config.mongodb.uri,
  { autoIndex: config.mongodb.autoindex },
);
