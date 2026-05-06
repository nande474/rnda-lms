# RNDA Learning Portal — Setup Guide

## Tech Stack
- Next.js 16 (App Router) · TypeScript · Tailwind CSS
- NextAuth v5 (Google OAuth)
- Prisma v7 · SQLite (local) / PostgreSQL (production)

## Quick Start

### 1. Google OAuth Credentials
1. Go to console.cloud.google.com → Create Project → "RNDA LMS"
2. APIs & Services → OAuth consent screen → External
3. Add scopes: `email`, `profile`
4. Credentials → Create OAuth Client ID → Web application
5. Authorised redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret

### 2. Configure Environment Variables
Edit `.env`:
```
DATABASE_URL="file:./dev.db"
AUTH_GOOGLE_ID="paste-your-client-id"
AUTH_GOOGLE_SECRET="paste-your-client-secret"
AUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Run
```bash
npm run dev
```
Visit http://localhost:3000 → Sign in with Google → You'll be a STUDENT by default.

### 4. Make Yourself Admin
After first login, run this once:
```bash
npx tsx scripts/make-admin.ts your@email.com
```
(or manually update `role` in the database)

### 5. Logo
Place the RNDA logo at `public/logo.png` and it will appear in the portal.

## User Roles
| Role    | Can do                                         |
|---------|------------------------------------------------|
| STUDENT | Browse & enroll in courses, track progress     |
| TEACHER | Create & manage courses, add lessons & quizzes |
| ADMIN   | Manage all users, promote roles, view all data |

## Pre-seeded Content
The database already contains 11 STEM courses across Grades 5–12:
- **Mathematics**: Numbers (G5), Geometry (G6), Algebra (G7), Functions (G9), Geometry (G10), Trig (G11), Calculus (G12)
- **Life Science**: Plants & Animals (G5)
- **Physical Science**: Atoms & Matter (G7), Electricity (G12)
- **Computer Science**: Fundamentals (G8)

## Production Deployment
1. Switch to PostgreSQL: update `DATABASE_URL` in `.env` and `prisma.config.ts`
2. Update `provider = "postgresql"` in `prisma/schema.prisma`
3. Run `npx prisma migrate deploy`
4. Deploy to Vercel, Railway, or any Node.js host
5. Update `NEXTAUTH_URL` to your domain
6. Add production redirect URI in Google Cloud Console
