const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const recipeService = require('../recipes/recipe.service');
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getAllRecipesByUserId
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    const secret = process.env.JWT_SECRET || config.secret;
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '7d' });
        return {
            ...user.toJSON(),
            token
        };
    }
}

async function getAll() {
    return await User.find();
}

async function getById(id) {
    return await User.findById(id);
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

async function getAllRecipesByUserId(userId) {
    const user = await getById(userId);
    const userRecipeIds = user.recipes;

    console.log('userRecipeIds', userRecipeIds);

    if (!userRecipeIds) {
        throw 'User does not have any recipes';
    }

    const allRecipes = await recipeService.getAll();
    const userRecipes = allRecipes.filter((r) => userRecipeIds.includes(r._id));

    console.log('userRecipes', userRecipes);

    if (!userRecipes) {
        throw 'Error getting user recipes';
    }

    return userRecipes;
}
