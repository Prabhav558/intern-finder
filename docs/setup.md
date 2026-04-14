# 🚀 Local Development Setup Guide

Complete step-by-step instructions to set up OpportuNest locally.

## Prerequisites

Ensure you have installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.9+ ([Download](https://www.python.org/downloads/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** ([Download](https://git-scm.com/))

Verify installations:

```bash
node --version   # v18+
npm --version    # 9+
python --version # 3.9+
docker --version # 20+
git --version    # 2.0+
```

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd SEPM
```

## Step 2: Install Dependencies

### Using npm workspaces (Recommended)

```bash
npm install --workspaces
```

This installs dependencies for all packages:
- `frontend`
- `backend`
- `database`

## Step 3: Start Docker Containers

### Start PostgreSQL, Redis, and Meilisearch

```bash
cd docker
docker-compose up -d
```

### Verify containers are running

```bash
docker-compose ps
```

You should see:
- `opportunest-db` (PostgreSQL) on port 5432
- `opportunest-redis` (Redis) on port 6379
- `opportunest-search` (Meilisearch) on port 7700

### Health check

```bash
# Check database
psql -h localhost -U opportunest -d opportunest

# Check Redis
redis-cli ping
# Should return: PONG

# Check Meilisearch
curl http://localhost:7700/health
```

## Step 4: Setup Database

```bash
cd ../database

# Run migrations (creates tables)
npx prisma migrate dev --name init

# Optional: Seed demo data
npx prisma db seed

# View database UI
npx prisma studio  # Opens browser at http://localhost:5555
```

## Step 5: Start Backend

### Terminal 1: Backend Server

```bash
cd ../backend

# Install dependencies (if not done via workspaces)
npm install

# Create backend .env
cp ../.env.example .env
# Edit .env with your values (especially for Google OAuth)

# Start development server
npm run dev
```

Backend should start on **http://localhost:5000**

Test health:
```bash
curl http://localhost:5000/health
```

## Step 6: Start AI Service

### Terminal 2: Python FastAPI

```bash
cd ../ai-service

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Download spaCy model (first time only)
python -m spacy download en_core_web_lg

# Create .env
cp ../.env.example .env

# Start FastAPI server
uvicorn main:app --reload --port 8000
```

AI Service should start on **http://localhost:8000**

Test health:
```bash
curl http://localhost:8000/health
```

## Step 7: Start Frontend

### Terminal 3: Next.js App

```bash
cd ../frontend

# Install dependencies (if not done via workspaces)
npm install

# Create frontend .env
cp ../.env.example .env.local

# Start development server
npm run dev
```

Frontend should start on **http://localhost:3000**

## Step 8: Verify Everything Works

Open browser and visit:

1. **Frontend**: http://localhost:3000
   - Should see landing page
   
2. **Backend**: http://localhost:5000/health
   - Should return `{"status":"ok"}`
   
3. **AI Service**: http://localhost:8000/health
   - Should return `{"status":"ok","service":"ai-service"}`
   
4. **Prisma Studio**: http://localhost:5555
   - View/edit database

## 📝 Environment Variables

Create `.env` files in each service:

### Backend `.env`
```env
DATABASE_URL=postgresql://opportunest:opportunest_dev@localhost:5432/opportunest
REDIS_URL=redis://localhost:6379
NEXTAUTH_SECRET=dev-secret-key
NEXT_PUBLIC_API_URL=http://localhost:5000
JWT_SECRET=dev-jwt-secret
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
```

### AI Service `.env`
```env
DATABASE_URL=postgresql://opportunest:opportunest_dev@localhost:5432/opportunest
REDIS_URL=redis://localhost:6379
AI_SERVICE_URL=http://localhost:8000
```

## 🐛 Troubleshooting

### Issue: Database connection refused

**Solution:**
```bash
# Check if container is running
docker-compose ps

# Start container
docker-compose up -d postgres

# Check logs
docker-compose logs postgres
```

### Issue: Port already in use

**Solution:**
```bash
# Find process using port
lsof -i :3000  # Frontend
lsof -i :5000  # Backend
lsof -i :8000  # AI Service

# Kill process (replace PID)
kill -9 <PID>
```

### Issue: Module not found errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# If using workspaces
npm install --workspaces
```

### Issue: Prisma client out of sync

**Solution:**
```bash
cd database
npx prisma generate
```

### Issue: Python virtual environment not activating

**Solution:**
```bash
# For Windows:
cd ai-service
python -m venv venv
venv\Scripts\activate

# For macOS/Linux:
python3 -m venv venv
source venv/bin/activate
```

## 📚 Common Commands

### Database

```bash
# View database UI
npx prisma studio

# Create migration
npx prisma migrate dev --name add_feature

# Reset database (careful!)
npx prisma migrate reset

# Seed database
npx prisma db seed
```

### Backend

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run linter
npm test         # Run tests
```

### Frontend

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run linter
```

### Docker

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f postgres

# Restart services
docker-compose restart
```

## ✅ Setup Complete!

You should now have:
- ✅ PostgreSQL running (port 5432)
- ✅ Redis running (port 6379)
- ✅ Meilisearch running (port 7700)
- ✅ Backend API running (port 5000)
- ✅ AI Service running (port 8000)
- ✅ Frontend app running (port 3000)

Visit http://localhost:3000 to start using OpportuNest!

## Next Steps

1. Create a user account at http://localhost:3000/register
2. Complete your student profile
3. Browse opportunities
4. Check out admin panel at http://localhost:3000/admin

---

Need help? Check [Troubleshooting](./troubleshooting.md)
