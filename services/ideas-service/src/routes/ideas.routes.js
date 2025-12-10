const express = require('express');
const router = express.Router();

// IMPORTANT: destructure authRequired from the exported object
const { authRequired } = require('../middleware/auth');
const ideasController = require('../controllers/ideas.controller');

// ---------- Public routes ----------
router.get('/', ideasController.listIdeas);
router.get('/:id', ideasController.getIdea);
router.get('/:id/comments', ideasController.listComments);

// ---------- Protected routes (need JWT) ----------
router.post('/', authRequired, ideasController.createIdea);
router.delete('/:id', authRequired, ideasController.deleteIdea);

router.post('/:id/comments', authRequired, ideasController.addComment);

router.post('/favorites/:id', authRequired, ideasController.addFavorite);
router.delete('/favorites/:id', authRequired, ideasController.removeFavorite);

module.exports = router;
