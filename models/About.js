//модель коллекции страниц в формате markdown
//
const mongoose = require('mongoose');
const connection = require('../libs/connection');

const AboutSchema = new mongoose.Schema({
    mdInfo: {
        type: String,
        required: 'этот {PATH} не должен пустовать'
    }
});

module.exports = connection.model('About', AboutSchema);