const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: { type: String, unique: true, required: true },
    when: { type: String, required: true },
    ingredients: { type: Array, required: true },
    updatedDate: { type: Date, default: Date.now },
    createdDate: { type: Date, default: Date.now },
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('User', schema);
