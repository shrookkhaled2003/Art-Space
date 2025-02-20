const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

dotenv.config();

// middleware to verify JWT token before accessing protected routes
const verfiyToken = (req,res,next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader){
        return res.status(401).json({ message: 'Token is required' });
    }
    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        next();
    }catch(err){
        return res.status(401).json({ message: 'Invalid token' });
    }
}
module.exports = verfiyToken;