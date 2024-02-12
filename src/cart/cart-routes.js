const express = require('express');
const router = express.Router();
const cartController = require('./cart-controller');
const authenticateToken = require('../middleware/auth-middleware').authenticateToken;
const { body, param } = require('express-validator');
//const { authenticateCartOwner } = require("../middleware/cart-owner-middleware");

router.get('/cart', authenticateToken, cartController.get);
router.post(
    '/cart',
    body('productId').trim().escape().notEmpty().isMongoId(),
    body('quantity').trim().escape().notEmpty().isInt({min: 1}),
    //body('price').trim().escape().notEmpty().isNumeric(),
    authenticateToken,
    cartController.create
);
router.patch(
    '/cart',
    body('productId').trim().escape().notEmpty().isMongoId(),
    body('quantity').trim().escape().isInt({min: 1}),
    authenticateToken,
    cartController.update
);
router.delete(
    '/cart',
    authenticateToken,
    cartController.delete
);
router.delete(
    '/cart/:id',
    param('id').trim().notEmpty().isMongoId(),
    authenticateToken,
    cartController.deleteProduct
);
module.exports = router;