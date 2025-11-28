const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyAuth = (req, res, next) => {
  //veirfy if the token exists
  //if exists verify the token signature if valid
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "JWT_SECRET", async (err, decoded) => {
      if (err) {
        console.log(err);
        return res
          .status(401)
          .json({ msg: "Authentication failed. Please login." });
      } else {
        console.log(decoded);
        const user = await User.findById(decoded.id);
        req.user = { username: user.username, id: user._id, email: user.email };
        next();
      }
    });
  } else {
    return res
      .status(401)
      .json({ msg: "Authentication required. Please login." });
  }
};

module.exports = verifyAuth;
