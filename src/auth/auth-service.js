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
    const user = await User.findOne({email: email}).exec();
    console.log(user);

    if (!user) {
        return false;

    } else if (!(bcrypt.compare(password, user.password))) {
        return false;

    } else {
        return createToken(user);
    }   
}

exports.register = async (data) => {
    // if ( await User.exists({email}) ) {
    //     return false;
    // }
    // password = await bcrypt.hash(password, 10);
    // const newUser = new User({
    //     name: name,
    //     email: email,
    //     password: password
    // });
    // // console.log(newUser);

    // try {
    //     await newUser.save();
    //     console.log(newUser);
    //     return newUser;
    // } catch (error) {
    //     console.log('Error when saving new user.');
    //     console.log(error);
    //     return false;
    // }
    const user = await userService.create(data);
    if (!user) {
        return false;
    }

    return createToken(user);

    
}