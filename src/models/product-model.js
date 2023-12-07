const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    description: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model("Product", productSchema);