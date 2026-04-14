# 🤖 AI.md — Everything I'm Going to Build

> This document lists every single thing I will do to build the OpportuNest project — from setup to deployment. Each item is an action I will take.

---

## 🏗️ 1. Project Setup & Infrastructure

- [x] Initialize a Next.js 14 project with TypeScript and App Router
- [x] Set up Express.js backend server with folder structure
- [x] Set up Python FastAPI AI microservice skeleton
- [x] Create Docker Compose file with PostgreSQL, Redis, and Meilisearch containers
- [x] Configure Prisma ORM with PostgreSQL connection
- [x] Write the full database schema (13 tables) in `schema.prisma`
- [ ] Run initial Prisma migration to create all tables
- [x] Set up environment variable files (`.env`, `.env.example`)
- [x] Configure ESLint, Prettier, and TypeScript strict mode
- [x] Set up project monorepo structure (`/frontend`, `/backend`, `/ai-service`)
- [x] Install all npm dependencies (backend ✅, frontend 🔄, database 🔄, ai-service 🔄)
- [x] Create a seed script to populate demo/test data

---

## 🔐 2. Authentication System

- [x] Build user registration API (email + password with bcrypt hashing)
- [x] Build login API with JWT access token + HTTP-only refresh cookie
- [ ] Integrate NextAuth.js for Google OAuth sign-in
- [ ] Build email verification flow (send OTP, verify endpoint)
- [ ] Build forgot password flow (email OTP → reset password)
- [x] Build token refresh endpoint
- [x] Create auth middleware for protected routes (student, admin, company roles)
- [x] Seed default admin account into the database
- [x] Build logout endpoint (invalidate refresh token)
- [x] Build `/api/auth/me` to return current user info

---

## 👤 3. Student Module

### Profile
- [ ] Build multi-step onboarding wizard UI (5 steps: Basic Info, Skills, Links, Resume, Preferences)
- [ ] Create student profile creation API
- [ ] Create student profile update API
- [ ] Build profile completeness score calculator
- [ ] Build public profile page (`/profile/:username`)
- [ ] Build profile photo upload (Multer → Cloudinary)

### Resume
- [ ] Build resume upload API (PDF → Cloudinary storage + save URL in DB)
- [ ] Build resume management UI (view, replace, delete stored resume)
- [ ] Enable one-click apply using stored profile + resume

### Opportunity Browsing
- [ ] Build opportunity listing page with infinite scroll
- [ ] Build filter sidebar (Type, Domain, Deadline, Location, Mode, Stipend)
- [ ] Integrate Meilisearch for full-text search with fuzzy matching
- [ ] Build sort options (Latest, Deadline, Most Applied, Match Score)
- [ ] Build opportunity detail page with full info display
- [ ] Add "Recommended for You" section at top of the feed (powered by AI)
- [ ] Display Match Score % badge on each opportunity card

### Applications
- [ ] Build "Apply" button with eligibility pre-check flow
- [ ] Build application form (resume select, cover letter, submit)
- [ ] Build application confirmation + auto-schedule reminders
- [ ] Build "My Applications" page with status timeline view
- [ ] Build application status chips (Pending, Under Review, Shortlisted, Selected, Rejected)
- [ ] Build application withdrawal feature

### Bookmarks
- [ ] Build save/unsave (bookmark) functionality with heart icon
- [ ] Build "Saved Opportunities" page listing all bookmarks
- [ ] Build bookmark toggle API endpoints

### Notifications
- [ ] Build in-app notification bell with unread count badge
- [ ] Build notifications page (all notifications, mark read/unread)
- [ ] Set up real-time notification delivery with Socket.io
- [ ] Build notification preferences UI (email, SMS, push toggles)

---

## 🛡️ 4. Admin Module

### Dashboard
- [ ] Build admin dashboard layout with sidebar navigation
- [ ] Build KPI cards (Total Opportunities, Total Students, Applications Today, Active Opportunities)
- [ ] Build line chart for application trends over time (Recharts)
- [ ] Build pie chart for opportunity type distribution
- [ ] Build bar chart for top domains
- [ ] Build recent activity feed (live updates via SSE)

