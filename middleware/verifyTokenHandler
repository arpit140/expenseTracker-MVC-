require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const verify = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const key = process.env.jwtSecret;
    
        const tokenWithoutBearer = token.replace("Bearer", "").trim();
        const user = jwt.verify(tokenWithoutBearer, key);
    
        const foundUser = await User.findOne({ where: { id: user.userId } });
    
        if (foundUser) {
            req.user = user;
            next();
        } else {
            return res.status(401).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: "Token Verification failed" });
    }
    
}
module.exports = { verify };