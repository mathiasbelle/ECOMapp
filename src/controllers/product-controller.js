const productService = require('../services/product-service');
const { matchedData, validationResult } = require('express-validator');

exports.createProduct = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const data = matchedData(req);
        data.owner = req.user._id;
        data.files = req.files;
        console.log(data.file);
        //console.log(data);
        try {
            const product = await productService.createProduct(data);
            res.send(product);
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({error: result.array({onlyFirstError: true})});
    }
}

exports.getOneProduct = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const id = req.params.id;
        try {
            const product = await productService.getOneProduct(id);
            res.json(product);
        } catch (error) {
            error.status = 404;
            next(error);
        }
    } else {
        res.status(404).json({error: result.array({onlyFirstError: true})});
    }
}


// If there's a query, need to use it to filter the products
exports.getAllProducts = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const name = req.query.name;
        try {
            const products = await productService.getAllProducts(name);
            res.json(products);
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({error: result.array({onlyFirstError: true})});
    }
    // try {
    //     res.send(await productService.getAllProducts());
    // } catch (error) {
    //     next(error);
    // }
}

exports.getSellerProducts = async (req, res, next) => {
    const id = req.user._id;
    try {
        const products = await productService.getProductsByUser(id);
        res.json(products);
    } catch (error) {
        next(error);
    }
};

exports.updatePartialProduct = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const id = req.params.id;
        const data = matchedData(req, {locations: ['body']});
        try {
            const product = await productService.updateProduct(id, data);
            res.send(product);
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({error: result.array({onlyFirstError: true})});
    }
}

exports.deleteProduct = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const id = req.params.id;
        try {
            await productService.deleteProduct(id);
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({error: result.array({onlyFirstError: true})});
    }
}