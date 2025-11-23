const jwt = require("jsonwebtoken");

const verifyAuth = (req, res, next) => {
  //veirfy if the token exists
  //if exists verify the token signature if valid
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "JWT_SECRET", (err, decoded) => {
      if (err) {
        console.log(err);
        res.json({ msg: "redirecting to login page...." });
      } else {
        console.log(decoded);
        next();
      }
    });
  } else {
    res.json({ msg: "redirecting to login page...." });
  }
};

module.exports = verifyAuth;