### Opportunity Management
- [ ] Build "Add Opportunity" form with rich text editor (TipTap)
- [ ] Build "Edit Opportunity" form with pre-filled data
- [ ] Build opportunity verification queue (approve/reject scraped listings)
- [ ] Build tag management interface
- [ ] Build eligibility criteria builder (drag-drop style)
- [ ] Build bulk import from CSV
- [ ] Build soft-delete and archive functionality
- [ ] Build opportunity data table with search, sort, and pagination

### User Management
- [ ] Build students data table with filters (branch, year, CGPA)
- [ ] Build student detail view (profile + application history)
- [ ] Build suspend/activate account toggle
- [ ] Build student data export to CSV

### Application Tracking
- [ ] Build applicant list view per opportunity
- [ ] Build application status update (individual and bulk)
- [ ] Build shortlist management interface
- [ ] Build "Download All Resumes" as ZIP

---

## 🤖 5. AI Recommendation Engine

- [ ] Set up FastAPI `/ai/recommend` endpoint
- [ ] Build TF-IDF vectorizer that encodes student profiles (skills + interests + resume keywords)
- [ ] Build TF-IDF vectorizer for opportunities (title + description + tags + required skills)
- [ ] Compute cosine similarity between student vector and all opportunity vectors
- [ ] Return top-N recommendations sorted by similarity score
- [ ] Generate human-readable "reason" for each recommendation (e.g., "Matches your Python and ML skills")
- [ ] Add Redis caching for recommendations (key: `rec:{student_id}`, TTL: 6 hours)
- [ ] Invalidate cache when student updates profile or applies to an opportunity
- [ ] Set up nightly APScheduler cron to background-refresh all active student recommendations
- [ ] Store recommendation feedback (click = positive, "Not relevant" = negative, apply = strong positive)
- [ ] Build feedback loop: retrain TF-IDF weekly using new opportunity data

---

## 📄 6. AI Resume Analyzer & ATS Scorer

- [ ] Build PDF text extraction using PyMuPDF
- [ ] Build section classifier (regex + ML) to split resume into Contact, Education, Experience, Skills, Projects, Certifications
- [ ] Run spaCy NER to extract person name, organizations, technologies, dates
- [ ] Build skill extraction by matching against a 5000+ skill taxonomy JSON
- [ ] Normalize skill synonyms (e.g., "ML" → "Machine Learning")
- [ ] Build ATS score calculator (100-point breakdown across 8 categories)
- [ ] Generate up to 7 actionable improvement suggestions
- [ ] Compute missing skills relative to target role (optional param)
- [ ] Return recommended opportunities based on extracted skills
- [ ] Build FastAPI `/ai/resume/analyze` endpoint accepting multipart PDF upload
- [ ] Cache results by resume file hash in Redis (permanent TTL)
- [ ] Build the frontend Resume Analyzer page (upload → loading → results card with score, grade, tips)

---

## ✅ 7. Eligibility Auto-Checker

- [ ] Build deterministic rule engine checking CGPA, Branch, Graduation Year, Skills
- [ ] Implement fuzzy skills matching with 50% coverage threshold
- [ ] Build severity classification (blocker, warning, info) for each check
- [ ] Return structured result: eligible / partially eligible / not eligible + reasons
- [ ] Build FastAPI `/ai/eligibility/check` endpoint
- [ ] Integrate into frontend: pre-check runs when student clicks "Apply"
- [ ] Display ✅ Eligible / ⚠️ Partial / ❌ Not Eligible with specific messages
- [ ] Add Redis caching (key: `elig:{student_id}:{opp_id}`, TTL: 1 hour)
- [ ] Build NLP-based criteria parser for scraped opportunities with free-text eligibility (Phase 2)

---

## 🕷️ 8. Opportunity Scraper & Aggregator

