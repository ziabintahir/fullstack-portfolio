const { query } = require("../config/db");

const getAllSkills = async (req, res, next) => {
  try {
    const skills = await query("SELECT * FROM skills ORDER BY category, sort_order ASC");

    // Group by category
    const grouped = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});

    res.json({ success: true, data: grouped });
  } catch (error) {
    next(error);
  }
};

const createSkill = async (req, res, next) => {
  try {
    const { name, category, icon_key, level, sort_order } = req.body;
    const result = await query(
      "INSERT INTO skills (name, category, icon_key, level, sort_order) VALUES (?, ?, ?, ?, ?)",
      [name, category, icon_key || null, level || 80, sort_order || 0]
    );
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (error) {
    next(error);
  }
};

const deleteSkill = async (req, res, next) => {
  try {
    await query("DELETE FROM skills WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Skill deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllSkills, createSkill, deleteSkill };
