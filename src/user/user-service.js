const User = require('./user-model');
const bcrypt = require('bcrypt');
// TODO

exports.create = async (data) => {
    if (
        await User.exists({email: data.email})
    ) {
        console.log('false');
        return false;
    }
    data.password = await bcrypt.hash(data.password, 10);
    const newUser = new User({
        name: data.name,
        email: data.email,
        password: data.password
    });
     console.log(newUser);

    try {
        await newUser.save();
        console.log(newUser);
        return newUser;
    } catch (error) {
        console.log('Error when saving new user.');
        console.log(error);
        return false;
    }
    

};

exports.getOne = async (id) => {
    const user = await User.findById(id);
    
    return user;

};

exports.getAll = async () => {
    const users = await User.find();
    return users;
    
};

exports.update = async (id, data) => {
    // console.log(id);
    const user = await User.updateOne({id}, {
        name: data.name,
        email: data.email,
        password: data.password,
    })
    return user;

};

exports.updatePartial = async (req, res) => {

};

exports.delete = async (id) => {
    await User.deleteOne({_id: id});
    return true;

};