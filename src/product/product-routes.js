const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth-middleware').authenticateToken;
const productController = require('../product/product-controller');

router.post('/products', authenticateToken, productController.create );
router.get('/products/:id', authenticateToken, productController.getOne );
router.get('/products', authenticateToken, productController.getAll );
router.put('/products/:id', authenticateToken, productController.update );
router.patch('/products/:id', authenticateToken, productController.updatePartial );
router.delete('/products/:id', authenticateToken, productController.delete );

module.exports = router;