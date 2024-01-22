const express = require('express');
const authService = require('./auth-service');

exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await authService.login(email, password);
    if (!user) {
        res.status(401).send({'error': 'Email ou senha incorretos'});
    } else {
        res.send(user);
    }
       
}

exports.register = async (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    
    const user = await authService.register(data);

    if ( !user ) {
        res.status(500).send({'error': 'Email is already in use.'});
        return;
    } else {
        res.send(user);
    }
}

exports.me = async (req, res) => {
    res.send(req.user);
}