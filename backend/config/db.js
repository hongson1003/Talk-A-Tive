const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URL}`, {
            // useNewUrlParser: true,
            // useUnifedTopology: true,
            // useFindAndModify: true
        });
        console.log(`Connect mongodb success ${conn.connection.host}`.yellow.bold);
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;