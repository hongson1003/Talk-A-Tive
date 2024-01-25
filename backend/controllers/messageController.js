const handleAsync = require('express-async-handler');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModels');

const sendMessage = handleAsync(async (req, res) => {
    const { chatId, content } = req.body;
    let newMessage = {
        chat: chatId,
        content: content,
        sender: req.user._id,
    };

    try {
        let message = await Message.create(newMessage);
        message = await message.populate('sender', 'name avatar')
        message = await message.populate('chat')
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name avatar email',
        });
        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message._id,
        })

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

})

const getAllMessage = handleAsync(async (req, res) => {
    const chatId = req.params.chatId;
    try {
        let messages = await Message.find({ chat: chatId })
            .populate('sender', '-password')
            .populate('chat');
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})


module.exports = {
    sendMessage,
    getAllMessage
}
