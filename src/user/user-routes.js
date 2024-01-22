const express = require("express");
const router = express.Router();
const userController = require('./../user/user-controller');


router.post('/users', userController.create);

router.get("/users", userController.getAll);

router.get('/users/:id', userController.getOne);

router.put('/users/:id', userController.update);

router.patch('/users/:id', userController.updatePartial);

router.delete('/users/:id', userController.delete);

module.exports = router;