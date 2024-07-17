const notFoundError = require('../errors/not-found-error');
const User = require('../models/user-model');
const Product = require('../models/product-model');
const bcrypt = require('bcrypt');

exports.createUser = async (data) => {
    
    try {
        const [emailExists, usernameExists] = await Promise.all([
            User.exists({ email: data.email }),
            User.exists({ username: data.username })
        ]);

        if (emailExists) {
            throw new Error('Email is already in use.');
        }
        if (usernameExists) {
            throw new Error('Username is already in use.');
        }
        
        data.password = await bcrypt.hash(data.password, 10);
        const newUser = new User({
            username: data.username,
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role
        });

        await newUser.save();
        return {
            id: newUser.id,
            username: newUser.username,
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        };
    } catch (error) {
        console.error(error);
        
        throw new Error(error.message || 'Error when saving new user.');
    }
    

};

exports.getOneUser = async (id) => {
    try {
        const user = await User.findById(id, '-password -__v -refreshTokens').lean();
        if (!user) {
            throw notFoundError('User does not exist.');
        }
        return user;
    } catch (error) {
        throw new Error('Error when getting user');
    }
    

};

exports.getAllUsers = async () => {
    try {
        const users = await User.find({}, '-password -__v');
        return users;
    } catch (error) {
        throw new Error('Error when finding users.');
    }
    
};

exports.updateUser = async (id, data) => {
    const updatableFields = ['name', 'email', 'password'];
    try {
        const user = await User.findById(id);
        
        if (!user) {
            throw notFoundError('User does not exist.');
        }
        data.password = await bcrypt.hash(data.password, 10);
        for (let [key, value] of Object.entries(data)) {
            if (value !== undefined && updatableFields.includes(key)) {
                user[key] = value;
            }
        }
        await user.save();
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

    } catch (error) {
        throw new Error('Error when updating user.');
    }
};

exports.updatePartialUser = async (id, data) => {
    const updatableFields = ['name', 'email', 'password'];
    try {
        const user = await User.findById(id);
        if(!user) {
            throw notFoundError('User does not exist.');
        }
        if (data.password !== undefined) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        for (let [key, value] of Object.entries(data)) {
            if (value !== undefined && updatableFields.includes(key)) {
                user[key] = value;
            }
        }
        await user.save();
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }; 
    } catch (error) {
        throw new Error('Error when updating user.');
    }
};

exports.deleteUser = async (id) => {
    if (!await User.exists({_id: id})) {
        throw notFoundError('User not found.');
    } else {
        try {
            const user = await User.findById(id);
            console.log(user);
            await Product.deleteMany({owner: user._id});
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