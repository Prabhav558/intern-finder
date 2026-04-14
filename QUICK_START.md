# ⚡ OpportuNest - Quick Start Guide

Get the entire project running in **5 minutes**.

---

## Prerequisites Check

Before starting, verify you have:

```bash
node --version    # Should be v18+
npm --version     # Should be v9+
python --version  # Should be v3.9+
docker --version  # Should be installed
```

---

## Step 1: Start Docker Containers (1 min)

```bash
cd docker
docker-compose up -d

# Verify all containers are running
docker-compose ps
```

**Expected Output:**
```
STATUS: Up ...
- opportunest-db (PostgreSQL on 5432)
- opportunest-redis (Redis on 6379)  
- opportunest-search (Meilisearch on 7700)
```

---

## Step 2: Setup Database (1 min)

```bash
cd ../database
npm install

# Create tables and schema
npx prisma migrate dev --name init

# Load demo data
npx prisma db seed
```

**What this does:**
- Creates all 13 database tables
- Seeds with 3 demo students + 3 demo opportunities + 4 demo badges
- Default admin: `admin@opportunest.com` / `Admin@123`

---

## Step 3: Install Dependencies (2 min)

**Option A: Install All at Once**
```bash
cd ..
npm install --workspaces
```

**Option B: Install Individually**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# AI Service
cd ../ai-service
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_lg
```

---

## Step 4: Start All Services (Parallel)

Open **3 separate terminals**:

### Terminal 1: Backend
```bash
cd backend
npm run dev
```
✅ Runs on `http://localhost:5000`

### Terminal 2: AI Service
```bash
cd ai-service

# Activate venv first (if not already)
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

uvicorn main:app --reload --port 8000
```
✅ Runs on `http://localhost:8000`

### Terminal 3: Frontend
```bash
cd frontend
npm run dev
```
✅ Runs on `http://localhost:3000`

---

## Step 5: Access the Application

Open your browser and visit:

### **http://localhost:3000** 🎉

---

## ✅ Verify Everything Works

### Health Checks
```bash
# Backend
curl http://localhost:5000/health
# Expected: {"status":"ok",...}

# AI Service
curl http://localhost:8000/health
# Expected: {"status":"ok","service":"ai-service"}

# Frontend
Open http://localhost:3000
# Expected: Landing page loads
```

### Database UI
```bash
cd database
npx prisma studio
# Opens at http://localhost:5555
```

---

## 🧪 Test the API

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPass123!",
    "name": "Test User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPass123!"
  }'
```

### 3. Get Your Profile
```bash
curl -X GET http://localhost:5000/api/students/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Browse Opportunities
```bash
curl -X GET "http://localhost:5000/api/opportunities?type=INTERNSHIP&limit=10"
```

---

## 📝 Demo Credentials

After running `npx prisma db seed`:

**Admin Account:**
- Email: `admin@opportunest.com`
- Password: `Admin@123`

**Demo Student Accounts:**
- Email: `student1@example.com` - `student3@example.com`
- Password: `Student@123`

---

## 🛠️ Common Issues

### Docker containers won't start
```bash
# Restart Docker Desktop and try again
docker-compose down
docker-compose up -d
```

### Port already in use
```bash
# Kill process on port
lsof -i :3000  # Find process
kill -9 <PID>  # Kill it
```

### npm install fails
```bash
npm cache clean --force
npm install
```

### Python venv not activating
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Prisma Client out of sync
```bash
cd database
npx prisma generate
```

---

## 📊 Project Structure

```
SEPM/
├── frontend/          # Next.js UI (localhost:3000)
├── backend/           # Express API (localhost:5000)
├── ai-service/        # FastAPI AI (localhost:8000)
├── database/          # Prisma ORM + migrations
├── docker/            # Docker Compose
├── docs/              # Documentation
└── plan.md            # Full specification
```

---

## 🚀 What's Working Now

- ✅ User authentication (JWT)
- ✅ Student profiles
- ✅ Browse opportunities
- ✅ Apply for opportunities
- ✅ Bookmark opportunities
- ✅ Track applications
- ✅ Admin dashboard (API ready)
- ✅ Database with 13 tables

---

## 📚 Next Steps

1. **Test the API** using provided curl examples
2. **Explore database** via Prisma Studio
3. **Build frontend** UI components
4. **Implement AI features** (recommendations, resume analyzer)

---

## 🔗 Useful Links

- **API Docs:** [docs/api.md](./docs/api.md)
- **Full Setup:** [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
- **Project Plan:** [plan.md](./plan.md)
- **Implementation Checklist:** [AI.md](./AI.md)

---

## ⏱️ Timing Breakdown

| Step | Time | What It Does |
|---|---|---|
| 1. Docker Compose | 30s | Start databases |
| 2. Database Setup | 30s | Migrate + seed |
| 3. Dependencies | 60s | npm + pip install |
| 4. Start Services | 60s | 3 terminal windows |
| **Total** | **~3 min** | Full stack running |

---

**Ready to go! Start with Step 1.** 🚀

Questions? Check [docs/](./docs/) or [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