- [ ] Build base scraper class with common functionality (page load, stealth, error handling)
- [ ] Build Internshala scraper (Playwright + BeautifulSoup)
- [ ] Build Unstop scraper (Playwright + API reverse-engineering)
- [ ] Build Devfolio scraper (BeautifulSoup for hackathons)
- [ ] Build LinkedIn Jobs scraper (Playwright stealth with slow scroll)
- [ ] Add configurable college site scraper (admin provides CSS selectors)
- [ ] Implement anti-detection: playwright-stealth, rotating user-agents, random delays (2-5s)
- [ ] Build AI enrichment pipeline: auto-extract title, description, deadline, stipend, skills, location, company
- [ ] Train and deploy Logistic Regression classifier for opportunity type (7 classes)
- [ ] Build duplicate detection using cosine similarity > 0.85 on TF-IDF vectors
- [ ] Schedule scrapers with APScheduler (Internshala: 6hr, Unstop: 12hr, LinkedIn: daily)
- [ ] Store scraped opportunities in DB with `is_verified=false`
- [ ] Build admin scraper review queue UI (approve / reject / edit before publishing)
- [ ] Build admin source management page (add/remove/enable/disable scrape sources)

---

## ⏰ 9. Smart Deadline Reminder System

- [ ] Set up BullMQ queue with Redis for scheduling reminder jobs
- [ ] Auto-schedule reminders when a student bookmarks or applies (T-7, T-3, T-1 days, T-2 hours)
- [ ] Skip reminders if student has already applied
- [ ] Build email reminder templates (HTML) and send via Resend API
- [ ] Build SMS reminder messages and send via Twilio API
- [ ] Build push notification reminders and send via Firebase Cloud Messaging
- [ ] Build AI priority ranker: rank which reminders matter most based on match score + slot urgency
- [ ] Build reminder preferences UI (let students choose channels: email, SMS, push)
- [ ] Handle edge cases: deadline changed, opportunity deleted, student unsubscribes

---

## 💯 10. Match Score Calculator

- [ ] Build 6-factor weighted scoring function (skill overlap, interest alignment, domain match, branch, CGPA buffer, experience)
- [ ] Implement Jaccard Similarity for skill overlap
- [ ] Implement TF-IDF similarity for interest alignment
- [ ] Build the `/ai/match/score` FastAPI endpoint
- [ ] Cache results in Redis (key: `match:{student_id}:{opp_id}`, TTL: 6 hours)
- [ ] Display match score as percentage badge on every opportunity card
- [ ] Color-code: 🟢 Excellent (90+), 🔵 Good (70-89), 🟡 Fair (50-69), 🔴 Low (<50)

---

## 📊 11. Skill Gap Analyzer

- [ ] Build market skills mapping for 10+ common roles (Software Dev, ML Engineer, Data Analyst, etc.)
- [ ] Compare student's skills against target role requirements
- [ ] Calculate coverage percentage
- [ ] Identify missing skills and rank by market demand
- [ ] Generate personalized learning roadmap with curated resource links
- [ ] Estimate learning time (weeks) based on gap size
- [ ] Build Skill Gap page UI (select target role → see gap report + roadmap)

---

## 🏷️ 12. NLP Auto-Tagging

- [ ] Build tag extractor combining spaCy NER + skill taxonomy keyword matching + TF-IDF keyphrases
- [ ] Auto-tag new opportunities when admin posts or scraper fetches
- [ ] Build `/ai/tags/extract` FastAPI endpoint
- [ ] Display auto-generated tags on opportunity cards (admin can edit before publish)

---

## 🏅 13. Badge & Gamification System

- [ ] Design 10+ badge types with icons and criteria
- [ ] Build badge trigger engine that evaluates rules after every student action
- [ ] Implement triggers: first application, 5 applications, profile complete, resume ace (ATS ≥ 80), etc.
- [ ] Build badge award + notification pipeline
- [ ] Build badge wall UI page showing earned and locked badges
- [ ] Build engagement streak tracker (consecutive days with meaningful actions)
- [ ] Build daily action suggestion based on student context (AI-picked)
- [ ] Add gamification stats to student profile (badges earned, streak, application count)

---

## 🗓️ 14. Calendar Integration

- [ ] Integrate Google Calendar API for one-click "Add to Calendar" on opportunity deadlines
- [ ] Build .ics file download as fallback for Outlook / Apple Calendar
- [ ] Add calendar icon on opportunity detail page

