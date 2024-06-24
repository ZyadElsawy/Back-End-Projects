const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
// route to get all users
router.get("/", async (req, res) => {
  //console.log("HERE");
  try {
    const users = await User.find().select("_id username email");
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

// route to get current user
router.get("/user", async (req, res) => {
  //console.log("in");
  try {
    const token = req.cookies.jwt;
    //console.log(token);
    if (!token) {
      return res.status(401).json({ error: "user not authenticated" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        if (err.message === "invalid signature") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
        if (err.message === "jwt signature is required") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
        if (err.message === "jwt malformed") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
      }
      throw err;
    }
    const userID = decoded.id;

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    // console.log(user);
    res.status(200).json({
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "something went wrong" });
  }
});
// route to create a new user (ADMIN FUNCTIONALITY ONLY)
router.post("/", async (req, res) => {
  //console.log("HERE2");
  const newUser = new User(req.body);
  try {
    const savedUser = await newUser.save();
    res.status(200).json({
      success: "true",
      message: "User Created successfully",
      userID: savedUser._id,
    });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});
// route to get a user by user id
router.get("/:id", async (req, res) => {
  // console.log("HERE3");
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json({
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.log(err.message);
    //res.status(500).json({ message: "this User Does Not Exist" });
    res.status(500).json({ message: "something went wrong" });
  }
});
// Update email (ADMIN FUNCTIONALITY)
router.put("/email/:id", async (req, res) => {
  //console.log("HERE9");
  try {
    const user = await User.findById(req.params.id);
    // console.log(user._id);
    if (!user) return res.status(404).json({ message: "User Not Found" });
    // console.log(user.userID.toString());
    // console.log(req.params.id);
    if (user._id.toString() === req.params.id) {
      // Check if the new email already exists
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      await user.updateOne({ $set: { email: req.body.email } });
      res
        .status(200)
        .json({ success: true, message: "Email updated successfully" });
    } else {
      res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "something went wrong" });
  }
});

// Update email (USER FUNCTIONALITY)
router.put("/user/email/", async (req, res) => {
  //console.log("HERE10");
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "user not authenticated" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        if (err.message === "invalid signature") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
        if (err.message === "jwt signature is required") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
        if (err.message === "jwt malformed") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
      }
      throw err;
    }
    const userID = decoded.id;
    const user = await User.findById(userID);
    // console.log(user._id);
    if (!user) return res.status(404).json({ message: "User Not Found" });
    // console.log(user.userID.toString());
    // console.log(req.params.id);
    if (user._id.toString() === userID) {
      // Check if the new email already exists
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      await user.updateOne({ $set: { email: req.body.email } });
      res
        .status(200)
        .json({ success: true, message: "Email updated successfully" });
    } else {
      res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "something went wrong" });
  }
});

// Update username (ADMIN FUNCTIONALITY)
router.put("/username/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User Not Found" });
    if (user._id.toString() === req.params.id) {
      // Check if the new username already exists
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      await user.updateOne({ $set: { username: req.body.username } });
      res
        .status(200)
        .json({ success: true, message: "Username updated successfully" });
    } else {
      res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "something went wrong" });
  }
});

// Update username (USER FUNCTIONALITY)
router.put("/user/username/", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "user not authenticated" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        if (err.message === "invalid signature") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
        if (err.message === "jwt signature is required") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
        if (err.message === "jwt malformed") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
      }
      throw err;
    }
    const userID = decoded.id;
    const user = await User.findById(userID);
    if (!user) return res.status(404).json({ message: "User Not Found" });
    if (user._id.toString() === userID) {
      // Check if the new username already exists
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      await user.updateOne({ $set: { username: req.body.username } });
      res
        .status(200)
        .json({ success: true, message: "Username updated successfully" });
    } else {
      res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "something went wrong" });
  }
});

// Update password (ADMIN FUNCTIONALITY)
router.put("/password/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User Not Found" });
    if (user._id.toString() === req.params.id) {
      // Update the password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      await user.updateOne({ $set: { password: hashedPassword } });
      res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } else {
      res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

// Update password (USER FUNCTIONALITY)
router.put("/user/password/", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "user not authenticated" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        if (err.message === "invalid signature") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
        if (err.message === "jwt signature is required") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
        if (err.message === "jwt malformed") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
      }
      throw err;
    }
    const userID = decoded.id;
    const user = await User.findById(userID);
    if (!user) return res.status(404).json({ message: "User Not Found" });
    if (user._id.toString() === userID) {
      // Update the password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      await user.updateOne({ $set: { password: hashedPassword } });
      res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } else {
      res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

// Update Pic (USER FUNCTIONALITY)
router.put("/user/Pic/", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "user not authenticated" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        if (err.message === "invalid signature") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
        if (err.message === "jwt signature is required") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
        if (err.message === "jwt malformed") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
      }
      throw err;
    }
    const userID = decoded.id;
    const user = await User.findById(userID);
    if (!user) return res.status(404).json({ message: "User Not Found" });
    if (user._id.toString() === userID) {
      await user.updateOne({ $set: { profilePic: req.body.profilePic } });
      res.status(200).json({
        success: true,
        message: "profile picture updated successfully",
      });
    } else {
      res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});
// route to delete a user by user id (USER FUNCTIONALITY)
router.delete("/user", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "user not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    if (user._id.toString() === userID) {
      await user.deleteOne();
      res
        .status(200)
        .json({ success: "true", message: "Deleted successfully" });
    } else {
      res.status(403).json({
        success: "false",
        message: "you can only delete your own profile",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "something went wrong" });
  }
});
// route to delete a user by user id (ADMIN FUNCTIONALITY)
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User Not Found" });
    if (user._id.toString() === req.params.id) {
      // Remove all posts and comments associated with the user
      await Post.deleteMany({ userID: user._id });
      await Comment.deleteMany({ author: user._id });

      await user.deleteOne();
      res
        .status(200)
        .json({ success: "true", message: "Deleted successfully" });
    } else {
      res.status(403).json({
        success: "false",
        message: "you can only delete your own profile",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "something went wrong" });
  }
});

module.exports = router;
/*
  -------------------------------------      Reviewed and Done (FOR NOW)       -------------------------------------
  # DOCs
    -> create a new user
        => reviewd
        => DONE
    -> get all users
        => reviewd
        => DONE
    -> get a specific user
        => reviewd
        => DONE
    -> update username
        => reviewd
        => DONE
    -> update email
        => reviewd
        => DONE
    -> update password
        => reviewd
        => DONE
    -> delete a specific user
        => reviewd
        => DONE
*/
