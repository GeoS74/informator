const config = require('../config.js');
const mongoose = require('mongoose');

mongoose.plugin( require('mongoose-unique-validator') );

module.exports = mongoose.createConnection(config.mongodb.uri, { autoIndex: config.mongodb.autoindex });