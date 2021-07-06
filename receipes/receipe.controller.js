const express = require('express');
const router = express.Router();
const receipeService = require('./receipe.service');

// routes
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function getAll(req, res, next) {
    receipeService.getAll()
        .then(receipes => res.json(receipes))
        .catch(err => next(err));
}

function getById(req, res, next) {
    receipeService.getById(req.params.id)
        .then(receipe => receipe ? res.json(receipe) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    receipeService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    receipeService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
