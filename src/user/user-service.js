const User = require('./user-model');
const bcrypt = require('bcrypt');
// TODO

exports.create = async (data) => {
    if (
        await User.exists({email: data.email})
    ) {
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
        console.log(newUser);
        return newUser;
    } catch (error) {
        throw new Error('Error when saving new user.');
    }
    

};

exports.getOne = async (id) => {
    try {
        const user = await User.findById(id);
        if (user) {
            return user;
        } else {
            throw new Error('User not found.');
        }
    } catch (error) {
        throw new Error('User not found.');
    }
    

};

exports.getAll = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        throw new Error('Error when finding users.');
    }
    
};

exports.update = async (id, data) => {
    try {
    } catch (error) {
        const user = await User.findByIdAndUpdate(id, {
            name: data.name,
            email: data.email,
            password: data.password,
        }, {new: true});
        if (user) {
            return user;
        } else {
            throw new Error('User not found.');
        }        
    }
    

};

exports.updatePartial = async (req, res) => {

};

exports.delete = async (id) => {
    if (
        await User.exists(id)
    ) {
        throw new Error('User not found.');
    } else {
        try {
            await User.findByIdAndDelete(id);
            return true;
        } catch (error) {
            throw new Error('Error when deleting user');
        }
        
    }

    

};