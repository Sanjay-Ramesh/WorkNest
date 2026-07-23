# WorkNest 🏢

> SaaS-style Workforce Management Platform — Live Deployed

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-10b981)](https://work-nest-iota-nine.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Railway-0f172a)](https://worknest-production-dcf8.up.railway.app)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248)](https://mongodb.com)
[![Tests](https://img.shields.io/badge/E2E%20Tests-13%2F13%20Passing-10b981)](https://playwright.dev)

---

## 🌐 Live URL's

| Layer | URL |
|---|---|
| **Frontend** | https://work-nest-iota-nine.vercel.app |
| **Backend** | https://worknest-production-dcf8.up.railway.app |
| **Database** | MongoDB Atlas — AWS Mumbai (ap-south-1) |

### Demo Accounts

| Role | Email | Password |
|---|---|---|
| Employee | emp@worknest.com | demo123 |
| Manager | manager@worknest.com | demo123 |
| HR Admin | hr@worknest.com | demo123 |

---

## 🛠️ Tech Stack

### Backend
- Java 17 + Spring Boot 3.5.14
- MongoDB Atlas (Spring Data MongoDB)
- Spring Security + JWT Authentication (jjwt 0.12.3)
- BCrypt password hashing
- JavaMailSender + Gmail SMTP (@Async email notifications)
- Maven

### Frontend
- React + Vite
- Tailwind CSS
- Axios + React Router DOM
- JWT token storage + Protected routes
- Role-based routing (Employee / Manager / HR Admin)

### Deployment
- Backend → Railway (primary) · also containerized with Docker and deployable to Render
- Frontend → Vercel
- Database → MongoDB Atlas (M0 Free Tier)

### Security
- GitGuardian connected
- ggshield pre-commit hooks
- application.properties excluded from git
- Playwright E2E security checks

---

## 👥 Roles & Access

| Role | What they can do |
|---|---|
| **Employee** | Apply leave, view own balance, track approval status |
| **Manager** | Approve/reject team leaves, view own department only, apply own leave |
| **HR Admin** | Company-wide dashboard, approve manager leaves, analytics |
| **Super Admin (V2)** | System configuration (V2) |

---

## ✅ Modules

- [x] Auth + JWT (register, login, token validation)
- [x] Employee self-service (apply leave, view balance, track status)
- [x] Manager dashboard (approve/reject, department filter)
- [x] HR Admin dashboard (analytics, department breakdown, balance summary)
- [x] Email notifications (async, triggered on approve/reject)
- [x] Profile page (role-aware, excludes password)
- [x] Leave validation (balance check, cross-year prevention, date picker bounds)
- [ ] Super Admin panel (V2)
- [ ] AI insights — Gemini API (V2)
- [ ] Export PDF/CSV reports (V2)

---

## 🚀 Local Setup

### Prerequisites
- Java 17+
- Node.js 22+ / npm 10+
- MongoDB Atlas account (free tier)
- Gmail account with App Password

### Backend

```bash
cd worknest_backend
cp application-example.properties src/main/resources/application.properties
# Fill in your MongoDB URI, JWT secret, Gmail credentials
./mvnw spring-boot:run
```

> **Note:** `mvnw` needs to be executable. If you hit a `Permission denied` error, run `chmod +x mvnw` (Linux/Mac/Git Bash) before starting.

### Frontend

```bash
cd worknest_frontend
npm install
# Create .env file
echo "VITE_API_URL=http://localhost:8080" > .env
npm run dev
```

---

## 🐳 Docker Deployment (Backend)

The backend includes a multi-stage `Dockerfile` (build stage compiles the jar, runtime stage runs it on a lighter JRE image) for deploying anywhere that supports containers — used to deploy to Render as a secondary environment.

```bash
cd worknest_backend
docker build -t worknest-backend .
docker run -p 8080:8080 --env-file .env worknest-backend
```

Required environment variables at container runtime — see [Environment Variables](#-environment-variables) below.

---

## 🧪 Running E2E Tests

```bash
cd worknest_backend
npx playwright test
# Expected: 13/13 passing
```

---

## 📦 Project Structure

```
WorkNest/
├── worknest_backend/          # Spring Boot application
│   ├── src/main/java/com/worknest/app/
│   │   ├── controller/        # REST endpoints
│   │   ├── service/           # Business logic
│   │   ├── repository/        # MongoDB repositories
│   │   ├── model/             # MongoDB documents
│   │   ├── dto/               # Request + Response DTOs
│   │   ├── config/            # Security + Mail config
│   │   └── util/              # JWT utility
│   ├── Dockerfile             # Multi-stage build for containerized deploy
│   └── application-example.properties
├── worknest_frontend/         # React application
│   ├── src/
│   │   ├── pages/             # Login, Dashboard, MyLeaves, etc.
│   │   ├── components/        # Sidebar, ProtectedRoute
│   │   └── context/           # ThemeContext
├── README.md
└── DEVLOG.md
```

---

## 🔒 Environment Variables

### Backend (Railway / Render / Docker)
```
SPRING_DATA_MONGODB_URI=
JWT_SECRET=
JWT_EXPIRATION=86400000
SPRING_MAIL_USERNAME=
SPRING_MAIL_PASSWORD=
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
FRONTEND_URL=
```

> `FRONTEND_URL` must exactly match the deployed frontend origin (e.g. `https://work-nest-iota-nine.vercel.app`) — Spring Security's CORS config only allows requests from this exact URL. Vercel preview/deployment-specific URLs will be blocked unless added separately.

### Frontend (Vercel)
```
VITE_API_URL=
```

---

## 📝 DEVLOG

See [DEVLOG.md](./DEVLOG.md) for full build journal — phase by phase progress, bugs fixed, and concepts learned.

---

Built by [Sanjay Ramesh](https://github.com/Sanjay-Ramesh) — June 2026
