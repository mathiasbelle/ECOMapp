const Cart = require('./cart-model');
const Product = require('../product/product-model');

exports.get = async (id) => {
    try {
        const cart = await Cart.findOne({owner: id});
        if (cart && cart.products.length > 0) {
            return cart;
        } else {
            throw new Error('Cart not found');
        }
    } catch (error) {
        throw new Error('Error when getting cart');
    }
}

exports.create = async (data) => {
    try {
        const product = await Product.findById(data.productId);
        if (!product) {
            const error = new Error('Product does not exist.');
            error.status = 404;
            throw error;
        }
        let cart = await Cart.findOne({ owner: data.user.id });
        console.log(cart);
        if (!cart) {
            const newCart = new Cart({
                owner: data.user.id,
                products: [{
                    productId: data.productId,
                    quantity: data.quantity,
                    price: product.price
                }],
                bill: product.price * data.quantity
            });
            await newCart.save();
            return newCart;
        } else {
            return await this.update(data);
        }
    } catch (error) {
        error.message = 'Error when creating cart.';
        error.status = 400;
    }
}

exports.update = async (data) => {
    try {
        const product = await Product.findById(data.productId);

        if (!product){
             throw new Error('Product does not exist.');
        }

        const cart = await Cart.findOne({owner: data.user.id});

        if (!cart) {
            return await this.create(data);
        }

        const productInCart = cart.products.findIndex((product) => product.productId == data.productId);

        if (productInCart > -1) {
            cart.products[productInCart].quantity += Number(data.quantity);
        } else {
            cart.products.push({
                productId: data.productId,
                quantity: data.quantity,
                price: product.price
            });
        }
        cart.bill += product.price * data.quantity;
        // const cart = await Cart.findOneAndUpdate({owner: data.user.id}, {
        //     '$push': {
        //         'products': [{
        //             productId: data.id,
        //             quantity: data.quantity,
        //             price: data.price
        //         }]
        //     },
        //     '$inc': {
        //         bill: data.price * data.quantity
        //     }
        // }, {new: true});
        await cart.save();
        console.log(cart);
        return cart;
    } catch (error) {
        console.log(error);
        throw new Error('Error when updating cart.');
    }
}

exports.delete = async (id) => {
    try {
        const cart = await Cart.findByIdAndDelete(id);
        console.log(cart);
        return cart;
    } catch (error) {
        console.log(error);
        return false;
        
    }
}
