# Matt's Gutter Cleaning

A premium marketing website **and** a complete online booking system (Calendly-style),
built as one modern Next.js app.

- **Marketing site** (`/`): hero, services, pricing, reviews, before/after gallery, process,
  areas covered, FAQ, contact + quote form. Full SEO (LocalBusiness / FAQ / Review schema,
  sitemap, robots, OG/Twitter cards), dark/light mode, responsive, accessible.
- **Booking system** (`/book`): multi-step wizard with live price estimates, interactive map
  confirmation, real availability and double-booking prevention.
- **Admin dashboard** (`/admin`): bookings management (accept / reject / reschedule / cancel /
  complete), search + filters, today / week / calendar views, stats, CSV export, availability
  config, and a 12-month annual-reminder system.

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (CSS-variable theming, class-based dark mode) |
| Animation | Motion (`motion/react`) |
| Icons | Phosphor Icons |
| Forms | React Hook Form + Zod |
| ORM / DB | Prisma 7. SQLite for local dev, Postgres (Supabase) for production |
| Auth | Signed JWT session cookie (`jose`). Swappable for NextAuth/Clerk |
| Email | Resend (degrades to console logging when no API key) |

## Getting started (local)

```bash
npm install
cp .env.example .env       # then edit the values
npx prisma generate
npx prisma db push         # creates the local SQLite dev.db
npm run dev                # http://localhost:3000
```

Local dev uses **SQLite** out of the box (no database server needed). Without a `RESEND_API_KEY`
emails are printed to the server console, so the full booking flow works offline.

Admin login is at `/admin` (default dev password `gutters123`, set via `ADMIN_PASSWORD`).

## Configuration

All business details (name, phone, address, hours, rating, areas) live in
[`src/lib/business.ts`](src/lib/business.ts). Pricing lives in
[`src/lib/pricing.ts`](src/lib/pricing.ts). Copy (services, reviews, FAQ, gallery) lives in
[`src/lib/content.ts`](src/lib/content.ts).

### Adding real photos
- **Before/after gallery:** drop images in `public/gallery/` and update the `gallery` array in
  `src/lib/content.ts` (see `public/gallery/README.md`).
- **Hero image / logo:** see `public/brand/README.md`.

## Deploying to production (Vercel or Cloudflare)

SQLite is for local dev only. For production use **Supabase Postgres** (free tier is plenty):

1. Create a Supabase project and copy the **pooled** connection string.
2. In [`prisma/schema.prisma`](prisma/schema.prisma) change the datasource provider to
   `postgresql`.
3. Swap the adapter in [`src/lib/prisma.ts`](src/lib/prisma.ts) for the Postgres one:
   ```bash
   npm install @prisma/adapter-pg pg
   ```
   ```ts
   import { PrismaPg } from "@prisma/adapter-pg";
   const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
   ```
4. Set environment variables on your host (`DATABASE_URL`, `AUTH_SECRET`, `ADMIN_PASSWORD`,
   `RESEND_API_KEY`, `EMAIL_FROM`, `NEXT_PUBLIC_SITE_URL`, `CRON_SECRET`).
5. Run migrations: `npx prisma migrate deploy`.
6. Deploy (`vercel` or connect the repo to Cloudflare Pages).

### Scheduled reminders
The daily reminder job lives at `GET /api/reminders`. Trigger it once a day with a cron
(Vercel Cron or Cloudflare Cron Trigger) sending `Authorization: Bearer <CRON_SECRET>`. It sends
12-month annual reminders and day-before appointment reminders.

### SMS (future)
The email layer in `src/lib/email.ts` is structured so a Twilio (or other) SMS provider can be
added alongside it without restructuring. Placeholder env vars are in `.env.example`.

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build
npm run start    # run the production build
npm run lint     # eslint
```

## Scope notes

The marketing site, booking flow, admin dashboard, availability engine, auth, email templates and
reminder system are all implemented and working. A few brief items are intentionally left as
clearly-marked extension points rather than finished features: customer self-service accounts
(login + invoice download), Cloudflare Turnstile anti-spam wiring, and live SMS sending. The data
model and API boundaries are in place for each.