---

## 💬 15. Community & Discussion Forum

- [ ] Design forum database schema (threads, replies, likes, tags)
- [ ] Build forum listing page with categories (Internship Experiences, Interview Tips, Hackathon Teams, General)
- [ ] Build thread creation form
- [ ] Build reply/comment system
- [ ] Build upvote/like feature
- [ ] Add user avatars and badges next to forum posts

---

## 🔗 16. Referral System

- [ ] Build unique referral link generation per student
- [ ] Track referral sign-ups and award credit
- [ ] Award "Referral Champion" badge at 5 converted referrals
- [ ] Display referral stats on student profile

---

## 🎨 17. UI/UX Design & Frontend Polish

- [ ] Design and build stunning landing page (hero section, feature cards, stats, testimonials, CTA)
- [ ] Implement dark/light mode toggle
- [ ] Add Framer Motion animations (page transitions, card hovers, loading states)
- [ ] Build responsive layouts for all pages (mobile, tablet, desktop)
- [ ] Use shadcn/ui component library for consistent design system
- [ ] Add loading skeletons and optimistic UI updates
- [ ] Add toast notifications for user actions (applied, saved, error, etc.)
- [ ] Design and implement 404 and error pages
- [ ] Add favicon and meta tags for SEO

---

## 🧪 18. Testing

- [ ] Write unit tests for auth functions (JWT sign/verify) with Vitest
- [ ] Write unit tests for eligibility checker logic
- [ ] Write unit tests for recommendation score functions
- [ ] Write integration tests for auth flow (register → verify → login)
- [ ] Write integration tests for application flow
- [ ] Write E2E tests with Cypress/Playwright (student journey: register → profile → browse → apply)
- [ ] Write E2E tests for admin journey (login → post opportunity → see applicants)
- [ ] Run Lighthouse audit and achieve score > 85 on all core pages
- [ ] Run load test with k6 for 100 concurrent users

---

## 🚀 19. DevOps & Deployment

- [ ] Write Dockerfiles for backend and AI service
- [ ] Write production Docker Compose file
- [ ] Set up CI/CD pipeline with GitHub Actions (lint → test → build → deploy)
- [ ] Deploy frontend to Vercel with auto-deploy on main branch
- [ ] Deploy backend to Railway (Docker container)
- [ ] Deploy AI service to Railway (Python container)
- [ ] Set up Neon.tech for serverless PostgreSQL
- [ ] Set up Upstash for serverless Redis
- [ ] Set up Cloudinary for file storage
- [ ] Configure production environment variables and secrets
- [ ] Set up Sentry for error monitoring
- [ ] Write comprehensive README with setup instructions

---

## 📋 20. Documentation & Demo

- [ ] Write project README (overview, setup, features, screenshots, tech stack, contributing guide)
- [ ] Create demo seed data script (fake students, opportunities, applications, badges)
- [ ] Record a demo walkthrough video or prepare a slide deck
- [ ] Document all API endpoints with request/response examples
- [ ] Write Architecture Decision Records for key design choices

---

## 📌 Summary — Total Build Scope

| Category | Items |
|---|---|
| Infrastructure & Setup | 12 items |
| Authentication | 10 items |
| Student Module | 28 items |
| Admin Module | 18 items |
| AI Recommendation Engine | 11 items |
| AI Resume Analyzer | 12 items |
| Eligibility Checker | 9 items |
| Opportunity Scraper | 14 items |
| Deadline Reminders | 9 items |
| Match Score Calculator | 7 items |
| Skill Gap Analyzer | 7 items |
| NLP Auto-Tagging | 4 items |
| Gamification / Badges | 8 items |
| Calendar Integration | 3 items |
| Community Forum | 6 items |
| Referral System | 4 items |
| UI/UX Polish | 9 items |
| Testing | 9 items |
| DevOps & Deployment | 12 items |
| Documentation & Demo | 5 items |
| **TOTAL** | **~197 action items** |

---

> **Every checkbox above is a concrete action I will take. The technical HOW (algorithms, frameworks, schemas, code) lives in [plan.md](./plan.md).**
