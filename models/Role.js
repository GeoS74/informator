const mongoose = require('mongoose');
const connection = require('../libs/connection');
const Task = require('./Task');
const Action = require('./Action');

const BundleTaskToActions = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Task,
  },
  actions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: Action,
  },
})

const Schema = new mongoose.Schema({
  title: {
    type: String,
    unique: 'Не уникальное значение {PATH}',
  },
  tasks: [BundleTaskToActions],
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
