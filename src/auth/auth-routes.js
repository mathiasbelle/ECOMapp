const express = require("express");
const router = express.Router();
const authController = require('./auth-controller');
const authenticateToken = require('../middleware/auth-middleware').authenticateToken;
const { body } = require('express-validator');

router.post(
    '/auth/login',
    body('email').trim().isEmail(),
    body('password').trim().notEmpty().escape(),
    authController.login
);
router.post(
    '/auth/register',
    body('name').trim().notEmpty().escape(),
    body('email').trim().isEmail(),
    body('password').trim().notEmpty().escape(),
    authController.register
);
router.post('/auth/me', authenticateToken, authController.me);


module.exports = router;
