const jwt = require('jsonwebtoken');
const authService = require('../services/auth-service');
const { validationResult, matchedData } = require('express-validator');
const ROLES = require('../enums/role-enum');

exports.login = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const {email, password} = matchedData(req);
        try {
            const {accessToken, refreshToken, role} = await authService.login(email, password);
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            res.json({accessToken, role});
        } catch (error) {
            error.status = 403;
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
        if (data.role !== ROLES.USER && data.role !== ROLES.SELLER) {
            data.role = ROLES.USER;
        }
        try {
            const {accessToken, refreshToken, role} = await authService.register(data);
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            res.json({accessToken, role});
        } catch (error) {
            if (error.message === 'Email is already in use.' || error.message === 'Username is already in use.') {
                error.status = 409;
            }
            next(error);
        }
    } else {
        res.status(400).json({error: result.array({onlyFirstError: true})});
    }
}

exports.me = async (req, res) => {
    res.json(req.user);
}

exports.refresh = async (req, res) => {
    //console.log(req.cookies);
    if (req.cookies.jwt) {
        const refreshToken = req.cookies.jwt;
        try {
            const accessToken = authService.refresh(refreshToken);
            //console.log(accessToken);
            res.json({accessToken});
        } catch (error) {
            res.status(403).json({error: 'Unauthorized'});
        }
    }
}

exports.logout = async (req, res) => {
    try {
        const refreshToken = req.cookies?.jwt;
        if (!refreshToken) {
            return res.sendStatus(204);
        }
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, {
            audience: 'users',
            issuer: 'login'
        });
        await authService.logout(user.email, refreshToken);
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        });
        console.log(`Logging out user ${user.email}`);
        res.sendStatus(204);
    } catch (error) {
        res.status(403).json({error: 'Unauthorized'});
    }
}

exports.forget = async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const {email} = matchedData(req);
        await authService.forgetPassword(email);
        res.sendStatus(204);
    } else {
        res.status(400).json({error: result.array({onlyFirstError: true})});
    }
}

exports.reset = async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const {token, password} = matchedData(req);
        try {
            await authService.resetPassword(token, password);
            res.sendStatus(204);    
        } catch (error) {
            console.log(error);
            res.status(400).json({error: error.message});
        }
    } else {
        res.status(400).json({error: result.array({onlyFirstError: true})});
    }
}