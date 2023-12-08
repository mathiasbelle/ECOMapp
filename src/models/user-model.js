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
        validate(value) {
            if ( !validator.isEmail(value) ) {
                throw new Error('Invalid email.');
            }
        }
    },
    password: {
        type: String,
        require: true,
        minLength: 6,
        trim: true,
    }
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);