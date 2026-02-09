const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("🎉 Connected to MongoDB brooo");
  } catch (error) {
    console.log("g'amini yee", error)
  }
}

module.exports = connectDB;