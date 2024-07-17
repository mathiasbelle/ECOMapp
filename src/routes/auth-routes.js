const express = require('express');
const router = express.Router();
const {login, register, me, refresh, logout, forget} = require('../controllers/auth-controller');
const {authenticateToken} = require('../middleware/auth-middleware');
const { body } = require('express-validator');
const ROLES = require('../enums/role-enum');

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
    body('role', 'Invalid role').trim().optional().escape().isInt().toInt().isIn([ROLES.USER, ROLES.SELLER]),
    register
);
router.get('/auth/me', authenticateToken, me);

router.get('/auth/refresh', refresh);

router.get('/auth/logout', logout);

router.post('/auth/forget', body('email', 'Invalid email').trim().escape().isEmail(), forget);

module.exports = router;
