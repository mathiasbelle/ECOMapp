const authService = require('../services/auth-service');
const { validationResult, matchedData } = require('express-validator');

exports.login = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const {email, password} = matchedData(req);
        try {
            const user = await authService.login(email, password);
            res.json(user);
        } catch (error) {
            error.status = 401;
            next(error);
        }
    } else {
        res.status(401).json({error: result.array({onlyFirstError: true})});
    }  
}

exports.register = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const data = matchedData(req);
        try {
            const user = await authService.register(data);
            res.json(user);
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({error: result.array({onlyFirstError: true})});
    }
}

exports.me = async (req, res) => {
    res.json(req.user);
}