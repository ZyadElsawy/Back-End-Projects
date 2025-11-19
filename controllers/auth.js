const User = require("../models/User");

const register = async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  //   const userExists = User.findOne({ username: username });
  const emailExists = await User.findOne({ email: email });
  if (emailExists) {
    return res.status(200).json({ msg: "User Already Exists" });
  }
  const user = await User.create({
    username: username,
    email: email,
    password: password,
  })
    .then(() => {
      console.log("User added successfully");
      //   console.log(user);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ msg: "something went wrong" });
    });
  console.log(user);

  return res.status(201).json({ msg: "user added successfully" });
};

const login = (req, res) => {};

module.exports = {
  register,
  login,
};
