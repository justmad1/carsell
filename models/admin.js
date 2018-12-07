const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    login: {
        type: String,
    },
    password: {
        type: String,
    }
});

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Admin', schema);