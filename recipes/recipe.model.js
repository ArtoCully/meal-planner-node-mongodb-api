const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: { type: String, unique: true, required: true },
    when: { type: Array, required: true },
    ingredients: { type: Array, required: true },
}, { timestamps: true });

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
});

module.exports = mongoose.model('Recipes', schema);
