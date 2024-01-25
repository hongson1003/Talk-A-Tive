const express = require('express');
const userController = require('../controllers/userController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

const InitUserRoute = () => {
    // router.post('/', userController.registerUser);
    router.route('/').post(userController.registerUser).get(protect, userController.allUsers);
    router.post('/login', userController.login);

    return router;
}



module.exports = InitUserRoute;