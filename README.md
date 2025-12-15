# 🌌 Starwoven Datacore

A full-stack sci-fi data platform powering the details & lore behind the **Starwoven** universe.

This project serves as both a **world-building tracker** and a **technical showcase**.

---

## 🚀 What This Project Is

**Starwoven Datacore** is a centralized knowledge base for the _Starwoven_ universe, containing:

- Characters
- Ships
- Factions
- Locations
- Technology
- Lore
- Episodes (well, brief synopses of the planned 1st season.)

Each category is dynamically loaded from a real database via a custom API and rendered through a modern React/Next.js frontend.

---

## 🧱 Architecture Overview

This project intentionally mirrors **real-world production architecture**:
Frontend (Vercel)
↓
Backend API (Fastify on Render)
↓
Database (Supabase Postgres + Prisma)

---

## 🖥️ Frontend

**Tech:**

- Next.js (App Router)
- React
- Tailwind CSS
- Server Components + dynamic data fetching

**Highlights:**

- Server-side rendering with live API data
- Graceful fallback states when APIs are unavailable
- Responsive card-based UI
- Clean aesthetic consistent with the Starwoven universe

The frontend is deployed on **Vercel**, with environment-based configuration to dynamically target the production backend.
https://starwoven-datacore.vercel.app/

---

## ⚙️ Backend API

**Tech:**

- Fastify
- TypeScript
- Prisma ORM
- RESTful routes

**Highlights:**

- Modular route structure (`/api/characters`, `/api/ships`, etc.)
- Typed database access via Prisma
- Production-safe CORS configuration
- Health check endpoint (`/health`)
- Deployed independently on **Render** (my first time using Render!)

The backend acts as the authoritative source of truth between the frontend and the database.

---

## 🗄️ Database & ORM

**Tech:**

- Supabase (PostgreSQL)
- Prisma Client
- Prisma Migrations
- Prisma Studio

**Highlights:**

- Strong relational modeling (characters ↔ ships ↔ factions)
- Production migrations via `prisma migrate deploy`
- Initial bootstrap via Prisma seed
- Live data editing via Prisma Studio (_super handy for making many entries!_)
- Safe separation between schema, seed data, and editorial content

### Connection pooling

To support hosted environments, the project uses:

- **Supabase Transaction Pooler** for runtime queries
- **Direct Postgres connection** for migrations
- Prisma configured with `pgbouncer=true` for pooler compatibility

This avoids prepared-statement issues common in pooled environments.

---

## 🌱 Seeding Strategy

The seed script is designed to:

- Create **initial canonical records**
- Avoid destructive overwrites of editorial content
- Serve as a one-time bootstrap, not a content authoring tool

After seeding:

- Content is edited directly via **Prisma Studio**
- Changes persist immediately without code changes or redeploys

---

## 🔐 Environment Configuration

Sensitive configuration is handled exclusively via environment variables:

### Backend (Render)

- `DATABASE_URL` → Supabase transaction pooler
- `DIRECT_URL` → Supabase direct connection

### Frontend (Vercel)

- `NEXT_PUBLIC_API_BASE_URL` → Render backend URL

---

## 🧠 Lessons & Takeaways

This project intentionally tackles real production challenges, including:

- Multi-service deployment coordination (this gave some solid frustration for about a day as I worked to figure out deploying via 3 different services)
- Database connection pooling
- Prisma + Postgres edge cases
- Environment-specific configuration
- Data seeding vs. live content management
- Debugging “works locally, breaks in production” issues

The result is a system that behaves like a real application — not just a class demo.
_It's real to me lol_

---

## ✨ Future Enhancements

- Admin-only content editing UI
- Full-text search
- Tag-based filtering
- Timeline visualization
- Read-only public API access

---

## 🧵 About Starwoven

_Starwoven_ is an original science-fiction universe exploring identity, found family, and survival at the edges of civilization. The Datacore serves as both a narrative companion and a technical backbone for future storytelling projects.

---

> Built with equal parts curiosity, stubbornness, and caffeine. "=)"
