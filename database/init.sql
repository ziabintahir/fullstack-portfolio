-- ============================================================
-- Portfolio Database Schema
-- Author: Zia Bin Tahir
-- ============================================================

CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

-- ============================================================
-- ADMIN USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  username    VARCHAR(50)  NOT NULL UNIQUE,
  email       VARCHAR(100) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,  -- bcrypt hash
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(150) NOT NULL,
  description  TEXT         NOT NULL,
  tech_stack   JSON         NOT NULL,   -- ["Node.js","MySQL","Docker"]
  github_url   VARCHAR(255),
  live_url     VARCHAR(255),
  image_url    VARCHAR(255),
  category     ENUM('backend','frontend','fullstack','devops') DEFAULT 'fullstack',
  featured     BOOLEAN      DEFAULT FALSE,
  sort_order   INT          DEFAULT 0,
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- CONTACT MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL,
  subject    VARCHAR(200),
  message    TEXT         NOT NULL,
  is_read    BOOLEAN      DEFAULT FALSE,
  ip_address VARCHAR(45),
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SKILLS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  category   ENUM('frontend','backend','devops','database','tools') NOT NULL,
  icon_key   VARCHAR(50),          -- maps to Lucide/Simple icon
  level      TINYINT DEFAULT 80,   -- 0–100 proficiency
  sort_order INT DEFAULT 0
);

-- ============================================================
-- SEED: Default admin  (password: Admin@1234 — change immediately)
-- bcrypt hash of "Admin@1234"
-- ============================================================
INSERT INTO admin_users (username, email, password) VALUES
(
  'zia_admin',
  'ziabintahir@gmail.com',
  '$2b$12$K8gL7zQp3mN2xWvTsYoRFOqM5JhBe6DlCiA9nVuXwPktZ0fEjHrGS'
);

-- ============================================================
-- SEED: Projects
-- ============================================================
INSERT INTO projects (title, description, tech_stack, github_url, live_url, category, featured, sort_order) VALUES
(
  'Portfolio REST API',
  'Production-grade REST API powering this portfolio with JWT auth, MVC architecture, and MySQL. Features include project CRUD, contact form with Nodemailer, rate limiting, and Swagger docs.',
  '["Node.js","Express.js","MySQL","JWT","Docker","Swagger"]',
  'https://github.com/ziabintahir/portfolio-api',
  'https://portfolio-api.render.com',
  'backend', TRUE, 1
),
(
  'Full-Stack Portfolio Platform',
  'Modern developer portfolio with Next.js 14 frontend, Express backend, MySQL database, and Docker deployment. Includes admin dashboard for CMS-style content management.',
  '["Next.js","Tailwind CSS","Node.js","MySQL","Docker","JWT"]',
  'https://github.com/ziabintahir/my-portfolio',
  'https://ziaai.vercel.app',
  'fullstack', TRUE, 2
),
(
  'Docker Compose DevOps Stack',
  'Multi-container DevOps setup with Nginx reverse proxy, Node.js app, MySQL, and Redis. Includes health checks, volume persistence, and environment-based config.',
  '["Docker","Docker Compose","Nginx","Node.js","MySQL","Redis"]',
  'https://github.com/ziabintahir/devops-stack',
  NULL,
  'devops', TRUE, 3
),
(
  'CI/CD Pipeline Setup',
  'GitHub Actions workflow for automated testing, Docker image builds, and deployment to Render. Includes lint checks, unit tests, and environment secrets management.',
  '["GitHub Actions","Docker","Node.js","Jest","Render"]',
  'https://github.com/ziabintahir/cicd-pipeline',
  NULL,
  'devops', FALSE, 4
);

-- ============================================================
-- SEED: Skills
-- ============================================================
INSERT INTO skills (name, category, icon_key, level, sort_order) VALUES
-- Backend
('Node.js',        'backend',  'nodejs',      90, 1),
('Express.js',     'backend',  'express',     88, 2),
('REST APIs',      'backend',  'api',         90, 3),
('JWT Auth',       'backend',  'lock',        85, 4),
('Python',         'backend',  'python',      75, 5),
-- Frontend
('Next.js',        'frontend', 'nextjs',      80, 1),
('React.js',       'frontend', 'react',       80, 2),
('Tailwind CSS',   'frontend', 'tailwind',    85, 3),
('HTML/CSS',       'frontend', 'html',        92, 4),
('JavaScript',     'frontend', 'js',          88, 5),
-- Database
('MySQL',          'database', 'mysql',       87, 1),
('PostgreSQL',     'database', 'postgresql',  75, 2),
('Redis',          'database', 'redis',       70, 3),
('MongoDB',        'database', 'mongo',       72, 4),
-- DevOps
('Docker',         'devops',   'docker',      85, 1),
('Docker Compose', 'devops',   'docker',      83, 2),
('GitHub Actions', 'devops',   'github',      80, 3),
('Linux/Bash',     'devops',   'linux',       85, 4),
('Nginx',          'devops',   'nginx',       78, 5),
('AWS (EC2/S3)',   'devops',   'aws',         72, 6),
-- Tools
('Git',            'tools',    'git',         92, 1),
('Postman',        'tools',    'postman',     90, 2),
('VS Code',        'tools',    'vscode',      95, 3),
('Swagger',        'tools',    'swagger',     80, 4);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_projects_category  ON projects (category);
CREATE INDEX idx_projects_featured  ON projects (featured);
CREATE INDEX idx_contact_is_read    ON contact_messages (is_read);
CREATE INDEX idx_skills_category    ON skills (category);
