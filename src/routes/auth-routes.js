const express = require('express');
const router = express.Router();
const {login, register, me} = require('../controllers/auth-controller');
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
    body('name', 'Name is required.').trim().notEmpty().escape(),
    body('email', 'Invalid email').trim().isEmail(),
    body('password', 'Invalid password').trim().notEmpty().escape(),
    register
);
router.post('/auth/me', authenticateToken, me);


module.exports = router;
