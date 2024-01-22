const Cart = require('./cart-model');
const Product = require('../product/product-model');

exports.get = async (id) => {
    try {
        const cart = await Cart.findOne({owner: id});
        if (cart && cart.products.length > 0) {
            return cart;
        } else {
            return null;
        }
    } catch (error) {
        return false;
    }
}

exports.create = async (data) => {
    try {
        let cart = await Cart.findOne({owner: data.user.id});
        console.log(cart);
        if (!cart) {
            const newCart = new Cart({
                owner: data.user.id,
                products: [{
                    productId: data.id,
                    quantity: data.quantity,
                    price: data.price
                }],
                bill: data.price
            });
            await newCart.save();
            return newCart;
        } else {
            return cart;
        }
    } catch (error) {
        return false;   
    }
}

