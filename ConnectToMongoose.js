const mongoose = require('mongoose');
require('dotenv').config();
const mongoDBURL = process.env.REACT_MONGODB_URI;


const ConnectToMongooseServer = async()=>{
    const connect = await mongoose.connect(mongoDBURL);
    if(connect){
        console.log('MONGODB connected Succesfully');
    }else{
        console.log('MONGODB Connect Error!!')
    }
}

module.exports = ConnectToMongooseServer;