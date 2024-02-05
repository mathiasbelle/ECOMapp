const notFoundError = require('../errors/not-found-error');
const User = require('./user-model');
const bcrypt = require('bcrypt');

exports.create = async (data) => {
    if (await User.exists({email: data.email})) {
        throw new Error('User already exists.');
    }
    data.password = await bcrypt.hash(data.password, 10);
    try {
        const newUser = new User({
            name: data.name,
            email: data.email,
            password: data.password
        });
        console.log(newUser);

        await newUser.save();
        return newUser;
    } catch (error) {
        throw new Error('Error when saving new user.');
    }
    

};

exports.getOne = async (id) => {
    await this.exists();
    try {
        const user = await User.findById(id, '-password -__v');
        return user;
    } catch (error) {
        throw new Error('Error when getting user');
    }
    

};

exports.getAll = async () => {
    try {
        const users = await User.find({}, '-password -__v');
        return users;
    } catch (error) {
        throw new Error('Error when finding users.');
    }
    
};

exports.update = async (id, data) => {
    await this.exists(id);
    try {
        const user = await User.findByIdAndUpdate(id, {
            name: data.name,
            email: data.email,
            password: data.password,
        }, {new: true});
        return user; 
    } catch (error) {
        throw new Error('Error when updating user.')
    }
    

};

exports.updatePartial = async (req, res) => {

};

exports.delete = async (id) => {
    if (await User.exists(id)) {
        throw notFoundError('User not found.');
    } else {
        try {
            await User.findByIdAndDelete(id);
            return true;
        } catch (error) {
            throw new Error('Error when deleting user');
        }
        
    }
};


exports.exists = async (id) => {
    if (await User.exists(id)) {
        return true;
    } else {
        throw notFoundError('User not found');
    }
}