const router = require("express").Router();
const { submitContact, getAllMessages, markAsRead, deleteMessage } = require("../controllers/contactController");
const authenticate = require("../middleware/auth");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

// Strict rate limit: 5 messages per IP per hour
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many messages. Please try again in an hour." },
});

router.post(
  "/",
  contactLimiter,
  [
    body("name").notEmpty().trim().isLength({ max: 100 }).withMessage("Name is required"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("message").notEmpty().isLength({ min: 10, max: 2000 }).withMessage("Message must be 10–2000 characters"),
    body("subject").optional().trim().isLength({ max: 200 }),
  ],
  validate,
  submitContact
);

// Admin
router.get("/", authenticate, getAllMessages);
router.patch("/:id/read", authenticate, markAsRead);
router.delete("/:id", authenticate, deleteMessage);

module.exports = router;
