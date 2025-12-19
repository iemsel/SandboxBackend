const express = require('express');
const router = express.Router();

// IMPORTANT: destructure authRequired from the exported object
const { authRequired, optionalAuth } = require('../middleware/auth');
const ideasController = require('../controllers/ideas.controller');

// ---------- Public routes ----------
router.get('/', ideasController.listIdeas);
router.get('/:id/comments', ideasController.listComments);
// getIdea uses optional auth to show user reactions if logged in
router.get('/:id', optionalAuth, ideasController.getIdea);

// ---------- Protected routes (need JWT) ----------
router.post('/', authRequired, ideasController.createIdea);

// Comment reactions (must be before /:id route to avoid conflicts)
router.post('/comments/:commentId/like', authRequired, ideasController.toggleCommentLike);
router.post('/comments/:commentId/dislike', authRequired, ideasController.toggleCommentDislike);

router.post('/:id/comments', authRequired, ideasController.addComment);
router.post('/favorites/:id', authRequired, ideasController.addFavorite);
router.delete('/favorites/:id', authRequired, ideasController.removeFavorite);
router.delete('/:id', authRequired, ideasController.deleteIdea);

module.exports = router;
