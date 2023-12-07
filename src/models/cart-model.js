const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
        price: Number
    }],
    bill: {
        type: Number,
        required: true,
        default: 0
    }
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);