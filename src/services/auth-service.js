const jwt = require('jsonwebtoken');
const userService = require('./user-service');
const bcrypt = require('bcrypt');
const User = require('../models/user-model');

function createAccessToken(user) {
    return {
        accessToken: jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email
            },
                process.env.JWT_SECRET,
            {
                expiresIn: '10s',
                subject: String(user.id),
                issuer: 'login',
                audience: 'users'
            },
        ),
    };
}

function createRefreshToken(user) {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '7d',
            subject: String(user.id),
            issuer: 'login',
            audience: 'users'
        }
    );
}

exports.login = async (email, password) => {
    try {
        const user = await User.findOne({ email: email }).exec();
        let result = await bcrypt.compare(password, user.password);
        if (!user || !result) {
            const error = new Error('Email or password incorrect.');
            throw error;
        } else {
            const accessToken = createAccessToken(user);
            const refreshToken = createRefreshToken(user);
            user.refreshTokens.push(refreshToken);
            await user.save();
            return {accessToken, refreshToken};
        }
    } catch (error) {
        throw new Error('Email or password incorrect.');
    }
    
}

exports.register = async (data) => {
    try {
        const newUser = await userService.createUser(data); 
        const accessToken = createAccessToken(newUser);
        const refreshToken = createRefreshToken(newUser);
        const user = await User.findById(newUser.id).exec();
        user.refreshTokens.push(refreshToken);
        await user.save();
        return {accessToken, refreshToken};
    } catch (error) {
        console.error(error.message);
        throw new Error(error.message);
    }
}

exports.refresh = (token) => {
    //console.log(`REFRESH TOKEN SEND FROM CLIENT: ${token}`);
    try {
        const result = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, {
            audience: 'users',
            issuer: 'login'
        });
        //console.log(result);
        return createAccessToken(result);
    } catch (error) {
        throw new Error('Unauthorized');
    }
}

exports.logout = async (email, refreshToken) => {
    try {
        const user = await User.findOne({email: email}).exec();
        let index = user.refreshTokens.indexOf(refreshToken);
        if (index !== -1) {
            user.refreshTokens.splice(index, 1);
            await user.save();
        }
        return true;
    } catch (error) {
        console.error(error);
    }
}