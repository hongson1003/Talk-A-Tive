const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, avatar } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please Enter all the Fields');
    }
    const userExists = await User.findOne({
        email
    });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists !!!');
    }
    const user = await User.create({
        name,
        email,
        avatar,
        password
    })
    if (user) {
        return res.status(201).json({
            email: user.email,
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Fail to Create the User');
    }
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({
        email
    });
    if (user && await user.comparePassword(password)) {
        return res.json({
            email: user.email,
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error('Password incorrect !');
    }
})


const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
        ]
    } : {};
    const users = await User.find(keyword).find({
        _id: { $ne: req.user._id }
    })
    return res.status(200).json(users);
})

module.exports = {
    registerUser,
    login,
    allUsers
}