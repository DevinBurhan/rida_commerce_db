# Invoice Diary

Full-stack invoice management for a clothing business. Next.js (App Router), MongoDB, JWT auth, and a mobile-first dashboard.

## Setup

1. **Environment**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`: set `MONGODB_URI`, `JWT_SECRET`, and optionally `ADMIN_EMAIL` / `ADMIN_PASSWORD` for the seed user.

2. **MongoDB**

   Ensure MongoDB is running (e.g. local or Atlas). Update `MONGODB_URI` in `.env.local` if needed.

3. **Seed admin user**

   ```bash
   npm run seed
   ```

   Default credentials (if not set in `.env.local`): `admin@example.com` / `admin123`.

4. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). You are redirected to `/dashboard`; if not logged in, you’ll be sent to `/login`.

## API

- **Auth:** `POST /api/auth/login` — body: `{ email, password }`, returns `{ token, user }`.
- **Invoices:** `GET/POST /api/invoices` (list with `?page`, `limit`, `search`, `dateFrom`, `dateTo`); `GET/PUT/DELETE /api/invoices/:id`; `PATCH /api/invoices/:id/payment` — body: `{ amountPaid? }` or `{ isPaymentDone: true }`.
- **Dashboard:** `GET /api/dashboard/summary` — returns `totalInvoices`, `totalRevenue`, `totalPaidAmount`, `totalPendingAmount`.

All invoice and dashboard routes require `Authorization: Bearer <token>`.

## Invoice number

Format: `YYYYMMDD-XX` (e.g. `20260319-01`). Counter resets per day; generated from the DB to avoid duplicates.

## Tech

- **Backend:** Next.js API routes, Mongoose, JWT, bcrypt, Zod, Decimal.js (calculations).
- **Frontend:** React, TanStack Query, Tailwind; Decimal.js used for form calculations.
