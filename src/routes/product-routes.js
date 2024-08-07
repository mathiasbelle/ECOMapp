const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');

const {authenticateToken} = require('../middleware/auth-middleware');
const authenticateProductOwner = require('../middleware/product-owner-auth-middleware').authenticateProductOwner;
const {
    createProduct,
    updatePartialProduct,
    getOneProduct,
    getAllProducts,
    deleteProduct,
    getSellerProducts,
} = require('../controllers/product-controller');
const { authenticateSeller } = require('../middleware/authenticate-seller-middleware');
const multer = require('multer');
const upload = multer({
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type.'));
        }
    },
});

router.post(
    '/products',
    upload.array('productImages', 5),
    body('name').trim().escape().notEmpty().isString(),
    body('price').trim().escape().notEmpty().isFloat({min: 0.01}),
    body('quantity').trim().escape().notEmpty().isInt({min: 1}),
    body('category').trim().escape().notEmpty(),
    body('description').trim().escape(),
    authenticateToken,
    authenticateSeller,
    createProduct
);
router.get(
    '/products/:id',
    param('id').trim().escape().isMongoId().withMessage('Invalid product id.'),
    getOneProduct
);

router.get('/products', query('name').optional().trim().escape() , getAllProducts);

router.get('/my-products', authenticateToken, authenticateSeller, getSellerProducts);

router.put(
    '/products/:id',
    param('id', 'Invalid product id.').trim().escape().isMongoId(),
    body('name', 'Name is required.').trim().escape().notEmpty().isString(),
    body('price', 'Invalid price.').trim().escape().notEmpty().isNumeric(),
    body('quantity', 'Invalid quantity.').trim().escape().notEmpty().isInt({ min: 1 }),
    body('category', 'Invalid category.').trim().escape().notEmpty().isString(),
    body('description', 'Description is required.').trim().escape(),
    authenticateToken,
    authenticateSeller,
    authenticateProductOwner,
    updatePartialProduct
);
router.patch(
    '/products/:id',
    param('id', 'Invalid product id.').trim().escape().isMongoId(),
    body('name', 'Name is required.').optional().trim().escape().notEmpty().isString(),
    body('price', 'Invalid price.').optional().trim().escape().notEmpty().isNumeric(),
    body('quantity', 'Invalid quantity.').optional().trim().escape().notEmpty().isInt(),
    body('category', 'Invalid category.').optional().trim().escape().notEmpty().isString(),
    body('description', 'Description is required.').optional().trim().escape(),
    authenticateToken,
    authenticateSeller,
    authenticateProductOwner,
    updatePartialProduct
);
router.delete(
    '/products/:id',
    param('id', 'Invalid product id.').trim().escape().isMongoId(),
    authenticateToken,
    authenticateSeller,
    authenticateProductOwner,
    deleteProduct
);

module.exports = router;