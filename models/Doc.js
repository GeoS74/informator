const mongoose = require('mongoose');
const connection = require('../libs/connection');
const Directing = require('./Directing');
const Task = require('./Task');

const Schema = new mongoose.Schema({
  num: Number, // идентификатор в рамках документов одного типа и направления
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
  author: {
    type: String,
    required: 'не заполнено обязательное поле {PATH}',
  },
  files: [{ originalName: String, fileName: String }],
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

// генерация идентификатора в рамках документов одного типа и направления
Schema.pre('save', async function(next) {
  const lastDoc = await module.exports.findOne({
    directing: this.directing,
    task: this.task,
  })
  .sort({_id: -1});

  this.num = (lastDoc?.num || 0) + 1;

  next()
});

module.exports = connection.model('Doc', Schema);
