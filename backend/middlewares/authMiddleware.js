const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const env = require('dotenv');
env.config();

const protect = asyncHandler(async (req, res, next) => {
    let token = "";
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(" ")[1];
            //decodes token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (e) {
            res.status(401);
            throw new Error('Error from the server ' + e.message);
        }
    } else {
        res.status(401);
        throw new Error('Not authorized no token');

    }
})

module.exports = protect;
