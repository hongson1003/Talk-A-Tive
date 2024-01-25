const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userModel = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
        type: String,
        default: 'https://ibiettuot.com/wp-content/uploads/2021/10/avatar-mac-dinh.png'
    }

},
    { timestamps: true }
)

userModel.methods.comparePassword = function (enterdPassword) {
    return bcrypt.compareSync(enterdPassword, this.password);
}

userModel.pre('save', async function (next) {
    if (!this.isModified) {
        return next();
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    return next();
})

const User = mongoose.model('User', userModel);

module.exports = User;