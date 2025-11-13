const Task = require("../models/Task");

exports.getAllTasks = (req, res) => {
  res.send({ message: "getting all tasks" });
};

exports.createTask = (req, res) => {
  res.send({ message: "creating tasks" });
};

exports.getSingleTask = (req, res) => {
  res.send({ message: "Returning Single Task", id: req.params.id });
};

exports.updateTask = (req, res) => {
  res.send({ message: "updating task", id: req.params.id });
};

exports.deleteTask = (req, res) => {
  res.send({ message: "Deleting Task", id: req.params.id });
};
