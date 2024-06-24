const router = require("express").Router();
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const { validatePostData } = require("../middlewares/validatePost");
// create a new post
router.post("/", validatePostData, async (req, res) => {
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
    const userId = decoded.id;
    const newPost = new Post({
      userID: userId,
      desc: req.body.desc,
      img: req.body.img,
    });
    const savePost = await newPost.save();
    res.status(200).json({
      success: true,
      message: "Post created successfully",
      postID: savePost._id,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "something went wrong" });
  }
});

// update a specific post
router.put("/:id", validatePostData, async (req, res) => {
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

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    if (userID === post.userID.toString()) {
      await post.updateOne({
        $set: { desc: req.body.desc, img: req.body.img },
      });
      res
        .status(200)
        .json({ success: "true", message: "Updated successfully" });
    } else {
      console.log(req.body.userID);
      console.log(post.userID);
      res.status(403).json({
        success: "false",
        message: "you can only update your own posts",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "something went wrong" });
  }
});

// delete a specific post
router.delete("/:id", async (req, res) => {
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

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    if (userID === post.userID.toString()) {
      await post.deleteOne();
      res
        .status(200)
        .json({ success: "true", message: "Deleted successfully" });
    } else {
      res.status(403).json({
        success: "false",
        message: "you can only delete your own posts",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "something went wrong" });
  }
});

// get all posts
router.get("/", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "user not authenticated" });
    }
    const posts = await Post.find();
    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

//get all posts of a specific user
router.get("/user", async (req, res) => {
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

    const posts = await Post.find({ userID: userID });
    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "something went wrong" });
  }
});

// route to search for posts by matching description
router.get("/search/:searchTerm", async (req, res) => {
  try {
    const posts = await Post.find({
      desc: { $regex: req.params.searchTerm, $options: "i" },
    });
    // console.log(posts);
    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

module.exports = router;
/*
  -------------------------------------      Reviewed and Done (FOR NOW)       -------------------------------------
  # DOCs
    -> create a new post
        => DONE
    -> update a specific post
        => DONE
    -> delete a specific post
        => DONE
    -> get all posts
        => DONE
    -> get all posts of a specific user
        => DONE
    -> search for posts
        => DONE
*/
