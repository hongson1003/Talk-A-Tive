const express = require('express');
const protect = require('../middlewares/authMiddleware');
const messageController = require('../controllers/messageController');

const router = express();

const InitMessageRoutes = () => {
    router.route('/').post(protect, messageController.sendMessage);
    router.route('/:chatId').get(protect, messageController.getAllMessage);

    return router;
}

module.exports = InitMessageRoutes;