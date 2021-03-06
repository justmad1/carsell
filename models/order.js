const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    client_id: {
        type: String,
    },
    car_id: {
        type: String,
    },
    car_model: {
        type: String,
    },
    login: {
        type: String,
    }
});

module.exports = mongoose.model('Order', schema);