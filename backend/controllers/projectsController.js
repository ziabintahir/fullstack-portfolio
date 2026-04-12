/**
 * Projects Controller
 * Full CRUD for portfolio projects.
 */

const { query } = require("../config/db");
const logger = require("../utils/logger");

// ──────────────────────────────────────────────
// PUBLIC
// ──────────────────────────────────────────────

/**
 * GET /projects — fetch all projects (optionally filter by category)
 */
const getAllProjects = async (req, res, next) => {
  try {
    const { category, featured } = req.query;

    let sql = "SELECT * FROM projects WHERE 1=1";
    const params = [];

    if (category) {
      sql += " AND category = ?";
      params.push(category);
    }
    if (featured === "true") {
      sql += " AND featured = TRUE";
    }

    sql += " ORDER BY sort_order ASC, created_at DESC";

    const projects = await query(sql, params);

    // Parse JSON tech_stack string → array
    const parsed = projects.map((p) => ({
      ...p,
      tech_stack: typeof p.tech_stack === "string" ? JSON.parse(p.tech_stack) : p.tech_stack,
    }));

    res.json({ success: true, count: parsed.length, data: parsed });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /projects/:id — single project
 */
const getProjectById = async (req, res, next) => {
  try {
    const rows = await query("SELECT * FROM projects WHERE id = ?", [req.params.id]);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    const project = {
      ...rows[0],
      tech_stack:
        typeof rows[0].tech_stack === "string"
          ? JSON.parse(rows[0].tech_stack)
          : rows[0].tech_stack,
    };

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// ADMIN — Protected
// ──────────────────────────────────────────────

/**
 * POST /projects — create project
 */
const createProject = async (req, res, next) => {
  try {
    const { title, description, tech_stack, github_url, live_url, image_url, category, featured, sort_order } = req.body;

    const techJson = Array.isArray(tech_stack) ? JSON.stringify(tech_stack) : tech_stack;

    const result = await query(
      `INSERT INTO projects 
        (title, description, tech_stack, github_url, live_url, image_url, category, featured, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, techJson, github_url || null, live_url || null, image_url || null, category || "fullstack", featured || false, sort_order || 0]
    );

    logger.info(`Project created: ${title} by admin ${req.user.username}`);

    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: { id: result.insertId },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /projects/:id — update project
 */
const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify exists
    const existing = await query("SELECT id FROM projects WHERE id = ?", [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    const { title, description, tech_stack, github_url, live_url, image_url, category, featured, sort_order } = req.body;
    const techJson = Array.isArray(tech_stack) ? JSON.stringify(tech_stack) : tech_stack;

    await query(
      `UPDATE projects SET
        title = ?, description = ?, tech_stack = ?, github_url = ?,
        live_url = ?, image_url = ?, category = ?, featured = ?, sort_order = ?
       WHERE id = ?`,
      [title, description, techJson, github_url || null, live_url || null, image_url || null, category, featured, sort_order, id]
    );

    logger.info(`Project updated: id=${id} by admin ${req.user.username}`);

    res.json({ success: true, message: "Project updated successfully." });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /projects/:id
 */
const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await query("SELECT id, title FROM projects WHERE id = ?", [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    await query("DELETE FROM projects WHERE id = ?", [id]);
    logger.info(`Project deleted: "${existing[0].title}" (id=${id}) by admin ${req.user.username}`);

    res.json({ success: true, message: "Project deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllProjects, getProjectById, createProject, updateProject, deleteProject };
