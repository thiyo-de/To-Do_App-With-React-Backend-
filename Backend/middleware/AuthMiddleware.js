const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(req, res, next) {
  // 1. Get token from headers
  const token = req.header("x-auth-token"); // Frontend must send token in "x-auth-token"

  // 2. Check if token exists
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Add user info to request object
    req.user = decoded; // contains { userId: ... }

    // 5. Move to next middleware or route handler
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}

module.exports = auth;
