const express = require("express");
const router = express.Router();
const userController = require('./../user/user-controller');
const {body, param} = require('express-validator');
const mongoose = require("mongoose");


router.post(
    '/users',
    body('name').trim().notEmpty().escape(),
    body('email').trim().isEmail(),
    body('password').trim().notEmpty().escape(),
    userController.create
);

router.get("/users", userController.getAll);

router.get(
    '/users/:id',
    param('id').isMongoId(),
    userController.getOne
);

router.put(
    '/users/:id',
    param('id').isMongoId(),
    body('name').trim().notEmpty().escape(),
    body('email').trim().isEmail(),
    body('password').trim().notEmpty().escape(),
    userController.update
);

router.patch(
    '/users/:id',
    param('id').isMongoId(),
    body('name').optional().trim().notEmpty().escape(),
    body('email').optional().trim().isEmail(),
    body('password').optional().trim().notEmpty().escape(),
    userController.updatePartial
);

router.delete('/users/:id', param('id').isMongoId(), userController.delete);

module.exports = router;