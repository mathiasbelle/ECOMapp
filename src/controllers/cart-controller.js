const cartService = require('../services/cart-service');
const { validationResult, matchedData } = require('express-validator');

exports.createCart = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const data = matchedData(req);
        data.user = req.user;
        try {
            const cart = await cartService.createCart(data);
            res.send(cart);
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({error: result.array({onlyFirstError: true})});
    }
}

exports.getCart = async (req, res, next) => {
    const id = req.user.id;
    try {
        const cart = await cartService.getCart(id);
        res.json(cart);
    } catch (error) {
        next(error);
    }

}

exports.updateCart = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const data = matchedData(req);
        data.user = req.user;
        try {
            const cart = await cartService.updateCart(data);
            res.json(cart);            
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({error: result.array({onlyFirstError: true})});
    }
}

exports.deleteCart = async (req, res, next) => {
        try {
            await cartService.deleteCart(req.user.id);
            return res.sendStatus(204);
        } catch (error) {
            next(error);
        }        

}

exports.deleteProductInCart = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const productId = req.params.id;
        try {
            const cart = await cartService.deleteProductFromCat(req.user.id, productId);
            console.log(cart);
            res.json(cart);
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({error: result.array({onlyFirstError: true})});
    }
}