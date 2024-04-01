const userService = require('../services/user-service')
const { matchedData, validationResult } = require('express-validator');

exports.createUser = async (req, res, next) => {
    const result = validationResult(req);
    if ( result.isEmpty() ) {
        try {
            const data = matchedData(req);
            const user = await userService.createUser(data);
            res.json(user);
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({error: result.array({onlyFirstError: true})});
    }
};

exports.getOneUser = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const id = req.params.id;
        try {
            const result = await userService.getOneUser(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({error: result.array({ onlyFirstError: true })});
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        res.json(await userService.getAllUsers());
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    const result = validationResult(req);
    if ( result.isEmpty() ) {
        const id = req.params.id;
        const data = matchedData(req, {locations: ['body']});
        try {
            res.json(await userService.updateUser(id, data));
        } catch (error) {
            next(error);
        }
        
    } else {
        res.status(400).json({error: result.array({onlyFirstError: true})});
    }
};

exports.updatePartialUser = async (req, res, next) => {
    const result = validationResult(req);
    if ( result.isEmpty() ) {
        const id = req.params.id;
        const data = matchedData(req, {locations: ['body']});
        try {
            res.json(await userService.updatePartialUser(id, data));
        } catch (error) {
            next(error);
        }
        
    } else {
        res.status(400).json({error: result.array({onlyFirstError: true})});
    }
};

exports.deleteUser = async (req, res, next) => {
    const result = validationResult(req);
    if ( result.isEmpty() ) {
        const id = req.params.id;
        try {
            await userService.deleteUser(id)
            res.sendStatus(204);    
        } catch (error) {
            next(error)
        }
    } else {
        res.status(400).json({error: result.array({onlyFirstError: true})});
    }

};