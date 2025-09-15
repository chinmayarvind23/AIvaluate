# AI-Powered Course Platform

Automated grading and feedback for programming courses, built with a microservices stack (Node.js/Express, React, Docker) and OpenAI’s Assistants API. The included final report covers architecture, evaluation, and results.

## Highlights
- Automated evaluation with OpenAI Assistants API → **~70% reduction in grading time** and higher grading consistency.
- **Microservices** with JWT auth and **role-based access control** (Admin/Instructor/Student) for modular, fault-isolated deployments.
- **Test-driven development** across services → **~90% coverage** and **~40% fewer post-deploy bugs**.

## Features
- **Gateway/API (Express):** request routing, rate limits, schema validation.
- **Auth service:** user management, JWTs, RBAC policies.
- **Grading service:** orchestrates Assistants API runs, rubric-aligned feedback, instructor overrides.
- **Courses & Submissions services:** assignment lifecycle, storage, and audit trails.
- **Web UI (React):** instructor dashboards, student portals, feedback review.
- **CI/CD & Observability:** containerized builds, automated tests, logs/metrics.

## Tech stack
- JavaScript/TypeScript

- Node.js

- Express

- React

- Docker

- OpenAI Assistants API

- JWT/RBAC

- PostgreSQL

---

## Installation & Setup

### 1) Prerequisites
- **Docker Desktop** (running and initialized)
- **Git** (or **GitHub Desktop**)
- **Visual Studio Code** (VS Code)
- **OpenAI API key** (paid account required)

### 2) Clone the repository
**Option A — Git**
```bash
git clone https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8.git
cd team-8-capstone-team-8
```
**Option B — GitHub Desktop**
- Open the repo page, click **Code → Copy URL**, then in GitHub Desktop choose **Clone a repository → URL**, paste, and select a local folder.

Open the project folder in **VS Code**.

### 3) Configure environment
You will need your **OpenAI API key** available to the grading services.

- Find the `.env` files referenced in `app/docker-compose.yml` (search for `.env` inside that file).
- Ensure the `.env` files for **backend-ai** and **backend-eval** under `app/aivaluate/` contain:
```
OPENAI_API_KEY=<your-secret-key>   # no quotes
```

> Tip: In VS Code, press **Ctrl/Cmd + F** in `docker-compose.yml` and search for `.env` to see all env file paths.

If you prefer a single template, you can also create a root `.env` to share common values:

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Auth / Security
JWT_SECRET=change_me
TOKEN_EXPIRY=1d

# Database / Storage (adjust if your compose file uses different values)
DATABASE_URL=postgresql://user:pass@db:5432/courses
FILE_BUCKET_PATH=/data/submissions
```

### 4) Build & run (Docker)
From the repository root:
```bash
docker compose up --build
```
- Wait until all services report **“Server is running on PORT …”** (expected ports for backend components include **9000**, **3000**, **6000**, **4000**).
- Containers should appear **green** in Docker Desktop when healthy.

### 5) Access the app
- **Student:**  http://localhost:5173/stu/login  
- **Instructor:** http://localhost:5173/eval/login  
- **Admin:**  http://localhost:5173/admin/login

**Test accounts:**  
Use any of the following emails with password **`pass123`**:
- `testprof@email.com`
- `testta@email.com`
- `admin@email.com`
- `chinmay@email.com`

---

## Local runs

```bash
# Any service
cd services/<service-name>
npm i
npm run dev

# Web
cd web
npm i
npm run dev   # typically serves at http://localhost:5173
```

### Tests & quality
```bash
npm test
npm run coverage
npm run lint && npm run format
```

---

## Roles & permissions
- **Admin:** organization settings, user/role management.  
- **Instructor:** create assignments, trigger/approve grades, export analytics.  
- **Student:** submit work, view rubric-aligned feedback, request regrade.

## Safety & cost controls
- Deterministic prompts + rubric checks for consistency; human-in-the-loop review.
- Assignment token caps and batching to manage inference costs.
````
