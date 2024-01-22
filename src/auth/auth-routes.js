const express = require("express");
const router = express.Router();
const authController = require('./auth-controller');
const authenticateToken = require('../middleware/auth-middleware').authenticateToken;

router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.post('/auth/me', authenticateToken, authController.me);


module.exports = router;
