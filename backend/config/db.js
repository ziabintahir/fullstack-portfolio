/**
 * MySQL connection pool using mysql2/promise
 * Uses a connection pool for performance and reliability.
 */

const mysql = require("mysql2/promise");
const logger = require("../utils/logger");

const pool = mysql.createPool({
  host:              process.env.DB_HOST     || "localhost",
  port:              parseInt(process.env.DB_PORT) || 3306,
  user:              process.env.DB_USER     || "portfolio_user",
  password:          process.env.DB_PASSWORD || "",
  database:          process.env.DB_NAME     || "portfolio_db",
  waitForConnections: true,
  connectionLimit:   10,
  queueLimit:        0,
  timezone:          "+00:00",
  charset:           "utf8mb4",
  // Reconnect on lost connection
  enableKeepAlive:   true,
  keepAliveInitialDelay: 0,
});

/**
 * Test the database connection on startup.
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    logger.info("✅ MySQL connected successfully");
    connection.release();
  } catch (error) {
    logger.error(`❌ MySQL connection failed: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Utility: run a parameterized query.
 * @param {string} sql   - SQL statement
 * @param {Array}  params - Bound parameters
 * @returns {Promise<Array>}
 */
const query = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

module.exports = { pool, query, testConnection };
