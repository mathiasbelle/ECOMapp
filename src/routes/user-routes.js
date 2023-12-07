const express = require("express");
const router = express.Router();
const userController = require('./../controllers/user-controller');


router.post('/user', (req, res) => {
    userController.create(req, res);
});

router.get("/user", (req, res) => {
    userController.getAll(req, res);
});

router.get('/user/:id', (req, res) => {
    userController.getOne(req, res);
});

router.put('/user/:id', (req, res) => {
    userController.update(req, res);
});

router.patch('/user/:id', (req, res) => {
    userController.updatePartial(req, res);
});

router.delete('/user/:id', (req, res) => {
    userController.delete(req, res);
});

module.exports = router;