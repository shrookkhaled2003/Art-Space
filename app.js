// Importing required packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const dbConnection = require('./db/dbConnetion.js'); 
const userRouter = require('./routes/user.route.js');


//Load Environment Variables
dotenv.config();

//Database Connection
dbConnection();

const app = express();

//Middleware
app.use(express.json());
app.use(cors());

//Routes
app.use("/users", userRouter); 


//Create Server
const port = process.env.PORT || 3000 ;
app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`);
})

