const jwt = require('jsonwebtoken');
const userService = require('./user-service');
const bcrypt = require('bcrypt');
const User = require('../models/user-model');

function createToken(user) {
    return {
        accessToken: jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email
            },
                process.env.JWT_SECRET,
            {
                expiresIn: '2 days',
                subject: String(user.id),
                issuer: 'login',
                audience: 'users'
            },
        ),
    };
}

exports.login = async (email, password) => {
    try {
        const user = await User.findOne({ email: email }).exec();
        let result = await bcrypt.compare(password, user.password);
        if (!user || !result) {
            const error = new Error('Email or password incorrect.');
            throw error;
        } else {
            return createToken(user);
        }
    } catch (error) {
        throw new Error('Email or password incorrect.');
    }
    
}

exports.register = async (data) => {
    try {
        const user = await userService.createUser(data);    
        return createToken(user);
    } catch (error) {
        throw new Error('Could not create new user.');
    }
}