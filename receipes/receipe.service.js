const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Recipe = db.Recipe;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await Recipe.find();
}

async function getById(id) {
    return await Recipe.findById(id);
}

async function create(receipeParam) {
    // validate
    if (await Recipe.findOne({ id: receipeParam.title })) {
        throw 'Receipe "' + receipeParam.title + '" is already taken';
    }

    const receipe = new Receipe(receipeParam);

    // save user
    await receipe.save();
}

async function update(id, receipeParam) {
    const receipe = await Receipe.findById(id);

    // validate
    if (!receipe) throw 'Receipe not found';
    if (receipe.title !== receipeParam.title && await Receipe.findOne({ title: receipeParam.title })) {
        throw 'Receipe title "' + receipeParam.title + '" is already taken';
    }

    // copy receipeParam properties to user
    Object.assign(receipe, receipeParam);

    await receipe.save();
}

async function _delete(id) {
    await Receipe.findByIdAndRemove(id);
}
