const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    client_login: {
        type: String,
    },
    message: {
        type: String,
    }
});

module.exports = mongoose.model('Feedback', schema);