/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Portfolio project management
 */

const router = require("express").Router();
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectsController");
const authenticate = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

const projectValidation = [
  body("title").notEmpty().trim().isLength({ max: 150 }).withMessage("Title required (max 150 chars)"),
  body("description").notEmpty().withMessage("Description is required"),
  body("tech_stack").isArray({ min: 1 }).withMessage("tech_stack must be a non-empty array"),
  body("category")
    .optional()
    .isIn(["backend", "frontend", "fullstack", "devops"])
    .withMessage("Invalid category"),
  body("github_url").optional({ checkFalsy: true }).isURL().withMessage("Invalid GitHub URL"),
  body("live_url").optional({ checkFalsy: true }).isURL().withMessage("Invalid live URL"),
];

// Public
router.get("/", getAllProjects);
router.get("/:id", getProjectById);

// Admin — protected
router.post("/", authenticate, projectValidation, validate, createProject);
router.put("/:id", authenticate, projectValidation, validate, updateProject);
router.delete("/:id", authenticate, deleteProject);

module.exports = router;
