const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');

const authenticateToken = require('../middleware/auth-middleware').authenticateToken;
const authenticateProductOwner = require('../middleware/product-owner-auth-middleware').authenticateProductOwner;
const productController = require('../product/product-controller');

router.post(
    '/products',
    body('owner').trim().escape().notEmpty().isMongoId(),
    body('name').trim().escape().notEmpty().isString(),
    body('price').trim().escape().notEmpty().isFloat({min: 0.01}),
    body('quantity').trim().escape().notEmpty().isInt({min: 1}),
    body('category').trim().escape().notEmpty(),
    body('description').trim().escape(),
    authenticateToken,
    productController.create
);
router.get(
    '/products/:id',
    param('id').trim().escape().isMongoId(),
    authenticateToken,
    productController.getOne
);
router.get('/products', authenticateToken, productController.getAll );
router.put(
    '/products/:id',
    param('id').trim().escape().isMongoId(),
    body('owner').trim().escape().isMongoId(),
    body('name').trim().escape().notEmpty().isString(),
    body('price').trim().escape().notEmpty().isNumeric(),
    body('quantity').trim().escape().notEmpty().isInt(),
    body('category').trim().escape().notEmpty().isString(),
    body('description').trim().escape(),
    authenticateToken,
    authenticateProductOwner,
    productController.update
);
router.patch(
    '/products/:id',
    param('id').trim().escape().isMongoId(),
    body('owner').optional().trim().escape().isMongoId(),
    body('name').optional().trim().escape().notEmpty().isString(),
    body('price').optional().trim().escape().notEmpty().isNumeric(),
    body('quantity').optional().trim().escape().notEmpty().isInt(),
    body('category').optional().trim().escape().notEmpty().isString(),
    body('description').optional().trim().escape(),
    authenticateToken,
    authenticateProductOwner,
    productController.updatePartial
);
router.delete(
    '/products/:id',
    param('id').trim().escape().isMongoId(),
    authenticateToken,
    authenticateProductOwner,
    productController.delete
);

module.exports = router;