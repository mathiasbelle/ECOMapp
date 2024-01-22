const express = require('express');
const userService = require('./user-service')

exports.create = async (req, res) => {
    
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const user = await userService.create({name, email, password});
    if ( !user ) {
        res.status(500).send({'error': 'Email is already in use.'});
    } else {
        res.send(user);
    }

};

exports.getOne = async (req, res) => {
    const id = req.params.id;
    
    res.send( await userService.getOne(id));

};

exports.getAll = async (req, res) => {
    res.send(await userService.getAll());
    
};

exports.update = async (req, res) => {
    const id = req.params.id;
    // console.log(id);
    const data =  {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }
    res.send(await userService.update(id, data));

};

exports.updatePartial = async (req, res) => {

};

exports.delete = async (req, res) => {
    const id = req.params.id;
    res.send(await userService.delete(id));

};