const express = require('express');
const jwt = require('jsonwebtoken');
const userService = require('../user/user-service');
const bcrypt = require('bcrypt');
const User = require('../user/user-model');

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
        console.log(user);

        if (!user || !bcrypt.compare(password, user.password)) {
            throw new Error('Email or password incorrect.');
        } else {
            return createToken(user);
        }
    } catch (error) {
        throw new Error('Email or password incorrect.');
    }
    
}

exports.register = async (data) => {
    try {
        const user = await userService.create(data);    
        return createToken(user);
    } catch (error) {
        throw new Error('Could not create new user.');
    }
}