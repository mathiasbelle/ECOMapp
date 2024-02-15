const userService = require('../services/user-service')
const { matchedData, validationResult } = require('express-validator');

exports.createUser = async (req, res, next) => {
    const result = validationResult(req);
    //console.log(result);
    if ( result.isEmpty() ) {
        try {
            const data = matchedData(req);
            //console.log(data);
            const user = await userService.create(data);
            res.json(user);
        } catch (error) {
            next(error);
        }
    } else {
        res.send(result.array({onlyFirstError: true}));
    }
};

exports.getOneUser = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const id = req.params.id;
        //console.log(id);
        try {
            const result = await userService.getOne(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    } else {
        res.send(result.array({ onlyFirstError: true }));
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        res.json(await userService.getAll());
    } catch (error) {
        next(error);
    }
    
    
};

exports.updateUser = async (req, res, next) => {
    const result = validationResult(req);
    //console.log(result);
    if ( result.isEmpty() ) {
        const data = matchedData(req);
        try {
            res.json(await userService.update(data.id, data));
        } catch (error) {
            next(error);
        }
        
    } else {
        res.send(result.array({onlyFirstError: true}));
    }
    

};

exports.updatePartialUser = async (req, res) => {

};

exports.deleteUser = async (req, res, next) => {
    const result = validationResult(req);
    if ( result.isEmpty() ) {
        const id = req.params.id;
        try {
            await userService.delete(id)
            res.sendStatus(204);    
        } catch (error) {
            next(error)
        }
    } else {
        res.send(result.array({onlyFirstError: true}));
    }

};