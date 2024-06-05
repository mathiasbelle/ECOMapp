const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
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
        required: true,
        minLength: 6,
        trim: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'seller'],
        default: 'user',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    refreshTokens: [String],
}, {timestamps: true});


const User = mongoose.model('User', userSchema); 
module.exports = User;