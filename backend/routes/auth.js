// ─── routes/auth.js ───────────────────────────
const router = require("express").Router();
const { login, getMe, changePassword } = require("../controllers/authController");
const authenticate = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Admin authentication
 */
router.post(
  "/login",
  [
    body("username").notEmpty().trim().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

router.get("/me", authenticate, getMe);

router.patch(
  "/change-password",
  authenticate,
  [
    body("currentPassword").notEmpty().withMessage("Current password required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Password must include uppercase, lowercase, and a number"),
  ],
  validate,
  changePassword
);

module.exports = router;
