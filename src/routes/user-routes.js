const express = require('express');
const router = express.Router();
const {
    createUser,
    getOneUser,
    getAllUsers,
    updateUser,
    updatePartialUser,
    deleteUser,
} = require('../controllers/user-controller');
const {body, param} = require('express-validator');
const multer = require('multer');
const { mkdirSync } = require('fs');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        mkdirSync('storage/uploads', { recursive: true });
        cb(null, 'storage/uploads/')
    },
    filename: function (req, file, cb) {
        const extension = file.originalname.split('.').pop();
        const filename = `${require('crypto').randomBytes(32).toString('hex')}.${extension}`;
        req.body.avatar = filename;

        cb(null, filename);
    }
})


const upload = multer({storage});


router.post(
    '/users',
    //upload.single('avatar'),
    body('username', 'Username is required.').trim().notEmpty().escape(),
    body('name', 'Name is required.').trim().notEmpty().escape(),
    body('email', 'Invalid email').trim().isEmail(),
    body('password', 'Invalid password').trim().notEmpty().escape(),
    createUser
);

router.get('/users', getAllUsers);

router.get(
    '/users/:id',
    param('id', 'Invalid user id.').isMongoId(),
    getOneUser
);

router.put(
    '/users/:id',
    param('id', 'Invalid user id.').isMongoId(),
    body('name', 'Name is required.').trim().notEmpty().escape(),
    body('email', 'Invalid email.').trim().notEmpty().isEmail(),
    body('password', 'Invalid password.').trim().notEmpty().escape(),
    updateUser
);

router.patch(
    '/users/:id',
    param('id', 'Invalid user id.').isMongoId(),
    body('name', 'Name is required.').optional().trim().notEmpty().escape(),
    body('email', 'Invalid email.').optional().trim().isEmail(),
    body('password', 'Invalid password.').optional().trim().notEmpty().escape(),
    updatePartialUser
);

router.delete('/users/:id', param('id', 'Invalid user id.').isMongoId(), deleteUser);

module.exports = router;