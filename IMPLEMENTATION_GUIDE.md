# Quick Implementation Guide: Critical Security Fix

## 🔴 CRITICAL: Link Tasks to Users

Currently, all users can see and modify all tasks. This is a major security vulnerability!

### Step 1: Update Task Model

Add `createdBy` field to link tasks to users:

```javascript
// models/Task.js
const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name Cannot Be Empty"],
    maxlength: [20, "name should not be more than 20 characters"],
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
```

### Step 2: Update Task Controllers

**getAllTasks** - Only show tasks for the logged-in user:
```javascript
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id });
    res.status(200).json({ tasks, count: tasks.length });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
```

**createTask** - Automatically assign task to current user:
```javascript
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
```

**getSingleTask** - Verify ownership:
```javascript
exports.getSingleTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
```

**updateTask** - Verify ownership before updating:
```javascript
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
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
```

**deleteTask** - Verify ownership before deleting:
```javascript
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.status(200).json({ message: "Task Deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
```

### Step 3: Add Database Index (Performance)

Add index to Task model for faster queries:
```javascript
taskSchema.index({ createdBy: 1 });
```

---

## 🎯 Next Steps After This Fix

1. **Add Input Validation** - Use `express-validator`
2. **Move JWT_SECRET to .env** - Security best practice
3. **Improve Error Handling** - Better error messages
4. **Add Pagination** - For when you have many tasks

See `FEATURE_ROADMAP.md` for the complete learning path!

