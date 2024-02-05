const productService = require('./product-service');
const { matchedData, validationResult } = require('express-validator');

exports.create = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const data = matchedData(req);
        console.log(data);
        try {
            const product = await productService.create(data);
            res.send(product);
        } catch (error) {
            next(error);
        }
    } else {
        res.send(result.array({onlyFirstError: true}));
    }
}

exports.getOne = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const id = req.params.id;
        try {
            const product = await productService.getOne(id);
            res.json(product);
        } catch (error) {
            error.status = 404;
            next(error);
        }
    } else {
        res.status(404).send({error: 'Product not found.'});
    }
}

exports.getAll = async (req, res, next) => {
    try {
        res.send(await productService.getAll());
    } catch (error) {
        next(error);
    }
}

exports.update = async (req, res) => {
    
}

exports.updatePartial = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const id = req.params.id;
        const data = matchedData(req);
        try {
            const product = await productService.updatePartial(id, data);
            res.send(product);
        } catch (error) {
            next(error);
        }
    } else {
        res.send(result.array({onlyFirstError: true}));
    }
}

exports.delete = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const id = req.params.id;
        try {
            await productService.delete(id);
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    } else {
        res.send({error: 'Product ID not found.'})
    }
}