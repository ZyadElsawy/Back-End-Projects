const mongoose = require("mongoose");

const connectDB = () => {
  return mongoose.connect(process.env.URL).then(() => {
    console.log("Connected to DB");
  });
};

module.exports = connectDB;
