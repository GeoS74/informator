const mongoose = require('mongoose');
const connection = require('../libs/connection');
// const Role = require('./Role');

const Schema = new mongoose.Schema({
  title: {
    type: String,
    unique: 'Не уникальное значение {PATH}',
  },
  // roles: {
  //   type: [mongoose.Schema.Types.ObjectId],
  //   ref: Role,
  // }
}, {
  timestamps: true,
});

Schema.index(
  {
    title: 'text',
  },
  {
    name: 'TaskSearchIndex',
    default_language: 'russian',
  },
);

module.exports = connection.model('Task', Schema);
