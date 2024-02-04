const express = require('express');
const userService = require('./user-service')
const { matchedData, validationResult } = require('express-validator');

exports.create = async (req, res, next) => {
    
    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    const result = validationResult(req);
    //console.log(result);
    if ( result.isEmpty() ) {
        try {
            //const user = await userService.create({name, email, password});    
            const data = matchedData(req);
            console.log(data);
            const user = await userService.create(data);
            res.send(user);
        } catch (error) {
            //console.log(error.message);
            //error.message = 'Could not save user.';
            next(error);
        }
    } else {
        res.send(result.array({onlyFirstError: true}));
    }
    // console.log(result);
    // const user = await userService.create({name, email, password});
    // if ( !user ) {
    //     res.status(500).send({'error': 'Email is already in use.'});
    // } else {
    //     res.send(user);
    // }

};

exports.getOne = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const id = req.params.id;
        console.log(id);
        try {
            const result = await userService.getOne(id);
            res.send(result);
        } catch (error) {
            next(error);
        }
    } else {
        res.send(result.array({ onlyFirstError: true }));
    }
};

exports.getAll = async (req, res, next) => {
    try {
        res.send(await userService.getAll());
    } catch (error) {
        next(error);
    }
    
    
};

exports.update = async (req, res, next) => {
    const result = validationResult(req);
    //console.log(result);
    if ( result.isEmpty() ) {
        const data = matchedData(req);
        try {
            res.send(await userService.update(data.id, data));
        } catch (error) {
            next(error);
        }
        
    } else {
        res.send(result.array({onlyFirstError: true}));
    }
    

};

exports.updatePartial = async (req, res) => {

};

exports.delete = async (req, res, next) => {
    const result = validationResult(req);
    if ( result.isEmpty() ) {
        const id = req.params.id;
        try {
            res.send(await userService.delete(id));    
        } catch (error) {
            next(error)
        }
        
    } else {
        res.send(result.array({onlyFirstError: true}));
    }

};