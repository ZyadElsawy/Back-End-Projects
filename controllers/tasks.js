const Task = require("../models/Task");

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
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
    const task = await Task.findById(req.params.id, "name");
    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
    });
    res.status(200).json({ message: "Task Updated" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task Deleted" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
