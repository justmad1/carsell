const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    color: {
        type: String,
    },
    model: {
        type: String,
    },
    complectation: {
        type: String,
    }
});

// schema.set('toJSON', {
//     virtuals: true
// });

module.exports = mongoose.model('Car', schema);