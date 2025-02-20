const Users = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('dotenv');

env.config();


const getAllUsers = async (req,res)=>{
    const allUsers = await Users.find({},{"__v":false,"password":false})
     res.status(200).json({data:allUsers})
}
const register = async (req,res)=>{
   const {name , email, password} = req.body;
   if(!name || !email || !password){
    return res.status(400).json({message: "please enter complete data"});
    }
   const exist = await Users.findOne({email:email});
   if(exist){
    return res.status(400).json({message: "User already exists"})
   }else{
    //password hashing
   const hashed = await bcrypt.hash(password,10)
    const newUser = new Users({
        name,
        email,
        password:hashed
    })
    //generate  JWT token
    const token =  await jwt.sign({id:newUser._id},process.env.JWT_SECRET_KEY,{expiresIn:"3days"});
    await newUser.save();
    return res.status(201).json({message: "User registered successfully",token:token});
   }
   
}

const login = async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: "please enter your email or password"});
    }
    const user = await Users.findOne({email: email});
    if (!user){
        return res.status(404).json({message: "Wrong password or email"}) 
    }
    const matched = await bcrypt.compare(password,user.password)
    const token =  await jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"3days"});

    if(user && matched){
        return res.status(200).json({message:"Logged in successfully",token:token});
    }else{
        return res.status(404).json({message: "Wrong password or email"})
    }
}

module.exports = {
    getAllUsers,
    register,
    login,
}