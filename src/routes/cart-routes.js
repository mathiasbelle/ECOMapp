const express = require('express');
const router = express.Router();
const {
    createCart,
    updateCart,
    getCart,
    deleteCart,
    deleteProductInCart,
} = require('../controllers/cart-controller');
const {authenticateToken} = require('../middleware/auth-middleware');
const { body, param } = require('express-validator');

router.get('/cart', authenticateToken, getCart);
router.post(
    '/cart',
    body('productId').trim().escape().notEmpty().isMongoId(),
    body('quantity').trim().escape().notEmpty().isInt({min: 1}),
    authenticateToken,
    createCart
);
router.patch(
    '/cart',
    body('productId').trim().escape().notEmpty().isMongoId(),
    body('quantity').trim().escape().isInt({min: 1}),
    authenticateToken,
    updateCart
);
router.delete(
    '/cart',
    authenticateToken,
    deleteCart
);
router.delete(
    '/cart/:id',
    param('id').trim().notEmpty().isMongoId(),
    authenticateToken,
    deleteProductInCart
);
module.exports = router;