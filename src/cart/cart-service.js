const Cart = require('./cart-model');
const Product = require('../product/product-model');
const notFoundError = require('../errors/not-found-error');

exports.get = async (id) => {
    try {
        const cart = await Cart.findOne({owner: id});
        if (cart && cart.products.length > 0) {
            return cart;
        } else {
            throw notFoundError('Cart not found');
        }
    } catch (error) {
        throw new Error('Error when getting cart');
    }
}

exports.create = async (data) => {
    try {
        const product = await Product.findById(data.productId);
        if (!product) {
            throw notFoundError('Product does not exist.');
        }
        if (product.quantity < data.quantity) {
            throw new Error('Product is sold out.');
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
            product.quantity -= data.quantity;
            await product.save();
            return newCart;
        } else {
            return await this.update(data);
        }
    } catch (error) {
        error.message ||= 'Error when creating cart.';
        error.status = 400;
        throw error;
    }
}

exports.update = async (data) => {
    try {
        const product = await Product.findById(data.productId);

        if (!product){
             throw new Error('Product does not exist.');
        }
        if (product.quantity < data.quantity) {
            throw new Error('Product is sold out.');
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
        product.quantity -= data.quantity;
        await product.save();
        console.log(cart);
        return cart;
    } catch (error) {
        console.log(error);
        error.message ||= 'Error when updating cart.'; 
        throw error;
    }
}

exports.delete = async (ownerId) => {
    try {
        const cart = await Cart.findOneAndDelete({owner: ownerId});
        console.log(cart);
        return cart;
    } catch (error) {
        console.log(error);
        return false;
        
    }
}

exports.deleteProduct = async (userId, productId) => {
    try {
        const cart = await Cart.findOne({owner: userId});
        console.log(cart.products[0].productId.toString() == productId);

        const index = cart.products.findIndex((product) => product.productId.toString() == productId);
        if (index > -1) {
            cart.bill -= cart.products[index].price * cart.products[index].quantity;
            cart.products.splice(index, 1);
            console.log(cart.products);
            await cart.save();
            return cart;
        } else {
            throw notFoundError('Product not in cart');
        }
    } catch (error) {
        error.message ||= 'Error when deleting product from cart.'
        throw error;
    }
}