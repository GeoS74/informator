// модель коллекции пользователей
//
const mongoose = require('mongoose');
const connection = require('../libs/connection');
const Role = require('./Role');

const Schema = new mongoose.Schema({
  roles: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: Role,
  },
  email: {
    type: String,
    required: 'не заполнено обязательное поле {PATH}',
    unique: 'Не уникальное значение {PATH}',
  },
  status: String,
  photo: String,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = connection.model('User', Schema);
