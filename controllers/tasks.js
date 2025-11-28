const Task = require("../models/Task");

exports.getAllTasks = async (req, res) => {
  try {
    // Find all tasks where author matches the current user's ID
    const tasks = await Task.find({ author: req.user.id });
    // find() returns an array, so check length instead of truthiness
    res.status(200).json({ tasks, count: tasks.length });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      name: req.body.name,
      completed: req.body.completed,
      author: req.user.id,
    });
    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.getSingleTask = async (req, res) => {
  try {
    // Verify the task belongs to the current user
    const task = await Task.findOne({
      _id: req.params.id,
      author: req.user.id,
    });
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    // Verify ownership and update in one query
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
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
    res.status(500).json({ msg: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    // Verify ownership before deleting
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      author: req.user.id,
    });
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.status(200).json({ message: "Task Deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
