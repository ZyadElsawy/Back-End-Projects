const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id, username) => {
  return jwt.sign({ id, username }, "JWT_SECRET", {
    expiresIn: maxAge,
  });
};

const register = async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  //   const userExists = User.findOne({ username: username });
  const emailExists = await User.findOne({ email: email });
  if (emailExists) {
    return res.status(200).json({ msg: "User Already Exists" });
  }
  try {
    const user = await User.create({
      username: username,
      email: email,
      password: password,
    });
    console.log("User added successfully");
    // console.log(user);
    const token = createToken(user._id, user.username);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000, // Convert to milliseconds
      sameSite: "strict",
    });
    return res.status(201).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ msg: "something went wrong" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const emailExists = await User.findOne({ email: email });
  console.log(emailExists);
  if (!emailExists) {
    return res.status(200).json({ msg: "Incorrect email or password" });
  }
  const isCorrect = await bcrypt.compare(password, emailExists.password);
  if (!isCorrect) {
    return res.status(200).json({ msg: "Incorrect email or password" });
  }

  //   console.log(emailExists.password);
  const token = createToken(emailExists._id, emailExists.username);
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: maxAge * 1000, // Convert to milliseconds
    sameSite: "strict",
  });
  return res.json({ msg: "Login Successfull" });
};

module.exports = {
  register,
  login,
};
