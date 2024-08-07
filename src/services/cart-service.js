const Cart = require('../models/cart-model');
const Product = require('../models/product-model');
const notFoundError = require('../errors/not-found-error');


const toFixed = (n, fixed) => Number(`${n}`.match(new RegExp(`^-?\\d+(?:.\\d{0,${fixed}})?`))[0]);


exports.getCart = async (id) => {
    try {
        const cart = await Cart.findOne({owner: id}).lean();
        if (cart && cart.products.length > 0) {
            for (let i = 0; i < cart.products.length; i++) {
                const product = await Product.findById(cart.products[i].productId).lean();
                cart.products[i].name = product.name;
            }
        }
        //if (cart && cart.products.length > 0) {
            return cart;
        // } else {
        //     throw notFoundError('Cart not found');
        // }
    } catch (error) {
        throw new Error('Error when getting cart');
    }
}

exports.createCart = async (data) => {
    try {
        const product = await Product.findById(data.productId);
        if (!product) {
            throw notFoundError('Product does not exist.');
        }
        if (product.quantity < data.quantity) {
            throw new Error('Stock is not enough.');
        }
        let cart = await Cart.findOne({ owner: data.user._id });
        if (!cart) {
            const newCart = new Cart({
                owner: data.user._id,
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
            return {
                _id: newCart.id,
                owner: newCart.owner,
                products: newCart.products,
                bill: newCart.bill,
                createdAt: newCart.createdAt,
                updatedAt: newCart.updatedAt
            }
        } else {
            return await this.updateCart(data);
        }
    } catch (error) {
        error.message ||= 'Error when creating cart.';
        error.status = 400;
        throw error;
    }
}

exports.updateCart = async (data) => {
    try {
        const product = await Product.findById(data.productId);

        if (!product){
             throw new Error('Product does not exist.');
        }
        if (product.quantity < data.quantity) {
            throw new Error('Product is sold out.');
        }

        const cart = await Cart.findOne({owner: data.user._id});

        if (!cart) {
            return await this.createCart(data);
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
        cart.bill += toFixed(product.price * data.quantity, 2);
        await cart.save();
        product.quantity -= data.quantity;
        await product.save();
        return {
            _id: cart.id,
            owner: cart.owner,
            products: cart.products,
            bill: cart.bill,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt
        }
    } catch (error) {
        error.message ||= 'Error when updating cart.'; 
        throw error;
    }
}

exports.deleteCart = async (ownerId) => {
    try {
        const cart = await Cart.findOneAndDelete({owner: ownerId});
        return cart;
    } catch (error) {
        console.log(error);
        return false;     
    }
}

exports.deleteProductFromCat = async (userId, productId) => {
    try {
        const cart = await Cart.findOne({owner: userId});

        const index = cart.products.findIndex((product) => product.productId.toString() == productId);
        if (index > -1) {
            cart.bill -= cart.products[index].price * cart.products[index].quantity;
            cart.products.splice(index, 1);
            await cart.save();
            return {
                _id: cart.id,
                owner: cart.owner,
                products: cart.products,
                bill: cart.bill,
                createdAt: cart.createdAt,
                updatedAt: cart.updatedAt
            }
        } else {
            throw notFoundError('Product not in cart');
        }
    } catch (error) {
        error.message ||= 'Error when deleting product from cart.'
        throw error;
    }
}