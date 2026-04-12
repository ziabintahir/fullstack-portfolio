// ─── routes/skills.js ───────────────────────────
const router = require("express").Router();
const { getAllSkills, createSkill, deleteSkill } = require("../controllers/skillsController");
const authenticate = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });
  next();
};

router.get("/", getAllSkills);
router.post(
  "/",
  authenticate,
  [
    body("name").notEmpty().trim(),
    body("category").isIn(["frontend", "backend", "devops", "database", "tools"]),
    body("level").optional().isInt({ min: 0, max: 100 }),
  ],
  validate,
  createSkill
);
router.delete("/:id", authenticate, deleteSkill);

module.exports = router;
