const mongoose = require('mongoose');
const { type } = require('os');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
    },

    email : {
        type : String,
    },

    age : {
        type : Number,
    },

    hobbies : {
        type : String
    },

    password : {
        type : String
    }
})

module.exports = mongoose.model('users', userSchema)