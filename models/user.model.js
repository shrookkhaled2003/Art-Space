const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true,
        set: value => value.charAt(0).toUpperCase() + value.slice(1)
    },
    email:{
        type:String,
        required:true,
        unique: true,
        validate: [validator.isEmail,'invalid Email Address']
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    isVerified: { 
        type: Boolean,
         default: false }
});
module.exports = mongoose.model('User', userSchema)
