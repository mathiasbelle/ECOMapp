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
    console.log(id);
    try {
        const cart = await cartService.get(id);
        res.json(cart);
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
            res.json(cart);            
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).send({error: 'Error when updating cart'});
    }
}

exports.delete = async (req, res, next) => {
    //const result = validationResult(req);
    //if (result) {
        //const id = req.params.id;
        try {
            await cartService.delete(req.user.id);
            return res.sendStatus(204);
        } catch (error) {
            next(error);
        }        
    //} else {
        //res.status(400).send({error: 'Error when deleting cart'});
    //}
}

exports.deleteProduct = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const productId = req.params.id;
        try {
            const cart = await cartService.deleteProduct(req.user.id, productId);
            console.log(cart);
            res.json(cart);
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).send({error: 'Error when deleting cart'});
    }
}