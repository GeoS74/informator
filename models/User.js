// модель коллекции пользователей
//
const mongoose = require('mongoose');
const connection = require('../libs/connection');

const Schema = new mongoose.Schema({
  email: {
    type: String,
    required: 'не заполнено обязательное поле {PATH}',
    unique: 'Не уникальное значение {PATH}',
  },
  position: String,
  photo: String,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = connection.model('User', Schema);
