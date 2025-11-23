const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username Cannot Be Empty"],
    maxlength: [20, "username should not be more than 20 characters"],
    trim: true,
    // unique: true,
  },
  email: {
    type: String,
    required: [true, "email Cannot Be Empty"],
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "password Cannot Be Empty"],
    minlength: [8, "password should not be less than 8 characters"],
    maxlength: [20, "password should not be more than 20 characters"],
    trim: true,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
