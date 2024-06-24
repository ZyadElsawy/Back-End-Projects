const router = require("express").Router();
const Comment = require("../models/Comment");
const jwt = require("jsonwebtoken");
const { validateCommentData } = require("../middlewares/validateComment");
// route to add comment to a specific post by a specific user

// create a new comment
router.post("/", async (req, res) => {
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
    const newComment = new Comment({
      ...req.body,
      text: req.body.text,
      author: userID,
    });
    const savedComment = await newComment.save();
    res.status(200).json({
      success: "True",
      message: "Comment added successfully",
      commentID: savedComment._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// route to get all comments of a specific post
router.get("/:postID", async (req, res) => {
  try {
    const comments = await Comment.find({ postID: req.params.postID });
    if (comments.length === 0) {
      return res.status(404).json({ message: "No comments found" });
    }
    res.status(200).json(comments);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "something went wrong" });
  }
});

// route to get all comments for a specific post
// router.get("/", async (req, res) => {
//   try {
//     const comments = await Comment.find();
//     res.status(200).json(comments);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// route to delete a specific comment with checking the author
router.delete("/:id", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    console.log(token);
    if (!token) {
      return res.status(401).json({ error: "Unauthenticated" });
    }
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "comment does not exist" });
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
    if (comment.author.toString() === userID) {
      await comment.deleteOne();
      res
        .status(200)
        .json({ success: "true", message: "Deleted successfully" });
    } else {
      res.status(403).json({
        success: "false",
        message: "you can only delete your own comments :)",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "something went wrong" });
  }
});

// route to update a specific comment
router.put("/:id", validateCommentData, async (req, res) => {
  try {
    const token = req.cookies.jwt;
    console.log(token);
    if (!token) {
      return res.status(401).json({ error: "unauthenticated" });
    }
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "comment does not exist" });
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
    if (comment.author.toString() !== userID) {
      return res.status(403).json({
        success: "false",
        message: "you can only update your own comments :)",
      });
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        $set: { text: req.body.text },
      },
      { new: true }
    );
    res.status(200).json({
      success: "true",
      message: "Updated successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "something went wrong" });
  }
});
module.exports = router;

/*
  -------------------------------------      Reviewed and Done (FOR NOW)       -------------------------------------
  # DOCs
    -> create a new comment
        => reviewd
        => DONE
    -> get all comments for a specific post
        => reviewd
        => DONE
    -> delete a specific comment
        => reviewd
        => DONE
    -> update a specific comment
        => reviewd
        => DONE
*/
