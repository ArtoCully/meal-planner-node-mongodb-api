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

async function create(recipeParam) {
    console.log('recipeParam', recipeParam);

    // validate
    if (await Recipe.findOne({ title: recipeParam.title })) {
        throw 'Recipe "' + recipeParam.title + '" is already taken';
    }

    const recipe = new Recipe(recipeParam);

    // save recipe
    await recipe.save();

    return recipe;
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
    const recipe = await Recipe.findById(id);
    console.log('recipe', recipe);
    await Recipe.findByIdAndDelete(id);
    return recipe;
}
