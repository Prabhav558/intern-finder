# 🚀 OpportuNest - Complete Setup Instructions

This document provides step-by-step instructions to get OpportuNest running locally.

## 📋 Prerequisites

Ensure you have installed:

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **Python 3.9+** - [Download](https://www.python.org/)
3. **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
4. **Git** - [Download](https://git-scm.com/)

## ✅ Quick Start (5 Steps)

### Step 1: Clone Repository & Install Dependencies

```bash
cd SEPM

# Option A: Install all at once (recommended)
npm install --workspaces

# Option B: Install individually
cd backend && npm install
cd ../frontend && npm install
cd ../database && npm install
cd ../ai-service && pip install -r requirements.txt
```

### Step 2: Start Database Containers

```bash
cd docker
docker-compose up -d

# Verify containers are running
docker-compose ps

# You should see:
# - opportunest-db (PostgreSQL)
# - opportunest-redis (Redis)
# - opportunest-search (Meilisearch)
```

### Step 3: Setup Database Schema

```bash
cd ../database

# Create database tables
npx prisma migrate dev --name init

# (Optional) Load demo data
npx prisma db seed
```

### Step 4: Start Backend Services

Open **3 separate terminals** and run:

**Terminal 1 - Backend API:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - AI Service:**
```bash
cd ai-service
python -m venv venv

# Activate virtual environment:
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m spacy download en_core_web_lg  # First time only
uvicorn main:app --reload --port 8000
# Runs on http://localhost:8000
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### Step 5: Open in Browser

Visit: **http://localhost:3000**

---

## 🔧 Service Status

Once everything is running, verify:

| Service | URL | Expected Response |
|---|---|---|
| Frontend | http://localhost:3000 | Landing page |
| Backend | http://localhost:5000/health | `{"status":"ok"}` |
| AI Service | http://localhost:8000/health | `{"status":"ok","service":"ai-service"}` |
| Prisma Studio | http://localhost:5555 | Database UI |

---

## 📝 Configuration

### Environment Variables

1. **Copy .env.example to .env.local:**
```bash
cp .env.example .env.local
```

2. **Edit .env.local** with your settings:
```env
# Database (should work as-is)
DATABASE_URL=postgresql://opportunest:opportunest_dev@localhost:5432/opportunest
REDIS_URL=redis://localhost:6379

# Frontend
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000

# AI Service
AI_SERVICE_URL=http://localhost:8000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

### Default Credentials

After seeding database:

**Admin Account:**
- Email: `admin@opportunest.com`
- Password: `Admin@123`

**Demo Student Accounts:**
- Email: `student1@example.com` - `student3@example.com`
- Password: `Student@123`

---

## 🛠️ Common Issues & Solutions

### Issue: Docker Containers Won't Start

```bash
# Check Docker status
docker ps

# Restart Docker Desktop and retry
docker-compose down
docker-compose up -d

# View logs
docker-compose logs postgres
```

### Issue: Port Already in Use

```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Similarly for ports 5000, 8000, 5432, 6379, 7700
```

### Issue: npm install Fails (Network Error)

```bash
# Try clearing npm cache
npm cache clean --force

# Retry installation
npm install
```

### Issue: Prisma Client Not Found

```bash
cd database
npx prisma generate
```

### Issue: Python Virtual Environment Not Working

```bash
cd ai-service

# Remove old venv
rm -r venv

# Create fresh virtual environment
python -m venv venv

# Activate
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

## 📚 Documentation

- **[README.md](./README.md)** — Project overview & features
- **[docs/setup.md](./docs/setup.md)** — Detailed setup guide
- **[docs/api.md](./docs/api.md)** — API endpoint reference
- **[plan.md](./plan.md)** — Complete project specification
- **[AI.md](./AI.md)** — Implementation action items

---

## 🎯 What's Running?

### Frontend (Next.js)
- Landing page with features
- Login/Register pages (placeholder)
- Navigation and responsive layout
- Dark mode support (Tailwind CSS)

### Backend (Express)
- REST API with TypeScript
- Socket.io for real-time updates
- Database connection via Prisma
- Middleware setup (CORS, JSON, etc.)

### AI Service (FastAPI)
- AI recommendation engine placeholder
- Resume analyzer placeholder
- Eligibility checker placeholder
- Ready for implementation

### Database (PostgreSQL)
- 13 tables for users, opportunities, applications
- Prisma ORM for type-safe queries
- Demo data seeded

---

## 🚀 Next Steps

1. **Create User Accounts:**
   - Frontend: Go to http://localhost:3000/register
   - Or use seeded admin/student accounts

2. **Test API Endpoints:**
   - Frontend: http://localhost:3000/health
   - Backend: http://localhost:5000/health
   - Docs: [docs/api.md](./docs/api.md)

3. **View Database:**
   ```bash
   cd database
   npx prisma studio
   # Opens at http://localhost:5555
   ```

4. **Start Development:**
   - Follow tasks in [AI.md](./AI.md)
   - Begin with Phase 1: Authentication system
   - See [plan.md](./plan.md) for technical details

---

## 💡 Development Tips

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes, commit
git add .
git commit -m "Add feature description"

# Push to repository
git push origin feature/feature-name
```

### Code Formatting
```bash
# Frontend
cd frontend && npm run format

# Backend
cd backend && npm run format
```

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

---

## 📞 Need Help?

1. Check [Troubleshooting](#-common-issues--solutions)
2. Read relevant documentation in `/docs`
3. Check [plan.md](./plan.md) for architecture details
4. Review error messages in terminal output

---

**Happy coding! 🎉**

For detailed documentation, see [docs/](./docs/) folder.
