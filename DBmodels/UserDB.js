const mongoose = require('mongoose');
const {Schema} = require('mongoose');


const UsersDB = new Schema({
    name:{
        type:String,
        require:true
    },mobilenumber:{
        type:Number,
        require:true
    },email:{
        type:String,
        require:true
    },password:{
        type:String,
        require:true
    },verified:{
        type:Boolean,
        default:false
    },
    otp:{
        type:Number
    }
});

module.exports  = mongoose.model('userDataBase',UsersDB);