// модель коллекции страниц в формате markdown
//
const mongoose = require('mongoose');
const connection = require('../libs/connection');

const AboutSchema = new mongoose.Schema({
  alias: {
    type: String,
    unique: 'Не уникальное значение {PATH}',
  },
  mdInfo: {
    type: String,
    required: 'даных нет',
  },
});

module.exports = connection.model('About', AboutSchema);
