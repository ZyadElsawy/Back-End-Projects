const Task = require("../models/Task");

const pagination = (req, data) => {};

exports.getAllTasks = async (req, res) => {
  try {
    // Extract and validate pagination parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Build query filter
    const filter = { author: req.user.id };

    // Get total count of tasks (before pagination)
    const totalTasks = await Task.countDocuments(filter);

    // Calculate total pages
    const totalPages = Math.ceil(totalTasks / limit);

    // Handle edge case: page exceeds total pages
    if (page > totalPages && totalPages > 0) {
      return res.status(200).json({
        tasks: [],
        pagination: {
          currentPage: page,
          totalPages,
          totalTasks,
          tasksPerPage: limit,
          hasNextPage: false,
          hasPrevPage: page > 1,
        },
      });
    }

    // Fetch paginated tasks with consistent sorting
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first for consistent pagination
      .skip(skip)
      .limit(limit);

    // Build pagination metadata
    const pagination = {
      currentPage: page,
      totalPages,
      totalTasks,
      tasksPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    res.status(200).json({
      tasks,
      count: tasks.length,
      pagination,
    });
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
