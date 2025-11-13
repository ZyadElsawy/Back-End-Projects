const Task = require("../models/Task");

exports.getAllTasks = (req, res) => {
  res.send({ message: "getting all tasks" });
};

exports.createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json({ task });
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
