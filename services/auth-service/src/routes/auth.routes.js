const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

//Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authController.me);
router.post('/change-password', authController.changePassword);
router.post('/reset-password', authController.resetPasswordRequest);

module.exports = router;
