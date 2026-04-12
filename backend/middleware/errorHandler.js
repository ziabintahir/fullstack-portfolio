/**
 * Global Error Handler Middleware
 * Centralises all error responses.
 */

const logger = require("../utils/logger");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} — ${req.method} ${req.originalUrl}`, { stack: err.stack });

  // Validation errors from express-validator
  if (err.type === "validation") {
    return res.status(422).json({ success: false, message: "Validation failed", errors: err.errors });
  }

  // MySQL duplicate entry
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ success: false, message: "Duplicate entry — record already exists." });
  }

  // JWT errors handled in middleware, but catch any that slip through
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token." });
  }

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal server error"
      : err.message || "Internal server error";

  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
