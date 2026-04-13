/**
 * Portfolio API Server
 * Author: Zia Bin Tahir
 * Stack: Node.js + Express.js + MySQL
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");

const { testConnection } = require("./config/db");
const logger = require("./utils/logger");
const swaggerSpec = require("./config/swagger");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

// Route imports
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const contactRoutes = require("./routes/contact");
const skillRoutes = require("./routes/skills");
const healthRoutes = require("./routes/health");

const app = express();
const PORT = process.env.PORT || 5000;

// ──────────────────────────────────────────────
// Security & global middleware
// ──────────────────────────────────────────────
app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "https://ziaai.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use(globalLimiter);

// Strict limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts, please try again later." },
});

// ──────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────

app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully!");
});
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/skills", skillRoutes);

// Swagger API Docs (disable in strict production if needed)
if (process.env.NODE_ENV !== "production" || process.env.ENABLE_SWAGGER === "true") {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
  logger.info("Swagger docs available at /api/docs");
}

// ──────────────────────────────────────────────
// Error handling (must be last)
// ──────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ──────────────────────────────────────────────
// Start server
// ──────────────────────────────────────────────
const start = async () => {
  await testConnection();
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
    logger.info(`📖 Swagger docs: http://localhost:${PORT}/api/docs`);
  });
};

start();

module.exports = app; // for testing
