const express = require("express");
const router = express.Router();
const cartController = require('./cart-controller');
const authenticateToken = require('../middleware/auth-middleware').authenticateToken;
const { body, param } = require('express-validator');
const { authenticateCartOwner } = require("../middleware/cart-owner-middleware");

router.post(
    '/cart',
    body('productId').trim().escape().notEmpty().isMongoId(),
    body('quantity').trim().escape().notEmpty().isInt(),
    //body('price').trim().escape().notEmpty().isNumeric(),
    authenticateToken,
    cartController.create
);
router.patch(
    '/cart',
    body('quantity').trim().escape().isInt(),
    body('price').trim().escape().isNumeric(),
    authenticateToken,
    authenticateCartOwner,
    cartController.update
);
router.delete(
    '/cart/:id',
    param('id').trim().notEmpty().isMongoId(),
    authenticateToken,
    authenticateCartOwner,
    cartController.delete
);

router.get('/cart', authenticateToken, cartController.get);

module.exports = router;