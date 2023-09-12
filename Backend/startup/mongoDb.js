const mongoose = require("mongoose");
const config = require("config");

const connectDB = async () => {
  const conn = await mongoose.connect(config.get("database.mongoUri"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
