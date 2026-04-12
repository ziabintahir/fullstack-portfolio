# Zia Bin Tahir — Full-Stack Developer Portfolio

[![CI/CD](https://github.com/ziabintahir/my-portfolio/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/ziabintahir/my-portfolio/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED)](https://docker.com)

> **Production-grade** portfolio platform with a Next.js frontend, Express REST API backend, MySQL database, Docker orchestration, and a JWT-protected admin dashboard.

🌐 **Live:** [https://ziaai.vercel.app](https://ziaai.vercel.app)
📖 **API Docs:** [https://portfolio-api.render.com/api/docs](https://portfolio-api.render.com/api/docs)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Nginx (Port 80/443)                  │
│              Reverse Proxy + Rate Limiting               │
└──────────────┬──────────────────────┬───────────────────┘
               │                      │
     /api/*    │                /     │
               ▼                      ▼
  ┌────────────────────┐   ┌─────────────────────┐
  │  Express Backend   │   │   Next.js Frontend  │
  │  Node.js + JWT     │   │   Tailwind CSS      │
  │  Port 5000         │   │   Port 3000         │
  └─────────┬──────────┘   └─────────────────────┘
            │
            ▼
  ┌─────────────────────┐
  │   MySQL 8.0         │
  │   Connection Pool   │
  │   Port 3306         │
  └─────────────────────┘
```

---

## Tech Stack

| Layer       | Technology                                      |
|-------------|--------------------------------------------------|
| Frontend    | Next.js 14 · Tailwind CSS · React Hook Form     |
| Backend     | Node.js · Express.js · JWT · Nodemailer         |
| Database    | MySQL 8.0 (connection pool via mysql2/promise)   |
| DevOps      | Docker · Docker Compose · Nginx · GitHub Actions|
| Deployment  | Vercel (frontend) · Render (backend)            |
| Security    | Helmet · CORS · Rate Limiting · bcrypt          |
| Docs        | Swagger / OpenAPI 3.0                           |

---

## Project Structure

```
portfolio/
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # GitHub Actions CI/CD
├── backend/
│   ├── config/
│   │   ├── db.js                  # MySQL pool + query helper
│   │   └── swagger.js             # OpenAPI spec config
│   ├── controllers/
│   │   ├── authController.js      # Login, me, change-password
│   │   ├── projectsController.js  # Full CRUD for projects
│   │   ├── contactController.js   # Submit form + Nodemailer
│   │   └── skillsController.js    # Skills CRUD
│   ├── middleware/
│   │   ├── auth.js                # JWT verify middleware
│   │   ├── errorHandler.js        # Global error handler
│   │   └── notFound.js            # 404 handler
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── contact.js
│   │   ├── skills.js
│   │   └── health.js
│   ├── utils/
│   │   └── logger.js              # Winston logger
│   ├── server.js                  # Entry point
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── layout.js              # Root layout + metadata
│   │   ├── page.js                # Portfolio homepage
│   │   ├── globals.css
│   │   └── admin/
│   │       ├── layout.js          # AuthProvider wrapper
│   │       ├── login/page.js      # Admin login
│   │       └── dashboard/
│   │           ├── layout.js      # Auth guard + sidebar
│   │           ├── page.js        # Dashboard overview
│   │           ├── projects/page.js  # Project CRUD UI
│   │           └── messages/page.js  # Contact messages
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── sections/
│   │   │   ├── Hero.js            # Typewriter hero
│   │   │   ├── About.js
│   │   │   ├── Skills.js          # Live from API
│   │   │   ├── Projects.js        # Live from API + filters
│   │   │   └── Contact.js         # Form → backend
│   │   └── admin/
│   │       └── AdminSidebar.js
│   ├── lib/
│   │   ├── api.js                 # Axios client + interceptors
│   │   └── auth.js                # AuthContext + useAuth
│   ├── Dockerfile
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
├── database/
│   └── init.sql                   # Schema + seed data
├── nginx/
│   ├── nginx.conf
│   └── conf.d/default.conf
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Quick Start (Local with Docker)

### Prerequisites
- Docker Desktop ≥ 24.x
- Docker Compose ≥ 2.x

### 1. Clone the repo
```bash
git clone https://github.com/ziabintahir/my-portfolio.git
cd my-portfolio
```

### 2. Create environment files
```bash
# Root .env (for docker-compose)
cp .env.example .env

# Backend .env
cp backend/.env.example backend/.env
# Edit backend/.env — set JWT_SECRET, email credentials, etc.

# Frontend .env
cp frontend/.env.example frontend/.env
```

### 3. Generate a JWT secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Paste the output into backend/.env → JWT_SECRET
```

### 4. Build and start all services
```bash
docker-compose up --build -d
```

### 5. Verify everything is running
```bash
docker-compose ps
# All 4 services should be "healthy"

curl http://localhost:5000/api/v1/health
# → { "status": "healthy", "services": { "api": "ok", "database": "ok" } }
```

### 6. Access the app
| Service      | URL                          |
|-------------|-------------------------------|
| Portfolio   | http://localhost              |
| Admin Login | http://localhost/admin/login  |
| API         | http://localhost/api/v1       |
| Swagger     | http://localhost/api/docs     |

### Default admin credentials
```
Username: zia_admin
Password: Admin@1234
```
⚠️ **Change the password immediately via the Admin Dashboard.**

---

## Local Development (without Docker)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in DB credentials pointing to your local MySQL
npm run dev          # nodemon — hot reload on :5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
npm run dev          # Next.js dev server on :3000
```

### MySQL
Create the database manually:
```sql
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;
```

Then run the schema:
```bash
mysql -u portfolio_user -p portfolio_db < database/init.sql
```

---

## API Reference

Base URL: `https://portfolio-api.render.com/api/v1`

### Authentication

| Method | Endpoint               | Auth | Description          |
|--------|------------------------|------|----------------------|
| POST   | `/auth/login`          | ✗    | Admin login → JWT    |
| GET    | `/auth/me`             | ✓    | Get current admin    |
| PATCH  | `/auth/change-password`| ✓    | Change password      |

**Login request:**
```json
POST /auth/login
{
  "username": "zia_admin",
  "password": "Admin@1234"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR...",
    "user": { "id": 1, "username": "zia_admin", "email": "..." }
  }
}
```

### Projects

| Method | Endpoint         | Auth | Description              |
|--------|-----------------|------|--------------------------|
| GET    | `/projects`      | ✗    | List all projects        |
| GET    | `/projects/:id`  | ✗    | Single project           |
| POST   | `/projects`      | ✓    | Create project (admin)   |
| PUT    | `/projects/:id`  | ✓    | Update project (admin)   |
| DELETE | `/projects/:id`  | ✓    | Delete project (admin)   |

**Query params:** `?category=backend` · `?featured=true`

**Create project body:**
```json
{
  "title": "Portfolio API",
  "description": "REST API with JWT auth and MySQL",
  "tech_stack": ["Node.js", "Express", "MySQL", "Docker"],
  "github_url": "https://github.com/...",
  "live_url": "https://myapp.com",
  "category": "backend",
  "featured": true,
  "sort_order": 1
}
```

### Contact

| Method | Endpoint              | Auth | Description              |
|--------|-----------------------|------|--------------------------|
| POST   | `/contact`            | ✗    | Submit contact message   |
| GET    | `/contact`            | ✓    | List messages (admin)    |
| PATCH  | `/contact/:id/read`   | ✓    | Mark as read (admin)     |
| DELETE | `/contact/:id`        | ✓    | Delete message (admin)   |

### Skills

| Method | Endpoint        | Auth | Description    |
|--------|----------------|------|----------------|
| GET    | `/skills`       | ✗    | All skills     |
| POST   | `/skills`       | ✓    | Add skill      |
| DELETE | `/skills/:id`   | ✓    | Delete skill   |

### Health

```bash
GET /health
→ { "status": "healthy", "uptime": 123.4, "services": { "api": "ok", "database": "ok" } }
```

---

## Database Schema

```sql
-- 4 tables:
-- admin_users    — admin credentials (bcrypt)
-- projects       — portfolio projects (JSON tech_stack)
-- contact_messages — contact form submissions
-- skills         — technical skills with proficiency levels
```

Full schema: [`database/init.sql`](database/init.sql)

---

## Deployment Guide

### Frontend → Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. From frontend/ directory
cd frontend
vercel

# 3. Set environment variable in Vercel dashboard:
# NEXT_PUBLIC_API_URL = https://your-backend.render.com/api/v1
```

### Backend → Render

1. Go to [render.com](https://render.com) → New → **Web Service**
2. Connect your GitHub repo
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node 20
4. Add all environment variables from `backend/.env.example`
5. Add a **MySQL** database on Render (or use PlanetScale/Railway)
6. Copy the external DB credentials into the backend service env vars

### Full Stack → AWS EC2 (Production)

```bash
# On your EC2 instance (Ubuntu 22.04):
sudo apt update && sudo apt install -y docker.io docker-compose-plugin git

git clone https://github.com/ziabintahir/my-portfolio.git
cd my-portfolio

cp .env.example .env
cp backend/.env.example backend/.env
# Edit both .env files with production values

# Build and launch
sudo docker compose up -d --build

# SSL with Let's Encrypt (Certbot)
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

### CI/CD — GitHub Actions

Add these **repository secrets**:

| Secret                          | Where to get it                         |
|---------------------------------|-----------------------------------------|
| `VERCEL_TOKEN`                  | Vercel → Account Settings → Tokens      |
| `VERCEL_ORG_ID`                 | `vercel link` then check `.vercel/project.json` |
| `VERCEL_PROJECT_ID`             | Same as above                           |
| `RENDER_DEPLOY_HOOK_BACKEND`    | Render → Service → Settings → Deploy Hook |
| `NEXT_PUBLIC_API_URL`           | Your backend URL                        |

On every push to `main`:
1. Backend tests run
2. Docker images build and push to GitHub Container Registry
3. Frontend deploys to Vercel
4. Backend deploys to Render

---

## Security Checklist

- ✅ Passwords hashed with bcrypt (cost factor 12)
- ✅ JWT with configurable expiry
- ✅ Helmet.js security headers
- ✅ CORS with explicit origin whitelist
- ✅ Global rate limiting (200 req/15min)
- ✅ Auth endpoint rate limiting (10 attempts/15min)
- ✅ Contact form rate limiting (5 messages/hour)
- ✅ Input validation with express-validator
- ✅ Parameterised SQL queries (no raw string concatenation)
- ✅ Non-root Docker user
- ✅ .env files excluded from version control
- ✅ Admin routes hidden from search engines (robots)

---

## Common Commands

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart a service
docker-compose restart backend

# Stop everything
docker-compose down

# Stop and remove volumes (reset DB)
docker-compose down -v

# Run DB migrations manually
docker exec -i portfolio_db mysql -u portfolio_user -p portfolio_db < database/init.sql

# Generate password hash (for manual admin creation)
node -e "const b=require('bcryptjs');b.hash('YourPassword',12).then(console.log)"

# Shell into backend container
docker exec -it portfolio_backend sh

# Shell into MySQL
docker exec -it portfolio_db mysql -u portfolio_user -p portfolio_db
```

---

## Interview Talking Points

This project demonstrates:

1. **REST API design** — versioned routes (`/api/v1`), proper HTTP methods/status codes, consistent JSON response envelope
2. **Auth flow** — bcrypt password hashing, JWT signing/verification, token-based protected routes
3. **Database design** — normalised schema, connection pooling, parameterised queries
4. **Docker orchestration** — multi-stage builds, health checks, service dependencies, named volumes
5. **Security** — defence-in-depth (Helmet, CORS, rate limiting, input validation, non-root containers)
6. **CI/CD** — GitHub Actions linting, testing, Docker image build/push, Vercel + Render deploy
7. **Error handling** — centralised middleware, structured logging with Winston, graceful startup
8. **Nginx** — reverse proxy, upstream load balancing, gzip, security headers, rate limiting

---

## Author

**Zia Bin Tahir**
- 🌐 [ziaai.vercel.app](https://ziaai.vercel.app)
- 💼 [linkedin.com/in/ziabintahir](https://linkedin.com/in/ziabintahir)
- 🐙 [github.com/ziabintahir](https://github.com/ziabintahir)
- 📧 ziabintahir@gmail.com

---

## License

MIT © 2024 Zia Bin Tahir
