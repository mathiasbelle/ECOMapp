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
const { authenticateUser } = require('../middleware/authenticate-user-middleware');

router.get('/cart', authenticateToken, authenticateUser, getCart);
router.post(
    '/cart',
    body('productId', 'Invalid product id.').trim().escape().notEmpty().isMongoId(),
    body('quantity', 'Invalid quantity.').trim().escape().notEmpty().isInt({min: 1}),
    authenticateToken,
    authenticateUser,
    createCart
);
router.patch(
    '/cart',
    body('productId', 'Invalid product id').trim().escape().notEmpty().isMongoId(),
    body('quantity', 'Invalid quantity').trim().escape().isInt({min: 1}),
    authenticateToken,
    authenticateUser,
    updateCart
);
router.delete(
    '/cart',
    authenticateToken,
    authenticateUser,
    deleteCart
);
router.delete(
    '/cart/:id',
    param('id', 'Invalid product id').trim().notEmpty().isMongoId(),
    authenticateToken,
    authenticateUser,
    deleteProductInCart
);
module.exports = router;