const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Mongoose manages connection pooling internally, so one connect call is enough.
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected on ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
