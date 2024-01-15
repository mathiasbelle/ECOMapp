const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./../models/user-model');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

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

exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({email: email}).exec();
    console.log(user);

    if (!user) {
        res.status(401).send({'error': 'Email ou senha incorretos'});

    } else if (!(await bcrypt.compare(password, user.password))) {
        res.status(401).send({'error': 'Email ou senha incorretos'});

    } else {
        res.send(createToken(user));
    }   
}

exports.register = async (req, res) => {
    if (
        await User.exists({email: req.body.email})
    ) {
        res.status(500).send({'error': 'Email is already in use.'});
        return;
    }
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    // console.log(newUser);

    try {
        await newUser.save();
        console.log(newUser);
        res.send(newUser);
    } catch (error) {
        console.log('Error when saving new user.');
        console.log(error);
        res.send({'error': 'Error when saving new user.'});
    }
}