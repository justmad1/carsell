const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    color: {
        type: String
    },
    engine: {
        type: String
    },
    model: {
        type: String
    },
    complectation: {
        type: String
    },
    price: {
        type: String
    },
    option: {
        type: String
    },
    available: {
        type: Boolean
    },
    date: {
        type: Date
    },
    mileage: {
        type: String
    }
});


module.exports = mongoose.model('UsedCar', schema);