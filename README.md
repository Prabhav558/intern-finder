# 📱 OpportuNest — Student Opportunity Portal

> A comprehensive platform that consolidates internships, hackathons, scholarships, and opportunities for college students with AI-powered recommendations, resume analysis, and smart reminders.

## 🌟 Key Features

- **🔐 Authentication**: JWT + Google OAuth sign-in
- **🎯 AI Recommendations**: Personalized opportunity feed powered by TF-IDF + collaborative filtering
- **📄 Resume Analyzer**: ATS scoring, skill extraction, and improvement suggestions
- **✅ Eligibility Checker**: Automatic eligibility verification before applying
- **📢 Smart Reminders**: Email, SMS, and push notifications for deadlines
- **🏆 Gamification**: Badges, streaks, and engagement rewards
- **🕷️ Opportunity Scraper**: Auto-aggregates from Internshala, Unstop, LinkedIn, etc.
- **💬 Community Forum**: Peer discussion and experience sharing
- **📊 Admin Dashboard**: Full analytics, opportunity management, user tracking

## 🏗️ Project Structure

```
OpportuNest/
├── frontend/          # Next.js 14 React app
├── backend/           # Express.js REST API
├── ai-service/        # Python FastAPI microservice
├── database/          # Prisma ORM + migrations
├── docker/            # Docker Compose for local dev
├── docs/              # Documentation
├── plan.md            # Complete project specification
└── AI.md              # Implementation action items
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (Backend + Frontend)
- **Python** 3.9+ (AI Service)
- **Docker** (for databases)
- **npm** or **yarn** (package manager)

### 1️⃣ Clone & Setup

```bash
git clone <repo-url>
cd SEPM
npm install --workspaces  # Install all dependencies
```

### 2️⃣ Start Databases (Docker)

```bash
cd docker
docker-compose up -d

# Wait for containers to be healthy
docker-compose ps
```

This starts:
- **PostgreSQL** on port 5432
- **Redis** on port 6379
- **Meilisearch** on port 7700

### 3️⃣ Setup Database Schema

```bash
cd ../database
npx prisma migrate dev --name init
npx prisma db seed  # Optional: load demo data
```

### 4️⃣ Start Backend (Express)

```bash
cd ../backend
npm install
npm run dev
# Backend runs on http://localhost:5000
```

### 5️⃣ Start AI Service (FastAPI)

```bash
cd ../ai-service
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# AI Service runs on http://localhost:8000
```

### 6️⃣ Start Frontend (Next.js)

```bash
cd ../frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### 7️⃣ Open the app

Navigate to **http://localhost:3000** in your browser.

---

## 🔧 Environment Variables

Copy `.env.example` to `.env.local` and update values:

```bash
cp .env.example .env.local
```

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: NextAuth session secret
- `GOOGLE_CLIENT_ID/SECRET`: Google OAuth credentials (optional)
- `CLOUDINARY_URL`: Image storage (optional)

---

## 📚 API Documentation

API endpoints are organized by feature:

- **Auth**: `/api/auth/*` (register, login, logout, refresh)
- **Students**: `/api/students/*` (profile, applications, bookmarks)
- **Opportunities**: `/api/opportunities/*` (list, detail, apply)
- **Admin**: `/api/admin/*` (dashboard, management)
- **AI**: `/ai/*` (recommendations, resume analysis, eligibility)

See [API Reference](./docs/api.md) for complete endpoint details.

---

## 🧪 Testing

### Unit Tests
```bash
cd backend
npm test
```

### E2E Tests
```bash
cd frontend
npm run test:e2e
```

### Load Testing
```bash
npm run test:load
```

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Backend (Railway/Render)
```bash
# Push to Git, Railway/Render auto-deploys
git push origin main
```

### Production Environment
See [Deployment Guide](./docs/deployment.md)

---

## 📖 Documentation

- **[Plan](./plan.md)** — Complete project specification & architecture
- **[Setup Guide](./docs/setup.md)** — Detailed local development setup
- **[API Reference](./docs/api.md)** — All API endpoints
- **[Architecture](./docs/architecture.md)** — System design & decisions
- **[AI/ML Details](./plan.md#13-ai--intelligence-layer)** — Algorithm specs

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Zustand |
| **Backend** | Express.js, TypeScript, Prisma ORM |
| **AI/ML** | Python, FastAPI, scikit-learn, spaCy |
| **Database** | PostgreSQL, Redis, Meilisearch |
| **Auth** | JWT, NextAuth.js, Google OAuth |
| **Files** | Cloudinary, Multer |
| **Email** | Resend, Nodemailer |
| **Notifications** | Socket.io, Firebase FCM |
| **DevOps** | Docker, GitHub Actions, Vercel, Railway |

---

## 📊 Project Phases

| Phase | Duration | Focus |
|---|---|---|
| **Phase 1** | Weeks 1-2 | Foundation: Auth, profiles, basic CRUD |
| **Phase 2** | Weeks 3-4 | Core: Apply, admin dashboard, notifications |
| **Phase 3** | Weeks 5-6 | AI: Recommendations, resume analyzer |
| **Phase 4** | Weeks 7-8 | Automation: Scraper, community, calendar |
| **Phase 5** | Weeks 9-10 | Polish: Testing, CI/CD, deployment |

**Total: ~197 action items across all phases** (See [AI.md](./AI.md))

---

## 🤝 Contributing

1. Create a branch: `git checkout -b feature/xyz`
2. Make changes and commit: `git commit -m "Add feature xyz"`
3. Push: `git push origin feature/xyz`
4. Create a Pull Request

---

## 📝 License

This project is part of a Software Engineering Project (SEPM) course.

---

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Check [Troubleshooting](./docs/troubleshooting.md)

---

**Built with ❤️ for students. Made smarter with 🤖 AI.**
