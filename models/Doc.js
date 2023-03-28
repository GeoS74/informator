const mongoose = require('mongoose');
const connection = require('../libs/connection');
const Directing = require('./Directing');
const Task = require('./Task');

const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: 'не заполнено обязательное поле {PATH}',
  },
  desc: {
    type: String,
  },
  directing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Directing,
    required: 'не заполнено обязательное поле {PATH}',
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Task,
    required: 'не заполнено обязательное поле {PATH}',
  },
  files: [String],
}, {
  timestamps: true,
});

Schema.index(
  {
    title: 'text',
  },
  {
    name: 'ActionSearchIndex',
    default_language: 'russian',
  },
);

module.exports = connection.model('Doc', Schema);
