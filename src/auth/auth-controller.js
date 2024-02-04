const express = require('express');
const authService = require('./auth-service');
const { validationResult, matchedData } = require('express-validator');

exports.login = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const {email, password} = matchedData(req);
        try {
            const user = await authService.login(email, password);
            res.send(user);
        } catch (error) {
            error.status = 401;
            next(error);
        }
    } else {
        res.status(401).send({error: 'Email or password incorrect.'});
    }  
}

exports.register = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const data = matchedData(req);
        try {
            const user = await authService.register(data);
            res.send(user);
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).send({'error': 'Email is already in use.'});
    }
}

exports.me = async (req, res) => {
    res.send(req.user);
}