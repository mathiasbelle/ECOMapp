const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function(value) {
                return validator.isEmail(value);
            },
            message: props => `${props.value} is not a valid email.`
        }
    },
    password: {
        type: String,
        require: true,
        minLength: 6,
        trim: true,
    }
}, {timestamps: true});


const User = mongoose.model('User', userSchema); 
module.exports = User;