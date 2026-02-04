require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);

        console.log(`🎉 MongoDB connected successfully`);
        console.log(`📊 Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.log("Failed to connect MongoDB", error);
    }
};

module.exports = connectDB;