const express = require('express');
const router = express.Router();
const ideasController = require('../controllers/ideas.controller');
const { authRequired } = require('../middleware/auth');

// Public: listing ideas (optionally filtered)
router.get('/', ideasController.listIdeas);

// Public: view single idea
router.get('/:id', ideasController.getIdea);

// Protected: create idea
router.post('/', authRequired, ideasController.createIdea);

// Protected: delete idea (only owner)
router.delete('/:id', authRequired, ideasController.deleteIdea);

// Protected: add/remove favourites
router.post('/favorites/:id', authRequired, ideasController.addFavorite);
router.delete('/favorites/:id', authRequired, ideasController.removeFavorite);

module.exports = router;
