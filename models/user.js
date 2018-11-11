const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    fio: {
        type: String,
    },
    login: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    }
});

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('User', schema);