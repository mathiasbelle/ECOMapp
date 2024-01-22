const express = require("express");
const router = express.Router();
const cartController = require('./cart-controller');
const authenticateToken = require('../middleware/auth-middleware').authenticateToken;

router.post('/cart/create', authenticateToken, cartController.create);

module.exports = router;