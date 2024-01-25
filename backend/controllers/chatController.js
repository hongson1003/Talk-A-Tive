const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModels');
const User = require('../models/userModel');


const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.sendStatus(400);
    }
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: req.body.userId } } }
        ]
    }).populate('users', '-password').populate('latestMessage');
    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'name avatar email',
    })
    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        let chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user._id, req.body.userId],
        }
        try {
            const createChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createChat._id }).populate('users', '-password').populate('latestMessage');
            res.status(200).send(fullChat);
        } catch (e) {
            res.status(400);
            throw new Error('Error from the server');
        }
    }
})

const fetchChats = asyncHandler(async (req, res) => {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })
        .then(async (results) => {
            results = await User.populate(results, {
                path: 'latestMessage.sender',
                select: 'name avatar email',
            })
            res.status(200).send(results);
        })
    // then(rs => res.send(rs))
})

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name)
        return res.status(400).send({ message: 'Please fill all the fields' })
    const users = req.body.users;
    users.push(req.user);
    if (users?.length < 2)
        return res.status(400).send({ message: 'This isn"t groupchat' });
    let groupChat = {
        chatName: req.body.name,
        isGroupChat: true,
        users: users,
        groupAdmin: req.user._id
    }
    try {
        let create = await Chat.create(groupChat);
        if (create) {
            let chat = await Chat.find({
                _id: create._id
            })
                .populate('users', '-password')
                .populate('groupAdmin', '-password');
            return res.status(200).json(chat);
        } else
            return res.status(400).send({ message: 'Not create new groupchat' });
    } catch (e) {
        throw new Error('Error from the server', e.message);
    }
})

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    const updated = await Chat.findByIdAndUpdate(chatId, {
        chatName: chatName,

    }, {
        new: true
    })
        .populate('users', '-password')
        .populate('groupAdmin', '-password');
    if (!updated) {
        res.status(404);
        throw new Error('Not update groupchat');
    } else {
        return res.status(200).json(updated);
    }
})

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(chatId, {
        $push: { users: userId }
    }, {
        new: true
    })
        .populate('users', '-password')
        .populate('groupAdmin', '-password');
    if (!added) {
        res.status(400);
        throw new Error('Can"t not add member to group');
    } else
        return res.status(200).json(added);
})

const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const deleted = await Chat.findByIdAndUpdate(chatId, {
        $pull: { users: userId }
    }, {
        new: true
    })
        .populate('users', '-password')
        .populate('groupAdmin', '-password');
    if (!deleted) {
        res.status(400);
        throw new Error('Can"t not remove member to group');
    } else
        return res.status(200).json(deleted);
})

module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup
}