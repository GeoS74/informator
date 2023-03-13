const mongoose = require('mongoose');
const connection = require('../libs/connection');
const Task = require('./Task');

const Schema = new mongoose.Schema({
  title: {
    type: String,
    unique: 'Не уникальное значение {PATH}',
  },
  tasks: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: Task,
  }
}, {
  timestamps: true,
});

Schema.index(
  {
    title: 'text',
  },
  {
    name: 'RoleSearchIndex',
    default_language: 'russian',
  },
);

module.exports = connection.model('Role', Schema);
