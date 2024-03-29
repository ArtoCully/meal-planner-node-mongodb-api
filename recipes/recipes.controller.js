const express = require('express');
const router = express.Router();
const db = require('_helpers/db');
const recipeService = require('./recipe.service');
const userService = require('../users/user.service');

// routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function getAll(req, res, next) {
    recipeService.getAll()
        .then(recipes => res.json(recipes))
        .catch(err => next(err));
}

function getById(req, res, next) {
    recipeService.getById(req.params.id)
        .then(recipe => recipe ? res.json(recipe) : res.sendStatus(404))
        .catch(err => next(err));
}

async function create(req, res, next) {
    const user = await userService.getById(req.user.sub);

    // validate user
    if (!user) {
        throw 'You need to be logged in to create a recipe';
    }

    console.log('req.body', req.body);

    try {
        const { recipes: userRecipes } = user;
        const recipe = await recipeService.create(req.body)

        // save recipe id to user
        let recipes = [];

        if (userRecipes.length) {
            if (userRecipes.filter((f) => f !== recipe._id)) {
                recipes = [...userRecipes, recipe._id];
            }
        } else {
            recipes.push(recipe._id);
        }

        await userService.update(user._id, { recipes: recipes });

        return res.json({ id: recipe._id });
    } catch (err) {
        next(err);
    }
}

function update(req, res, next) {
    recipeService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

async function _delete(req, res, next) {
    const user = await userService.getById(req.user.sub);

    console.log('user', user);

    try {
        const deleteRecipe = await recipeService.delete(req.params.id);
        const { recipes: userRecipes } = user;

        console.log('deleteRecipe', deleteRecipe);
        console.log('userRecipes', userRecipes);

        if (userRecipes) {
            let recipes = userRecipes.filter((f) => f !== deleteRecipe._id);

            await userService.update(user._id, { recipes: recipes });
        }

        return res.json({});
    } catch (err) {
        next(err);
    }
}
