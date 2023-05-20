const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const connectDB = async () => {
    //used to ignore warning when setting up database
    mongoose.set('strictQuery', true);

    try {
        console.log(process.env.MONGO_URI);
        const connect = await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log(`MongoDB Connected: ${connect.connection.host}`.cyan.underline);

    } catch (Error) {
        console.log(Error);
        process.exit(1);
    }
}

module.exports = connectDB;