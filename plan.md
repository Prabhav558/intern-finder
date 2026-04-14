# 📋 OpportuNest — Student Opportunity Portal: Complete Project Plan

> **Project Codename:** OpportuNest
> **Vision:** LinkedIn + Internshala + College Notice Board — unified into one AI-powered, student-first portal
> **Type:** Full-Stack Web Application (SEPM Project)
> **Target Users:** Students · College Admin / Placement Cell · Companies / Opportunity Providers

---

## 🗂️ Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Database Design](#4-database-design)
5. [Module Breakdown](#5-module-breakdown)
6. [Feature Priority Matrix](#6-feature-priority-matrix)
7. [Page & UI Inventory](#7-page--ui-inventory)
8. [API Design](#8-api-design)
9. [Development Phases & Timeline](#9-development-phases--timeline)
10. [Deployment Plan](#10-deployment-plan)
11. [Testing Strategy](#11-testing-strategy)
12. [Risk Register](#12-risk-register)

---

## 1. Project Overview

### Problem Statement

Students in colleges lack a centralized, intelligent platform to discover internships, hackathons, research opportunities, scholarships, and campus events. Information is scattered across WhatsApp groups, notice boards, Internshala, Unstop, and LinkedIn — leading to missed deadlines and opportunities.

### Solution

**OpportuNest** consolidates all opportunities into one platform, adds AI-powered personalization, smart deadline reminders, eligibility auto-checking, resume analysis, and a community layer — making it feel like a real startup product.

### Core Value Propositions

| Student Benefit | Admin Benefit | Company Benefit |
|---|---|---|
| Personalized AI feed | One dashboard to manage all listings | Direct access to curated student pool |
| Eligibility pre-check | Application tracking & analytics | ATS-friendly application pipeline |
| Auto deadline reminders | AI-assisted scraping of opportunities | Badge/certification issuance |
| ATS Resume scoring | Verified/trusted listing system | Company profile & branding |
| Gamified engagement | Student activity reports | |

---

## 2. System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                  │
│                                                                        │
│   ┌─────────────────────┐        ┌─────────────────────────────────┐  │
│   │   Student Frontend   │        │   Admin / Company Frontend      │  │
│   │   (Next.js 14 App)   │        │   (Next.js 14 - /admin route)   │  │
│   └────────┬────────────┘        └──────────────┬──────────────────┘  │
└────────────┼───────────────────────────────────┼─────────────────────┘
             │                                   │
             ▼                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          API GATEWAY (Next.js API Routes / Express)    │
│                                                                        │
│  /auth  /students  /opportunities  /applications  /admin  /ai  /notify │
└────────────────┬───────────────────────────────────────────────────────┘
                 │
     ┌───────────┼───────────────┐
     ▼           ▼               ▼
┌─────────┐ ┌─────────┐  ┌──────────────────┐
│ Auth    │ │ Core    │  │  AI Services     │
│ Service │ │ Business│  │  (Python FastAPI) │
│ (JWT +  │ │ Logic   │  │                  │
│ OAuth)  │ │ (Node)  │  │ - Recommender    │
└────┬────┘ └────┬────┘  │ - Resume Parser  │
     │           │       │ - Eligibility    │
     │           │       │ - Scraper        │
     ▼           ▼       └──────────────────┘
┌───────────────────────────────────────────┐
│              DATABASE LAYER               │
│  PostgreSQL (Primary) + Redis (Cache)     │
│  + MongoDB (Unstructured / Resume data)   │
└───────────────────────────────────────────┘
                 │
    ┌────────────┼───────────────┐
    ▼            ▼               ▼
┌────────┐  ┌────────┐    ┌───────────┐
│Cloudinary│ │Resend/ │    │ Firebase  │
│(File CDN)│ │Nodemailer│  │(Push Notif│
└────────┘  └────────┘    └───────────┘
```

### Architecture Style
- **Frontend:** Next.js 14 App Router (React Server Components)
- **Backend:** Node.js + Express (REST API) + Python FastAPI (AI microservices)
- **Auth:** JWT + NextAuth.js (Google OAuth + Credentials)
- **Real-time:** Socket.io for live notifications
- **Job Queue:** BullMQ (for email, scraping, reminders)
- **Search:** Elasticsearch or Meilisearch for full-text opportunity search

---

## 3. Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| State Management | Zustand + React Query (TanStack Query) |
| Charts | Recharts / Chart.js |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js 20 LTS |
| Framework | Express.js |
| ORM | Prisma (PostgreSQL) |
| Auth | NextAuth.js + JWT |
| File Upload | Multer + Cloudinary |
| Email | Resend (or Nodemailer + SMTP) |
| SMS | Twilio API |
| Push Notifications | Firebase Cloud Messaging (FCM) |
| Job Queue | BullMQ + Redis |

### AI Services (Python Microservice)
| Layer | Technology |
|---|---|
| Framework | FastAPI |
| NLP | spaCy + scikit-learn |
| PDF Parsing | PyMuPDF / pdfminer.six |
| Recommendation | TF-IDF + Cosine Similarity → later collaborative filtering |
| Web Scraping | Selenium + BeautifulSoup4 + Playwright |
| ML | scikit-learn → export to ONNX |

### Database (All via Docker — No Local Installs Needed)
| Type | Technology | Docker Image | Use |
|---|---|---|---|
| Primary DB | PostgreSQL 16 | `postgres:16-alpine` | All relational data |
| Cache | Redis 7 | `redis:7-alpine` | Sessions, rate limiting, job queues |
| Search | Meilisearch | `getmeili/meilisearch:latest` | Opportunity full-text search |
| File Storage | Cloudinary | _(cloud service)_ | Resumes, profile photos |

> ⚠️ **You do NOT need to install PostgreSQL, Redis, or Meilisearch on your laptop.** Everything runs inside Docker containers via `docker-compose up -d`.

### DevOps
| Layer | Technology |
|---|---|
| Version Control | Git + GitHub |
| CI/CD | GitHub Actions |
| Containerization | Docker + Docker Compose |
| Hosting | Vercel (Frontend) + Railway / Render (Backend) |
| Monitoring | Sentry (Error) + Axiom (Logs) |
| Env Management | dotenv + Vercel Secrets |

---

## 3.5 Project Folder Structure

> Clean, organized monorepo — every folder has a single responsibility.

```
OpportuNest/
│
├── frontend/                    # ── ALL FRONTEND CODE ──
│   ├── app/                     # Next.js App Router pages
│   │   ├── (auth)/              # Auth pages (login, register)
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (student)/           # Student-facing pages
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── opportunities/page.tsx
│   │   │   ├── opportunities/[id]/page.tsx
│   │   │   ├── my-applications/page.tsx
│   │   │   ├── saved/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── resume-analyzer/page.tsx
│   │   │   ├── badge-wall/page.tsx
│   │   │   └── notifications/page.tsx
│   │   ├── (admin)/             # Admin-facing pages
│   │   │   ├── admin/page.tsx
│   │   │   ├── admin/opportunities/page.tsx
│   │   │   ├── admin/users/page.tsx
│   │   │   ├── admin/applications/page.tsx
│   │   │   ├── admin/analytics/page.tsx
│   │   │   ├── admin/scraper/page.tsx
│   │   │   └── admin/badges/page.tsx
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing page
│   │   └── globals.css
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # shadcn/ui base components
│   │   ├── layout/              # Navbar, Sidebar, Footer
│   │   ├── cards/               # OpportunityCard, ApplicationCard
│   │   ├── forms/               # LoginForm, ProfileForm, ApplyForm
│   │   ├── charts/              # AdminChart, TrendChart
│   │   └── shared/              # Badge, MatchScore, StatusChip
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions, API client
│   ├── stores/                  # Zustand state stores
│   ├── types/                   # TypeScript types & interfaces
│   ├── public/                  # Static assets (images, icons)
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                     # ── ALL BACKEND CODE ──
│   ├── src/
│   │   ├── server.ts            # Express app entry point
│   │   ├── config/              # App config, env loader
│   │   │   ├── index.ts
│   │   │   └── database.ts
│   │   ├── routes/              # API route definitions
│   │   │   ├── auth.routes.ts
│   │   │   ├── student.routes.ts
│   │   │   ├── opportunity.routes.ts
│   │   │   ├── application.routes.ts
│   │   │   ├── admin.routes.ts
│   │   │   └── notification.routes.ts
│   │   ├── controllers/         # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── student.controller.ts
│   │   │   ├── opportunity.controller.ts
│   │   │   ├── application.controller.ts
│   │   │   └── admin.controller.ts
│   │   ├── services/            # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── student.service.ts
│   │   │   ├── opportunity.service.ts
│   │   │   ├── application.service.ts
│   │   │   ├── notification.service.ts
│   │   │   └── reminder.service.ts
│   │   ├── middleware/          # Auth, validation, error handling
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validate.middleware.ts
│   │   │   ├── role.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── utils/               # Helpers (JWT, email, file upload)
│   │   │   ├── jwt.ts
│   │   │   ├── email.ts
│   │   │   ├── cloudinary.ts
│   │   │   └── redis.ts
│   │   └── jobs/                # BullMQ job processors
│   │       ├── reminder.job.ts
│   │       └── scraper.job.ts
│   ├── tsconfig.json
│   └── package.json
│
├── database/                    # ── ALL DATABASE CODE ──
│   ├── prisma/
│   │   ├── schema.prisma        # Full database schema
│   │   └── migrations/          # Auto-generated migrations
│   ├── seed/
│   │   ├── seed.ts              # Main seed runner
│   │   ├── students.seed.ts     # Demo student data
│   │   ├── opportunities.seed.ts # Demo opportunities
│   │   ├── badges.seed.ts       # Badge definitions
│   │   └── admin.seed.ts        # Default admin account
│   └── README.md                # How to run migrations & seeds
│
├── ai-service/                  # ── ALL AI/ML CODE ──
│   ├── main.py                  # FastAPI app entry point
│   ├── config.py                # Settings (Pydantic Settings)
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── routers/                 # API endpoints
│   │   ├── recommend.py
│   │   ├── resume.py
│   │   ├── eligibility.py
│   │   ├── scraper.py
│   │   ├── tags.py
│   │   ├── match.py
│   │   └── skills.py
│   ├── services/                # Core AI logic
│   │   ├── recommender.py
│   │   ├── resume_parser.py
│   │   ├── eligibility_engine.py
│   │   ├── scraper_engine.py
│   │   ├── tag_extractor.py
│   │   ├── match_scorer.py
│   │   └── skill_analyzer.py
│   ├── models/                  # Trained ML model files
│   │   ├── type_classifier.pkl
│   │   ├── tfidf_vectorizer.pkl
│   │   └── skill_taxonomy.json
│   ├── scrapers/                # Site-specific scrapers
│   │   ├── base.py
│   │   ├── internshala.py
│   │   ├── unstop.py
│   │   ├── linkedin.py
│   │   └── devfolio.py
│   ├── schemas/                 # Pydantic request/response models
│   │   ├── student.py
│   │   ├── opportunity.py
│   │   └── responses.py
│   └── utils/                   # Helpers
│       ├── nlp.py
│       ├── redis_client.py
│       ├── pdf.py
│       └── text.py
│
├── docker/                      # ── DOCKER CONFIG ──
│   ├── docker-compose.yml       # PostgreSQL + Redis + Meilisearch
│   ├── docker-compose.prod.yml  # Production overrides
│   ├── backend.Dockerfile
│   └── ai-service.Dockerfile
│
├── docs/                        # ── DOCUMENTATION ──
│   ├── api.md                   # API endpoint reference
│   ├── setup.md                 # Local setup guide
│   └── architecture.md          # System architecture
│
├── .github/                     # ── CI/CD ──
│   └── workflows/
│       └── ci.yml               # GitHub Actions pipeline
│
├── .env.example                 # Sample env vars
├── .gitignore
├── plan.md                      # This file
├── AI.md                        # Action item list
└── README.md
```

**Folder Logic:**
| Folder | What Goes Here | Language |
|---|---|---|
| `frontend/` | All UI — pages, components, hooks, stores, styles | TypeScript / React |
| `backend/` | All API logic — routes, controllers, services, middleware | TypeScript / Node |
| `database/` | Schema, migrations, and seed scripts | Prisma / SQL |
| `ai-service/` | All AI / ML — recommendation, resume parser, scraper | Python |
| `docker/` | Docker Compose files and Dockerfiles | YAML / Docker |
| `docs/` | Project documentation | Markdown |

---

## 4. Database Design

### Core Tables (PostgreSQL via Prisma)

#### `users`
```sql
id, email, password_hash, role (STUDENT|ADMIN|COMPANY),
name, profile_photo_url, created_at, updated_at, is_verified, is_active
```

#### `student_profiles`
```sql
id, user_id (FK), roll_no, branch, graduation_year, cgpa,
skills (TEXT[]), interests (TEXT[]), resume_url, linkedin_url,
github_url, bio, location, badges_earned (JSONB)
```

#### `opportunities`
```sql
id, title, description, company_name, organizer,
type (INTERNSHIP|HACKATHON|RESEARCH|SCHOLARSHIP|WORKSHOP|JOB|COMPETITION),
domain (TEXT[]), deadline, eligibility_criteria (JSONB),
stipend_prize, application_link, tags (TEXT[]),
is_verified, is_active, posted_by (FK: users.id),
created_at, location, mode (REMOTE|ONSITE|HYBRID),
required_skills (TEXT[]), min_cgpa, allowed_branches (TEXT[]),
allowed_years (INT[]), external_url, views_count
```

#### `applications`
```sql
id, student_id (FK), opportunity_id (FK),
status (PENDING|UNDER_REVIEW|SHORTLISTED|SELECTED|REJECTED|WITHDRAWN),
applied_at, resume_url, cover_letter, notes, updated_at
```

#### `bookmarks`
```sql
id, student_id (FK), opportunity_id (FK), created_at
```

#### `notifications`
```sql
id, user_id (FK), type, title, message, is_read,
metadata (JSONB), created_at
```

#### `badges`
```sql
id, name, description, icon_url, criteria (JSONB)
```

#### `student_badges`
```sql
id, student_id (FK), badge_id (FK), earned_at
```

#### `companies`
```sql
id, user_id (FK), company_name, logo_url, website,
description, verified_at
```

#### `deadline_reminders`
```sql
id, student_id (FK), opportunity_id (FK),
remind_at, channel (EMAIL|SMS|PUSH), sent_at
```

#### `scrape_sources`
```sql
id, name, url, type, last_scraped_at, is_active, schedule_cron
```

---

## 5. Module Breakdown

### 5.1 Authentication Module
- **Student:** Email/Password registration + Google OAuth
- **Admin:** Seeded admin credentials + invite-only
- **Company:** Request account → admin approves
- JWT access token (15 min) + HTTP-only refresh cookie (7 days)
- Email verification on signup
- Password reset via email OTP

### 5.2 Student Module

#### Profile Management
- Multi-step onboarding wizard (5 steps):
  1. Basic Info (name, branch, year, CGPA)
  2. Skills & Interests (tag-based selection)
  3. Links (LinkedIn, GitHub, portfolio)
  4. Resume Upload (PDF → Cloudinary → AI parsed)
  5. Preferences (opportunity types, domains, locations)
- Profile completeness score (%)
- Public profile URL: `/profile/:username`

#### Opportunity Discovery
- Infinite scroll listing with filter sidebar
- Filters: Type, Domain, Deadline, Location, Mode, Stipend, Eligibility
- Advanced search with Meilisearch (full-text, fuzzy)
- Sort by: Latest, Deadline, Most Applied, Match Score
- "Recommended for You" AI section (top of feed)

#### Application Flow
- Click "Apply" → Eligibility check runs → Pass/Fail shown
- If pass: Choose resume (stored or upload new) + cover letter
- One-click apply using stored profile
- Application confirmation + auto-reminder set

#### Bookmarks & Tracking
- Save/unsave opportunities (heart icon)
- `/my-applications` — timeline view of all applications with status chips
- Kanban-style drag board (optional enhancement)

### 5.3 Admin Module

#### Dashboard
- KPI cards: Total Opps, Total Students, Apps Today, Active Opps
- Charts: Application trends (line), Type distribution (pie), Top domains (bar)
- Recent activity feed (live via SSE)

#### Opportunity Management
- Create/Edit opportunity with rich text editor (TipTap)
- Tag management, eligibility builder (drag-drop criteria)
- Bulk import (CSV) + AI Scraper queue review
- Verify / Reject scraped opportunities before publish
- Archive / Delete with soft-delete

#### User Management
- List all students with filters (branch, year, CGPA)
- View student profile + application history
- Suspend / Activate accounts
- Export student data (CSV)

#### Application Tracking
- View all applicants per opportunity
- Update status (bulk or individual)
- Shortlist management
- Download all resumes (ZIP)

### 5.4 Company Module (Optional / Phase 2)
- Company profile setup
- Self-post opportunities (goes to admin verification queue)
- View applications for their own postings
- Export candidate list

---

## 6. Feature Priority Matrix

| Feature | Priority | Phase | Complexity |
|---|---|---|---|
| Auth (JWT + Google OAuth) | 🔴 Critical | 1 | Medium |
| Student Registration + Profile | 🔴 Critical | 1 | Medium |
| Opportunity CRUD (Admin) | 🔴 Critical | 1 | Low |
| Browse + Filter Opportunities | 🔴 Critical | 1 | Medium |
| Apply for Opportunity | 🔴 Critical | 1 | Medium |
| Bookmark + Save | 🔴 Critical | 1 | Low |
| Application Status Tracking | 🔴 Critical | 1 | Low |
| Resume Upload | 🟠 High | 1 | Medium |
| Admin Dashboard + Analytics | 🟠 High | 2 | Medium |
| AI Recommendation Engine | 🟠 High | 2 | High |
| Deadline Reminder (Email) | 🟠 High | 2 | Medium |
| Eligibility Checker | 🟠 High | 2 | Medium |
| Full-Text Search (Meilisearch) | 🟠 High | 2 | Medium |
| AI Resume Analyzer | 🟡 Medium | 3 | High |
| Push Notifications (FCM) | 🟡 Medium | 3 | Medium |
| Opportunity Scraper | 🟡 Medium | 3 | High |
| Badge / Gamification System | 🟡 Medium | 3 | Medium |
| SMS Reminders (Twilio) | 🟡 Medium | 3 | Low |
| Community / Discussion Forum | 🟢 Nice-to-Have | 4 | High |
| Calendar Integration | 🟢 Nice-to-Have | 4 | Medium |
| Internship Match Score | 🟢 Nice-to-Have | 4 | Medium |
| Company Module | 🟢 Nice-to-Have | 4 | High |
| Mobile App (React Native) | 🟢 Nice-to-Have | 5 | High |

---

## 7. Page & UI Inventory

### Student-Facing Pages

| Route | Page Name | Key Components |
|---|---|---|
| `/` | Landing / Home | Hero, Features, Stats, CTA |
| `/register` | Register | Multi-step wizard |
| `/login` | Login | Email/password + Google |
| `/dashboard` | Student Dashboard | "Recommended for You", Deadlines, Stats, Activity |
| `/opportunities` | Browse Opportunities | Filter sidebar, Card grid, Search bar |
| `/opportunities/:id` | Opportunity Detail | Full info, Eligibility check, Apply CTA |
| `/apply/:id` | Apply Page | Resume select, Cover letter, Submit |
| `/my-applications` | My Applications | Status timeline, Kanban view |
| `/saved` | Saved Opportunities | Bookmarked cards |
| `/profile` | My Profile | Profile editor, Skills, Resume, Stats |
| `/profile/:username` | Public Profile | Read-only student profile |
| `/notifications` | Notifications | All notifications, Read/unread |
| `/badge-wall` | Badges | Earned & locked badges |
| `/resume-analyzer` | Resume Analyzer | Upload → AI report |

### Admin-Facing Pages

| Route | Page Name | Key Components |
|---|---|---|
| `/admin` | Admin Dashboard | KPI cards, Charts, Activity |
| `/admin/opportunities` | Manage Opportunities | DataTable, CRUD, Verify queue |
| `/admin/opportunities/new` | Add Opportunity | Rich form with TipTap editor |
| `/admin/opportunities/:id/edit` | Edit Opportunity | Pre-filled form |
| `/admin/users` | Manage Students | DataTable, filters, suspend |
| `/admin/applications` | All Applications | Applicant list, status update |
| `/admin/analytics` | Deep Analytics | Trend charts, export |
| `/admin/scraper` | Scraper Control | Source management, review queue |
| `/admin/badges` | Badge Management | Create/edit badges + criteria |

---

## 8. API Design

### Auth Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/verify-email
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
```

### Student Endpoints
```
GET    /api/students/profile
PUT    /api/students/profile
POST   /api/students/resume/upload
GET    /api/students/applications
GET    /api/students/bookmarks
POST   /api/students/bookmarks/:opportunityId
DELETE /api/students/bookmarks/:opportunityId
GET    /api/students/badges
GET    /api/students/notifications
PATCH  /api/students/notifications/:id/read
```

### Opportunity Endpoints
```
GET    /api/opportunities              (list, filter, search)
GET    /api/opportunities/:id          (detail)
POST   /api/opportunities              (admin only)
PUT    /api/opportunities/:id          (admin only)
DELETE /api/opportunities/:id          (admin only)
POST   /api/opportunities/:id/apply    (student)
GET    /api/opportunities/:id/applicants (admin)
GET    /api/opportunities/recommended  (AI)
```

### Admin Endpoints
```
GET    /api/admin/stats
GET    /api/admin/users
PATCH  /api/admin/users/:id/status
GET    /api/admin/applications
PATCH  /api/admin/applications/:id/status
GET    /api/admin/scraper/queue
POST   /api/admin/scraper/approve/:id
DELETE /api/admin/scraper/reject/:id
```

### AI Endpoints (Python FastAPI)
```
POST   /ai/recommend              (body: student_profile)
POST   /ai/resume/analyze         (body: resume_file)
POST   /ai/eligibility/check      (body: student_profile, opportunity)
GET    /ai/scraper/run/:source     (trigger scrape)
```

---

## 9. Development Phases & Timeline

### Phase 1 — Foundation (Weeks 1–2)
**Goal:** Working skeleton + auth + basic CRUD

- [ ] Project scaffolding (Next.js + Express + Prisma)
- [ ] Docker Compose setup (Postgres + Redis)
- [ ] Database schema + migrations
- [ ] Auth system (JWT + Google OAuth)
- [ ] Student registration + profile (multi-step)
- [ ] Basic opportunity CRUD for admin
- [ ] Browse opportunities page (no filters yet)
- [ ] Resume upload → Cloudinary

**Deliverable:** Students can register, browse, and admins can post opportunities.

---

### Phase 2 — Core Interaction (Weeks 3–4)
**Goal:** Full student workflow + admin dashboard

- [ ] Advanced filters + Meilisearch integration
- [ ] Apply for opportunity (with eligibility check)
- [ ] Bookmark / save feature
- [ ] Application status tracking (student side)
- [ ] Admin dashboard with KPI cards
- [ ] Application management (admin side)
- [ ] Email notifications on apply (Resend)
- [ ] Deadline reminder scheduler (BullMQ + cron)

**Deliverable:** End-to-end student journey functional.

---

### Phase 3 — AI Layer (Weeks 5–6)
**Goal:** Intelligence that differentiates the project

- [ ] Python FastAPI AI microservice bootstrapped
- [ ] AI Recommendation Engine (TF-IDF based)
- [ ] Resume Analyzer (PDF parse + skill gap + ATS score)
- [ ] Eligibility auto-checker (rule-based engine)
- [ ] Admin analytics: Charts (Recharts), export, trends
- [ ] Badge system + gamification
- [ ] Push notifications (FCM)
- [ ] SMS reminders (Twilio)

**Deliverable:** AI recommendation + resume analyzer live.

---

### Phase 4 — Automation & Community (Weeks 7–8)
**Goal:** Make it feel like a real product

- [ ] Opportunity Scraper (Internshala, Unstop, LinkedIn)
- [ ] Admin scraper review queue
- [ ] Community forum (discussion threads, replies)
- [ ] Calendar integration (Google Calendar API)
- [ ] Internship Match Score % display
- [ ] One-click resume submission
- [ ] Referral system
- [ ] Mobile responsiveness audit

**Deliverable:** Scraper live + community forum functional.

---

### Phase 5 — Polish & Deployment (Week 9–10)
**Goal:** Production-ready, presentation-worthy

- [ ] End-to-end testing (Cypress)
- [ ] Unit tests (Jest + Vitest)
- [ ] Performance audit (Lighthouse)
- [ ] Security audit (OWASP basics)
- [ ] CI/CD GitHub Actions pipeline
- [ ] Vercel deployment (frontend)
- [ ] Railway/Render deployment (backend)
- [ ] Docker production image
- [ ] Demo data seeder script
- [ ] README + documentation

**Deliverable:** Deployed, live URL, ready to demo.

---

## 10. Deployment Plan

### Local Development (Docker — No Installs Needed)

**Prerequisites:** Only Docker Desktop + Node.js + Python need to be installed on your laptop. PostgreSQL, Redis, and Meilisearch all run inside Docker containers.

```bash
# Step 1: Start all databases in Docker (from project root)
cd docker
docker-compose up -d
# ✅ This starts: PostgreSQL (port 5432), Redis (port 6379), Meilisearch (port 7700)

# Step 2: Run database migrations (first time only)
cd ../database
npx prisma migrate dev
npx prisma db seed    # optional: load demo data

# Step 3: Start backend
cd ../backend
npm install
npm run dev           # Express API on http://localhost:5000

# Step 4: Start AI service
cd ../ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000   # FastAPI on http://localhost:8000

# Step 5: Start frontend
cd ../frontend
npm install
npm run dev           # Next.js on http://localhost:3000
```

### Docker Compose File (docker/docker-compose.yml)
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    container_name: opportunest-db
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: opportunest
      POSTGRES_PASSWORD: opportunest_dev
      POSTGRES_DB: opportunest
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: opportunest-redis
    ports:
      - '6379:6379'

  meilisearch:
    image: getmeili/meilisearch:latest
    container_name: opportunest-search
    ports:
      - '7700:7700'
    environment:
      MEILI_MASTER_KEY: opportunest_dev_key
    volumes:
      - msdata:/meili_data

volumes:
  pgdata:
  msdata:
```

### Production Architecture
```
GitHub Actions (CI/CD)
    │
    ├── Frontend → Vercel (auto-deploy on main branch)
    ├── Backend  → Railway (Docker container)
    └── AI Service → Railway (Python container)

Managed Services:
    ├── PostgreSQL: Neon.tech (serverless Postgres)
    ├── Redis: Upstash (serverless Redis)
    ├── Search: Meilisearch Cloud
    └── Files: Cloudinary (free tier)
```

### Environment Variables (Sample)
```env
# App
NEXTAUTH_URL=
NEXTAUTH_SECRET=
NEXT_PUBLIC_APP_URL=

# Database
DATABASE_URL=
REDIS_URL=

# AI Service
AI_SERVICE_URL=

# Auth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Services
CLOUDINARY_URL=
RESEND_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
FIREBASE_SERVICE_ACCOUNT_JSON=
MEILISEARCH_URL=
MEILISEARCH_KEY=
```

---

## 11. Testing Strategy

### Unit Tests (Jest / Vitest)
- Auth functions (JWT sign/verify)
- Eligibility checker logic
- Recommendation score functions
- API route handlers

### Integration Tests
- Auth flow (register → verify → login)
- Apply for opportunity flow
- Admin opportunity approval flow

### E2E Tests (Cypress / Playwright)
- Student: Register → Profile → Browse → Apply
- Admin: Login → Post opportunity → See applicants
- AI: Upload resume → Get analysis

### Performance
- Lighthouse: Score > 85 for all core pages
- Load test: 100 concurrent users (k6)

---

## 12. Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Scraper blocked by target sites | High | Medium | Rotate user-agents, add delays, use Playwright stealth |
| AI model accuracy low | Medium | High | Use ensemble methods, allow user feedback |
| Email deliverability issues | Medium | Medium | Use Resend (high reputation), DKIM setup |
| Database performance at scale | Low | High | Index optimization, Redis caching, read replicas |
| Scope creep | High | High | Strict phase gating, MVP-first mindset |
| Google OAuth rate limits | Low | Medium | Cache OAuth tokens, use service accounts |
| Resume parsing failures (PDFs) | Medium | Medium | Fallback manual upload, support DOCX |

---

## 📌 Quick Summary

```
Phase 1 → Foundation: Auth + Profiles + Basic CRUD         (2 weeks)
Phase 2 → Core: Apply + Admin + Notifications              (2 weeks)
Phase 3 → AI: Recommendations + Resume Analyzer            (2 weeks)
Phase 4 → Automation: Scraper + Community + Calendar       (2 weeks)
Phase 5 → Launch: Testing + CI/CD + Deployment             (2 weeks)
                                                    Total: 10 weeks
```

**This project, if fully built, rivals a real startup product and is presentation/hackathon/placement-interview ready.**

---

## 13. AI & Intelligence Layer — Technical Specification

> All algorithms, schemas, code, data flows, and microservice details for the AI-powered features.

### 13.1 AI Microservice Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                      AI SERVICES LAYER                               │
│                  (Python FastAPI Microservice)                        │
│                                                                      │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │  Recommender    │  │  Resume Analyzer  │  │  Scraper Engine  │   │
│  │  Engine         │  │  + ATS Scorer     │  │  (Selenium/BS4)  │   │
│  │  (TF-IDF +      │  │  (spaCy + pdfminer│  │  + AI Classifier │   │
│  │   Cosine Sim)   │  │   + BERT skills)  │  │                  │   │
│  └────────┬────────┘  └────────┬──────────┘  └────────┬─────────┘   │
│           │                    │                        │            │
│  ┌────────▼────────┐  ┌────────▼──────────┐  ┌────────▼─────────┐  │
│  │  Eligibility    │  │  Match Score       │  │  NLP Tag         │  │
│  │  Checker        │  │  Calculator        │  │  Extractor       │  │
│  │  (Rule Engine + │  │  (Weighted Blend)  │  │  (spaCy NER)     │  │
│  │   ML)           │  │                   │  │                  │  │
│  └─────────────────┘  └────────────────────┘  └──────────────────┘  │
│                                                                      │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │  Skill Gap      │  │  Deadline AI      │  │  Badge Trigger   │  │
│  │  Analyzer       │  │  Prioritizer      │  │  Engine          │  │
│  └─────────────────┘  └──────────────────┘  └──────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

#### AI Tech Stack

| Component | Library / Tool |
|---|---|
| API Framework | FastAPI (Python 3.11+) |
| NLP Engine | spaCy (en_core_web_lg) |
| ML Models | scikit-learn |
| PDF Parsing | PyMuPDF (fitz) + pdfminer.six |
| Vector Math | numpy + scipy |
| Transformers | sentence-transformers (BERT embeddings - Phase 2) |
| Web Scraping | Playwright (async) + BeautifulSoup4 |
| Scraping Stealth | playwright-stealth |
| Job Scheduling | APScheduler (within FastAPI) |
| Data Validation | Pydantic v2 |
| Caching | Redis (via aioredis) |
| Model Storage | Joblib + local filesystem |

#### FastAPI Project Structure

```
ai-service/
├── main.py                    # FastAPI app entry point
├── config.py                  # Settings (Pydantic Settings)
├── requirements.txt
├── Dockerfile
│
├── routers/
│   ├── recommend.py           # /ai/recommend
│   ├── resume.py              # /ai/resume/analyze
│   ├── eligibility.py         # /ai/eligibility/check
│   ├── scraper.py             # /ai/scraper/*
│   ├── tags.py                # /ai/tags/extract
│   ├── match.py               # /ai/match/score
│   └── skills.py              # /ai/skills/gap
│
├── services/
│   ├── recommender.py         # TF-IDF + collaborative filter
│   ├── resume_parser.py       # PDF parse + ATS
│   ├── eligibility_engine.py  # Rule engine
│   ├── scraper_engine.py      # Playwright scrapers
│   ├── tag_extractor.py       # NLP tagging
│   ├── match_scorer.py        # Weighted scoring
│   └── skill_analyzer.py      # Gap analysis
│
├── models/
│   ├── type_classifier.pkl    # Opportunity type ML model
│   ├── tfidf_vectorizer.pkl   # Fitted TF-IDF
│   └── skill_taxonomy.json    # 5000+ skills list
│
├── scrapers/
│   ├── base.py                # BaseScraper class
│   ├── internshala.py
│   ├── unstop.py
│   ├── linkedin.py
│   └── devfolio.py
│
├── schemas/
│   ├── student.py             # Pydantic models
│   ├── opportunity.py
│   └── responses.py
│
└── utils/
    ├── nlp.py                 # spaCy utils
    ├── redis_client.py        # Redis cache
    ├── pdf.py                 # PDF parsing utils
    └── text.py                # Text normalization
```

---

### 13.2 Recommendation Engine — Algorithm Detail

#### Phase 1: TF-IDF + Cosine Similarity

```
STUDENT VECTOR = TF-IDF(skills + interests + resume_keywords + past_application_tags)
OPPORTUNITY VECTOR = TF-IDF(title + description + tags + required_skills + domain)

SIMILARITY_SCORE = cosine_similarity(STUDENT_VECTOR, OPPORTUNITY_VECTOR)
RECOMMENDATIONS = top_N opportunities sorted by SIMILARITY_SCORE
```

#### Phase 2: Collaborative Filtering (SVD)

```
USER-ITEM MATRIX:
  Rows = students
  Cols = opportunities
  Values = interaction_score (applied=1.0, bookmarked=0.7, viewed=0.3)

MATRIX FACTORIZATION → Singular Value Decomposition (SVD)
→ Latent factor vectors for students + opportunities
→ Predict scores for unseen opportunities
```

#### Phase 3: BERT Semantic Embeddings

```
Encode student profile → 768-dim sentence-BERT vector
Encode opportunity description → 768-dim sentence-BERT vector
Similarity = dot product of normalized vectors
Index using FAISS for real-time ANN search
```

#### Input / Output Schemas

```python
class StudentProfile(BaseModel):
    skills: list[str]
    interests: list[str]
    branch: str
    graduation_year: int
    cgpa: float
    past_applications: list[str]
    resume_keywords: list[str]
    bookmarked: list[str]

class Recommendation(BaseModel):
    opportunity_id: str
    title: str
    score: float        # 0.0 - 1.0
    reason: str         # "Matches your Python and ML skills"
    match_tags: list[str]

class RecommendationResponse(BaseModel):
    recommendations: list[Recommendation]
    generated_at: datetime
    model_version: str
```

#### Caching
- Redis key: `rec:{student_id}`, TTL = 6 hours
- Background refresh every night via APScheduler cron

---

### 13.3 Resume Analyzer & ATS Scorer — Algorithm Detail

#### Processing Pipeline

```
PDF Upload → PyMuPDF Text Extraction → Section Classifier (regex + ML)
  → Contact Info, Education, Experience, Skills, Projects, Certifications
  → spaCy NER (name, orgs, technologies, dates)
  → Skill Extraction (match against 5000+ skill taxonomy, normalize synonyms)
  → ATS Score Calculator → Gap Analysis → Output JSON
```

#### ATS Score Breakdown (100 points)

| Category | Max Points | How Measured |
|---|---|---|
| Section Completeness | 20 | Has all 5 core sections |
| Keyword Density | 20 | Relevant skills coverage |
| Action Verbs | 15 | Bullets start with strong verbs |
| Quantification | 15 | Numbers / metrics in impact |
| Contact Info | 10 | Email, phone, LinkedIn present |
| Format Friendliness | 10 | Single column, no tables/images |
| Education Details | 5 | CGPA, degree, year |
| Projects Section | 5 | Has project descriptions |

#### Output Schema

```python
class ResumeAnalysisResult(BaseModel):
    ats_score: int              # 0-100
    grade: str                  # A, B, C, D, F
    extracted_skills: list[str]
    missing_skills: list[str]
    education: dict
    experience: list[dict]
    projects: list[dict]
    contact: dict
    suggestions: list[str]      # max 7 actionable tips
    keyword_hits: list[str]
    recommended_opportunities: list[str]
```

---

### 13.4 Eligibility Auto-Checker — Algorithm Detail

#### Phase 1: Deterministic Rule Engine

```python
def check_eligibility(student, opportunity) -> EligibilityResult:
    checks = []
    # CGPA Check
    if opportunity.min_cgpa and student.cgpa < opportunity.min_cgpa:
        checks.append(Check(field="cgpa", passed=False, ...))
    # Branch Check
    if opportunity.allowed_branches and student.branch not in opportunity.allowed_branches:
        checks.append(Check(field="branch", passed=False, ...))
    # Graduation Year
    if opportunity.allowed_years and student.graduation_year not in opportunity.allowed_years:
        checks.append(Check(field="year", passed=False, ...))
    # Skills Check (fuzzy, 50% threshold)
    required = set(opportunity.required_skills)
    student_skills = set(student.skills)
    missing = required - student_skills
    skill_coverage = len(required - missing) / max(len(required), 1)
    if skill_coverage < 0.5:
        checks.append(Check(field="skills", passed=False, ...))
    return EligibilityResult(eligible=all_passed, checks=checks)
```

#### Phase 2: NLP-Based Criteria Parsing
- Extracts CGPA thresholds, branches, years, skills from free-text eligibility using spaCy NER + regex patterns
- Parsed → structured rules → fed into rule engine

#### Output

```python
class EligibilityResult(BaseModel):
    eligible: bool
    partial: bool
    score: float        # 0.0 to 1.0
    checks: list[EligibilityCheck]
    summary: str        # "You meet 4 of 5 criteria"
```

---

### 13.5 Opportunity Scraper — Technical Detail

#### Sources & Strategies

| Source | Method | Frequency |
|---|---|---|
| Internshala | Playwright headless + BeautifulSoup | Every 6 hours |
| Unstop | Playwright + API reverse-engineering | Every 12 hours |
| LinkedIn Jobs | Playwright stealth (slow scroll) | Once daily |
| Devfolio | BeautifulSoup | Every 6 hours |
| Custom College Sites | Configurable CSS selectors | Configurable |

#### Pipeline

```
Scraper Orchestrator (APScheduler cron) → Source Registry (DB)
  → Playwright Async + stealth + rotating user-agents + random delays
  → AI Enricher (type classifier, tag extractor, dedup)
  → Admin Review Queue (DB: is_verified=false)
```

#### Opportunity Type Classifier
- **Model:** Logistic Regression on TF-IDF(title + description)
- **Classes:** INTERNSHIP | HACKATHON | SCHOLARSHIP | RESEARCH | WORKSHOP | JOB | COMPETITION
- **Accuracy target:** > 90%

#### Duplicate Detection
- TF-IDF vectorize title+description → cosine similarity > 0.85 = duplicate

#### Anti-Detection
```python
await stealth_async(page)
page.set_extra_http_headers({"User-Agent": random.choice(USER_AGENTS)})
await asyncio.sleep(random.uniform(2, 5))
```

---

### 13.6 Match Score Calculator — Algorithm Detail

#### 6-Factor Weighted Scoring

```python
weights = {
    "skill_overlap":      0.35,   # Jaccard Similarity
    "interest_alignment": 0.20,   # TF-IDF similarity
    "domain_match":       0.15,   # exact match
    "branch_eligibility": 0.10,   # binary
    "cgpa_buffer":        0.10,   # how far above minimum
    "experience_level":   0.10,   # resume-derived
}
total = sum(scores[k] * weights[k] for k in weights) * 100  # percentage
```

#### Display Logic
```
90-100% → 🟢 Excellent Match
70-89%  → 🔵 Good Match
50-69%  → 🟡 Fair Match
< 50%   → 🔴 Low Match
```

---

### 13.7 Smart Deadline Reminders — Technical Detail

#### Trigger Checkpoints
```
T-7 days  → "Heads up! Deadline approaching in 7 days"
T-3 days  → "Don't miss it! 3 days left to apply"
T-1 day   → "⚠️ Last day to apply!"
T-2 hours → "Final reminder — closing in 2 hours"
```

#### Scheduler: BullMQ + Redis (Node.js)
```typescript
await reminderQueue.add('send-reminder', {
    studentId, opportunityId, daysBefore,
    channels: ['email', 'push']
}, { delay: triggerAt.getTime() - Date.now() });
```

#### AI Priority Ranking
```python
priority_score = 0.5 * match_score + 0.3 * (1 - fill_rate) + 0.2 * slots_urgency
```

#### Channels
- **Email:** Resend API
- **SMS:** Twilio
- **Push:** Firebase Cloud Messaging (FCM)

---

### 13.8 NLP Tag Extractor — Algorithm

```python
def extract_tags(text: str, top_n: int = 8) -> list[str]:
    # 1. spaCy NER (ORG, GPE, PRODUCT)
    # 2. Keyword match against 5000+ skill taxonomy
    # 3. TF-IDF keyphrases (unigrams + bigrams)
    # Combine + deduplicate + return top N
```

---

### 13.9 Skill Gap Analyzer — Algorithm

```python
MARKET_SKILLS = {
    "Software Developer": ["Python", "DSA", "System Design", "SQL", "Git", "Docker"],
    "ML Engineer": ["Python", "ML", "Deep Learning", "TensorFlow", "PyTorch", "MLOps"],
    ...
}

def analyze_skill_gap(student_skills, target_role) -> SkillGapReport:
    required = set(MARKET_SKILLS[target_role])
    present = required & student_skills
    missing = required - student_skills
    coverage = len(present) / len(required) * 100
    return SkillGapReport(coverage, present, missing, learning_roadmap)
```

---

### 13.10 Gamification Badge Rules

```python
BADGE_RULES = {
    "first_application":  total_applications >= 1,
    "go_getter":          total_applications >= 5,
    "super_applicant":    total_applications >= 20,
    "profile_complete":   profile_completion >= 100%,
    "hackathon_warrior":  hackathon_applications >= 3,
    "early_bird":         applied 7+ days before deadline (3+ times),
    "resume_ace":         ats_score >= 80,
    "top_match":          avg_match_score >= 85,
    "referral_champion":  referrals_converted >= 5,
}
```

---

### 13.11 Redis Cache Key Convention

```
rec:{student_id}              → recommendations, TTL=6hr
elig:{student_id}:{opp_id}   → eligibility result, TTL=1hr
match:{student_id}:{opp_id}  → match score, TTL=6hr
gap:{student_id}:{role}      → skill gap report, TTL=24hr
tags:{opp_id}                → extracted tags, permanent
ats:{resume_hash}            → ATS result, permanent
```

---

### 13.12 Model Registry & Retraining

```json
{
  "tfidf_vectorizer": { "current": "v2", "trained_at": "...", "samples": 3420 },
  "type_classifier":  { "current": "v2", "accuracy": 0.924, "samples": 2100 }
}
```

Retraining: APScheduler cron at 2 AM daily — re-fits TF-IDF with new opportunities.

#### Feedback Loop
- Implicit: student clicks recommendation → positive signal
- Explicit: "Not relevant" button → negative signal
- Application: strongest positive signal
- All stored in `recommendation_feedback` table

---

### 13.13 Performance Targets

| Endpoint | Max Response Time | Cache TTL |
|---|---|---|
| `/ai/recommend` | 500ms | 6 hours |
| `/ai/resume/analyze` | 5000ms | permanent |
| `/ai/eligibility/check` | 100ms | 1 hour |
| `/ai/tags/extract` | 200ms | permanent |
| `/ai/match/score` | 150ms | 6 hours |

---

### 13.14 Evaluation Metrics

| Model | Metric | Target |
|---|---|---|
| Recommendation | Precision@10 | > 0.6 |
| Recommendation | CTR | > 15% |
| Recommendation | Apply Rate from Rec | > 5% |
| Resume Analyzer | Skill F1 | > 0.80 |
| Resume Analyzer | ATS correlation with HR | > 0.70 |
| Eligibility | Rule accuracy | ~100% |
| Eligibility | NLP parsing F1 | > 0.85 |
| Type Classifier | Accuracy | > 92% |
| Scraper | Admin approval rate | > 70% |
| Scraper | Duplicate detection precision | > 95% |

---

### 13.15 AI ↔ Backend Communication

```typescript
// Node.js calls AI service
const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

async function getRecommendations(studentProfile: StudentProfile) {
  const res = await fetch(`${AI_SERVICE_URL}/ai/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Internal-Key': AI_API_KEY },
    body: JSON.stringify(studentProfile),
  });
  return res.json();
}
```
