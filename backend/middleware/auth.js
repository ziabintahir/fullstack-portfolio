/**
 * JWT Authentication Middleware
 * Validates Bearer token on protected routes.
 */

const jwt = require("jsonwebtoken");
const { query } = require("../config/db");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Token expired. Please login again." });
      }
      return res.status(401).json({ success: false, message: "Invalid token." });
    }

    // Verify user still exists in DB
    const users = await query(
      "SELECT id, username, email FROM admin_users WHERE id = ?",
      [decoded.id]
    );

    if (!users.length) {
      return res.status(401).json({ success: false, message: "User no longer exists." });
    }

    req.user = users[0];
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
