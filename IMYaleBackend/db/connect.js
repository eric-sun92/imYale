const mongoose = require("mongoose");

const connectDB = (url) => {
  mongoose.connect(url);
  mongoose.connection.on("connected", () => {
      console.log("Connected to database");
  });
  return mongoose.connect(url);
};

module.exports = connectDB;
