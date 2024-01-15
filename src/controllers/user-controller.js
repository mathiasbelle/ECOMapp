const express = require('express');
const User = require('./../models/user-model');
const bcrypt = require('bcrypt');
// TODO

exports.create = async (req, res) => {
    //console.log(req);
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
    

};

exports.getOne = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    
    res.send(user);

};

exports.getAll = async (req, res) => {
    const users = await User.find();
    res.send(users);
    
};

exports.update = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const user = await User.updateOne({id}, {
        anme: req.body.name,
        email: req.body.email,
        password: req.body.password,
    })
    res.send(user);

};

exports.updatePartial = async (req, res) => {

};

exports.delete = async (req, res) => {
    const id = req.params.id;
    await User.deleteOne({_id: id});
    res.send(true);

};