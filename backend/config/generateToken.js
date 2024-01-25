const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();

const generateToken = (id) => {
    let token = jwt.sign(
        { id }
        , process.env.JWT_SECRET,
        {
            expiresIn: '30d'
        }
    )
    return token;
}

module.exports = generateToken;