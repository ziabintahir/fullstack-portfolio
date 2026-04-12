/**
 * Auth Controller
 * Handles admin login and token refresh.
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../config/db");
const logger = require("../utils/logger");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required." });
    }

    const users = await query(
      "SELECT * FROM admin_users WHERE username = ? OR email = ?",
      [username, username]
    );

    if (!users.length) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      logger.warn(`Failed login attempt for user: ${username}`);
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    logger.info(`Admin login: ${user.username}`);

    res.json({
      success: true,
      message: "Login successful.",
      data: {
        token,
        user: { id: user.id, username: user.username, email: user.email },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current admin info
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Admin data }
 *       401: { description: Unauthorized }
 */
const getMe = async (req, res, next) => {
  try {
    res.json({ success: true, data: req.user });
  } catch (error) {
    next(error);
  }
};

/**
 * Change admin password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const users = await query("SELECT * FROM admin_users WHERE id = ?", [req.user.id]);
    const user = users[0];

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ success: false, message: "Current password is incorrect." });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await query("UPDATE admin_users SET password = ? WHERE id = ?", [hashed, req.user.id]);

    res.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getMe, changePassword };
