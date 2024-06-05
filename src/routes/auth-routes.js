const express = require('express');
const router = express.Router();
const {login, register, me, refresh, logout} = require('../controllers/auth-controller');
const {authenticateToken} = require('../middleware/auth-middleware');
const { body } = require('express-validator');

router.post(
    '/auth/login',
    body('email', 'Invalid email').trim().isEmail(),
    body('password', 'Invalid password').trim().notEmpty().escape(),
    login
);
router.post(
    '/auth/register',
    body('username', 'Username is required.').trim().notEmpty().escape(),
    body('name', 'Name is required.').trim().notEmpty().escape(),
    body('email', 'Invalid email').trim().isEmail(),
    body('password', 'Invalid password').trim().notEmpty().escape(),
    register
);
router.get('/auth/me', authenticateToken, me);

router.get('/auth/refresh', refresh);

router.get('/auth/logout', logout);

module.exports = router;
