const mongoose = require('mongoose');
 
 require('dotenv').config();

const mongo_url = process.env.MONGODB_URL;

const dbConnection = async ()=>{
    try{
        await mongoose.connect(mongo_url);
        console.log('Connected to MongoDB');
    }catch(e){
        console.error('Error connecting to MongoDB', e.message);
        process.exit(1);
    }
 };
 module.exports = dbConnection;