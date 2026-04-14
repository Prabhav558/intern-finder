# 📊 OpportuNest Database

PostgreSQL database management with Prisma ORM.

## Setup

### 1. Start PostgreSQL (Docker)

```bash
cd ../docker
docker-compose up -d postgres
```

Verify connection:
```bash
docker-compose exec postgres psql -U opportunest -d opportunest
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Migrations

First time setup:
```bash
npm run migrate
# Or with a name:
npx prisma migrate dev --name init
```

This will:
- Create all database tables based on schema.prisma
- Generate Prisma Client

### 4. Seed Demo Data (Optional)

```bash
npm run seed
```

This creates:
- Default admin account (admin@opportunest.com / Admin@123)
- 3 demo student accounts
- Demo opportunities (internships, hackathons, scholarships)
- Demo badges

## Common Commands

### View Database

```bash
npm run studio
# Opens Prisma Studio at http://localhost:5555
```

### Create New Migration

After modifying `schema.prisma`:

```bash
npx prisma migrate dev --name add_feature_name
```

### Reset Database (Development Only)

**⚠️ WARNING: This deletes all data**

```bash
npx prisma migrate reset
```

### Generate Client

```bash
npm run generate
```

### Check Migration Status

```bash
npx prisma migrate status
```

## Schema Overview

### Core Tables

| Table | Purpose |
|---|---|
| `users` | All user accounts (students, admins, companies) |
| `student_profiles` | Student-specific information |
| `companies` | Company/Organization profiles |
| `opportunities` | Job listings, internships, hackathons, etc. |
| `applications` | Student applications to opportunities |
| `bookmarks` | Saved opportunities |
| `badges` | Badge definitions |
| `student_badges` | User badge achievements |
| `notifications` | User notifications |
| `deadline_reminders` | Email/SMS reminder scheduling |
| `scrape_sources` | External data sources for scraper |
| `review_feedback` | AI recommendation feedback |
| `sessions` | Active user sessions |

## Environment Variables

Create `.env` in this directory:

```env
DATABASE_URL=postgresql://opportunest:opportunest_dev@localhost:5432/opportunest
```

## Troubleshooting

### Migration Fails

```bash
# Check migration status
npx prisma migrate status

# Resolve migration issues
npx prisma migrate resolve --rolled-back "init"
```

### Client Out of Sync

```bash
npm run generate
```

### Cannot Connect to Database

```bash
# Verify PostgreSQL is running
docker-compose ps

# Check logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

## Development Workflow

1. **Modify schema.prisma** with your changes
2. **Create migration**: `npm run migrate`
3. **Test changes** in your application
4. **Push to Git** with migration files

## Production Deployment

```bash
# Apply pending migrations
npm run migrate:prod

# Or with Render/Railway:
npx prisma migrate deploy
```

## Documentation

- [Prisma Docs](https://www.prisma.io/docs/)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Schema Visualization](./schema.prisma)

---

**Database Version:** PostgreSQL 16
**ORM:** Prisma 5.8.0
