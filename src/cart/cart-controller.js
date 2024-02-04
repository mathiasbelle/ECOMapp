const cartService = require('./cart-service');
const { validationResult, matchedData } = require('express-validator');

exports.create = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const data = matchedData(req);
        data.user = req.user;
        try {
            const cart = await cartService.create(data);
            res.send(cart);
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).send({error: 'Error when creating cart'});
    }
}

exports.get = async (req, res, next) => {
    const id = req.user.id;
    try {
        const cart = cartService.get(id);
        res.send(cart);
    } catch (error) {
        next(error);
    }

}

exports.update = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const data = matchedData(req);
        data.user = req.user;
        try {
            const cart = await cartService.update(data);
            return cart;            
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).send({error: 'Error when updating cart'});
    }
}

exports.delete = async (req, res, next) => {
    const result = validationResult();
    if (result) {
        const id = req.params.id;
        try {
            const cart = await cartService.delete(id);
            return cart;
        } catch (error) {
            next(error);
        }        
    } else {
        res.status(400).send({error: 'Error when deleting cart'});
    }
}