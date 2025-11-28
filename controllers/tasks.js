const Task = require("../models/Task");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// const currentUser = (req, res) => {
//   const token = req.cookies.jwt;
//   if (token) {
//     jwt.verify(token, "JWT_SECRET", async (err, decoded) => {
//       if (err) {
//         console.log(err);
//       } else {
//         const user = await User.findById(decoded.id);
//         console.log(user);
//         return user;
//       }
//     });
//   } else {
//     console.log("Not Logged In");
//   }
// };

exports.getAllTasks = async (req, res) => {
  console.log("before user");
  // const curr = await currentUser(req, res);
  console.log(req.user.username);
  console.log(req.user.email);
  console.log(req.user.id);
  try {
    const tasks = await Task.find({});
    if (!tasks) {
      return res.status(404).json({ msg: "No tasks found" });
    }
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

exports.getSingleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id, "_id name completed");
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        completed: req.body.completed,
      },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.status(200).json({ message: "Task Deleted" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
