<div align="center">

# SkillRise

**A full-stack e-learning platform with AI-powered features, built for students and educators.**

[![CI](https://github.com/pv-pushkarverma/SkillRise/actions/workflows/build.yml/badge.svg)](https://github.com/pv-pushkarverma/SkillRise/actions/workflows/build.yml)
[![Deploy](https://github.com/pv-pushkarverma/SkillRise/actions/workflows/deploy.yml/badge.svg)](https://github.com/pv-pushkarverma/SkillRise/actions/workflows/deploy.yml)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

</div>

---

## Features

### For Students
- **Course Catalog** — Browse, search, and filter courses by category
- **Stripe Payments** — Secure checkout with Stripe embedded payment UI
- **Video Player** — Chapter-based course player with progress tracking
- **AI Chat** — Groq-powered assistant for learning support
- **AI Roadmap** — Personalized learning roadmap generated from your profile
- **Quizzes** — Auto-generated chapter quizzes with explanations
- **Analytics** — Time tracking and learning progress dashboard
- **Community** — Groups, discussion posts, upvotes, and threaded replies
- **Dark Mode** — Full dark/light theme with system preference detection

### For Educators
- **Course Builder** — Multi-chapter, multi-lecture course creation with rich text
- **Media Uploads** — Thumbnail and content uploads via Cloudinary
- **Dashboard** — Enrollment stats, revenue, and quiz insights
- **Student Management** — View enrolled students per course
- **Educator Applications** — Apply to become an educator via the platform

### For Admins
- **Dashboard** — Platform-wide stats (students, educators, revenue, enrollments, courses, pending applications) with charts — top courses by enrollment bar chart and weekly revenue area chart
- **Courses** — Full course list with educator info, enrollment count, revenue per course, and published/draft status
- **Users** — Separate Students and Educators tabs; students show enrolled course count, educators show courses created count
- **Purchases** — Full purchase history with status filter (All / Completed / Pending / Failed)
- **Educator Applications** — Review, approve, or reject educator applications with optional rejection reason

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS |
| Auth | Clerk (webhooks for sync) |
| Payments | Stripe (embedded checkout + webhooks) |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| AI | Groq SDK (LLaMA models) |
| Media | Cloudinary |
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions |

---

## Project Structure

```
skillrise/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Shared UI components
│   │   ├── context/         # AppContext, ThemeContext
│   │   ├── hooks/           # Custom hooks (useTimeTracker, etc.)
│   │   └── pages/
│   │       ├── student/     # Home, CourseDetails, Player, AIChat, Roadmap...
│   │       ├── educator/    # Dashboard, AddCourse, MyCourses...
│   │       └── admin/       # AdminDashboard, AdminCourses, AdminUsers, AdminPurchases, EducatorApplications
│   ├── Dockerfile
│   └── nginx.conf
├── server/                  # Express API
│   ├── configs/             # MongoDB, Cloudinary setup
│   ├── controllers/         # Route handlers (admin, educator, course, user, webhooks)
│   ├── middlewares/         # protectAdmin, protectEducator auth guards
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   ├── seed.js              # Database seeder
│   └── Dockerfile
├── .github/
│   └── workflows/
│       ├── ci.yml           # PR checks (lint, format, build)
│       └── deploy.yml       # Push to Docker Hub on merge to main
└── docker-compose.yml       # For running the app via Docker
```

---

## Getting Started (Developer Setup)

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Accounts: [Clerk](https://clerk.com), [Stripe](https://stripe.com), [Cloudinary](https://cloudinary.com), [Groq](https://console.groq.com)

### 1. Clone the repo

```bash
git clone https://github.com/pv-pushkarverma/skillrise.git
cd skillrise
```

### 2. Configure environment variables

**`server/.env`**
```env
MONGODB_URI=mongodb://localhost:27017
CURRENCY=INR

CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret

STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

GROQ_CHATBOT_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile
```

**`client/.env`**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_BACKEND_URL=http://localhost:3000
```

### 3. Install dependencies

```bash
# Frontend
cd client && npm install

# Backend
cd ../server && npm install
```

### 4. Seed the database (optional)

Populates the database with demo educators, students, courses, quizzes, community groups, posts, and replies.

```bash
cd server
npm run seed
```

### 5. Run locally

```bash
# Terminal 1 — Backend
cd server
npm run server   # nodemon with hot reload

# Terminal 2 — Frontend
cd client
npm run dev      # Vite dev server → http://localhost:5173
```

### 6. Set up webhooks (for auth + payments to work locally)

Use [Stripe CLI](https://stripe.com/docs/stripe-cli) and [ngrok](https://ngrok.com) or [Clerk's dashboard](https://dashboard.clerk.com) to forward webhooks to `http://localhost:3000`:

| Webhook | Endpoint |
|---|---|
| Clerk user events | `POST /clerk` |
| Stripe payment events | `POST /stripe` |

---

## Running with Docker

### Build & run everything locally

```bash
# Add VITE_ vars to root .env (see client/.env above)
cp client/.env .env

docker compose up --build
```

- Frontend → `http://localhost`
- Backend → `http://localhost:3000`

### Useful Docker commands

```bash
# Run in background
docker compose up --build -d

# View logs
docker compose logs -f

# Run the seeder inside the container
docker compose exec server node seed.js

# Stop everything
docker compose down
```

---

## CI/CD Pipeline

### On Pull Request → `main` or `dev`

Both jobs run in parallel via [`.github/workflows/build.yml`](.github/workflows/build.yml):

| Job | Steps |
|---|---|
| **Client** | `npm ci` → ESLint → Prettier check → Vite build |
| **Server** | `npm ci` → Prettier check |

### On Push → `main`

Both Docker images are built and pushed to Docker Hub via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

```
pushkarverma/skillrise-client:latest
pushkarverma/skillrise-server:latest
```

### Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

```
DOCKER_USERNAME
DOCKER_PASSWORD
VITE_CLERK_PUBLISHABLE_KEY
VITE_STRIPE_PUBLISHABLE_KEY
VITE_BACKEND_URL
```

---

## API Routes

| Prefix | Auth | Description |
|---|---|---|
| `GET /` | — | Health check |
| `POST /clerk` | Clerk signature | User sync webhook |
| `POST /stripe` | Stripe signature | Payment fulfillment webhook |
| `/api/course` | Public | Browse, search, and fetch course details |
| `/api/user` | Clerk (any user) | Enroll, track progress, AI chat, roadmap, analytics |
| `/api/educator` | Educator role | Course creation, dashboard, student management |
| `/api/admin` | Admin role | Platform stats, charts, users, courses, purchases, applications |
| `/api/community` | Clerk (any user) | Groups, posts, upvotes, threaded replies |
| `/api/quiz` | Clerk (any user) | Quiz generation and result submission |

---

## Contributing

1. Fork the repository
2. Create a feature branch from `dev` — `git checkout -b feature/your-feature`
3. Commit your changes
4. Open a pull request targeting `dev` — CI checks run automatically
5. Once approved, changes are merged to `dev`, then to `main` for deployment

---

<div align="center">

Made with ☕ by [Pushkar Verma](https://github.com/pv-pushkarverma)

</div>
