const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    client_login: {
        type: String,
    },
    vin_number: {
        type: String,
    },
});

module.exports = mongoose.model('Order', schema);