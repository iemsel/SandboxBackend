// services/chat-service/src/routes/chat.routes.js
const express = require('express');
const router = express.Router();

const authRequired = require('../middleware/auth');
const chatController = require('../controllers/chat.controller');

// all chat routes require auth
router.use(authRequired);

// List groups where current user is a member
router.get('/groups', chatController.listGroups);

// Create a new group (owner + join code)
router.post('/groups', chatController.createGroup);

// Join a group by join code
router.post('/groups/join', chatController.joinGroupByCode);

// Add member (owner / moderator only)
router.post('/groups/:groupId/members', chatController.addMember);

// Remove member (owner / moderator only)
router.delete('/groups/:groupId/members/:userId', chatController.removeMember);

// List messages in a group (members only)
router.get('/groups/:groupId/messages', chatController.listMessages);

// Send message in a group (members only)
router.post('/groups/:groupId/messages', chatController.sendMessage);

// Soft-delete message (owner / moderator only)
router.delete('/groups/:groupId/messages/:messageId', chatController.deleteMessage);

module.exports = router;
