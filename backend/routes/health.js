const router = require("express").Router();
const { pool } = require("../config/db");

router.get("/", async (req, res) => {
  let dbStatus = "ok";
  try {
    const conn = await pool.getConnection();
    conn.release();
  } catch {
    dbStatus = "error";
  }

  const status = dbStatus === "ok" ? 200 : 503;
  res.status(status).json({
    success: dbStatus === "ok",
    status: dbStatus === "ok" ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    services: { api: "ok", database: dbStatus },
  });
});

module.exports = router;
