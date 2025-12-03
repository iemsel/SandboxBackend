const express = require('express');
const { authRequired } = require('../middleware/auth');
const {
  listGroups,
  createGroup,
  addMember,
  removeMember,
  listMessages,
  sendMessage,
  deleteMessage,
} = require('../controllers/chat.controller');

const router = express.Router();

router.get('/groups', authRequired, listGroups);
router.post('/groups', authRequired, createGroup);

router.post('/groups/:groupId/members', authRequired, addMember);
router.delete('/groups/:groupId/members/:userId', authRequired, removeMember);

router.get('/groups/:groupId/messages', authRequired, listMessages);
router.post('/groups/:groupId/messages', authRequired, sendMessage);
router.delete('/groups/:groupId/messages/:messageId', authRequired, deleteMessage);

module.exports = router;
