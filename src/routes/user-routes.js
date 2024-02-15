const express = require('express');
const router = express.Router();
const {
    createUser,
    getOneUser,
    getAllUsers,
    updateUser,
    updatePartialUser,
    deleteUser,
} = require('../controllers/user-controller');
const {body, param} = require('express-validator');

router.post(
    '/users',
    body('name').trim().notEmpty().escape(),
    body('email').trim().isEmail(),
    body('password').trim().notEmpty().escape(),
    createUser
);

router.get('/users', getAllUsers);

router.get(
    '/users/:id',
    param('id').isMongoId(),
    getOneUser
);

router.put(
    '/users/:id',
    param('id').isMongoId(),
    body('name').trim().notEmpty().escape(),
    body('email').trim().isEmail(),
    body('password').trim().notEmpty().escape(),
    updateUser
);

router.patch(
    '/users/:id',
    param('id').isMongoId(),
    body('name').optional().trim().notEmpty().escape(),
    body('email').optional().trim().isEmail(),
    body('password').optional().trim().notEmpty().escape(),
    updatePartialUser
);

router.delete('/users/:id', param('id').isMongoId(), deleteUser);

module.exports = router;