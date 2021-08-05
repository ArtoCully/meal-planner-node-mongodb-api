const db = require('_helpers/db');
const Recipe = db.Recipe;
const userService = require('../users/user.service');

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

async function create(recipeParam, userId) {
    const user = await userService.getById(userId);
    const { recipes } = user;

    // validate
    if (await Recipe.findOne({ title: recipeParam.title })) {
        throw 'Recipe "' + recipeParam.title + '" is already taken';
    }

    if (!user) {
        throw 'User error when creating recipe';
    }

    const recipe = new Recipe(recipeParam);

    // save recipe
    await recipe.save();

    // save recipe id to user
    let newRecipes = [];

    if (recipes.length) {
        if (recipes.filter((f) => f !== recipe._id)) {
            newRecipes = [...recipes, recipe._id];
        }
    } else {
        newRecipes.push(recipe._id);
    }

    await userService.update(userId, { recipes: newRecipes });
}

async function update(id, recipeParam) {
    const recipe = await Recipe.findById(id);

    // validate
    if (!recipe) throw 'Recipe not found';
    if (recipe.title !== recipeParam.title && await Recipe.findOne({ title: recipeParam.title })) {
        throw 'Recipe title "' + recipeParam.title + '" is already taken';
    }

    // copy recipeParam properties to user
    Object.assign(recipe, recipeParam);

    await recipe.save();
}

async function _delete(id) {
    await Recipe.findByIdAndRemove(id);
}
