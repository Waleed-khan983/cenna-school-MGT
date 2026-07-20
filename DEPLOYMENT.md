# Deployment Guide

This covers taking CENNA School Management System from local development to a
live deployment. For local dev setup and a feature overview, see `README.md`.

## 1. Prerequisites

- A MongoDB Atlas cluster (or equivalent). **The cluster used throughout this
  project's hardening work is the Atlas free tier, which has no automatic
  snapshot backups.** Before putting real student/parent/fee data on it,
  either upgrade to a tier with backups or set up a scheduled `mongodump`
  export yourself — several fixes in this project's history (index
  migrations, ownership fixes) were done carefully specifically *because*
  no automatic recovery existed.
- A Cloudinary account (uploads: avatars, admission documents, CVs, lecture
  attachments, gallery/news images).
- An SMTP provider for outgoing email (admission confirmations, fee/attendance
  alerts). Gmail SMTP works but needs an **app password**, not your normal
  account password.
- Node.js (version matching what's in each `package.json`'s engines/lockfile).

## 2. Environment variables

Copy and fill in:
- `cenna-backend/.env.example` → `cenna-backend/.env`
- `cenna-frontend/.env.example` → `cenna-frontend/.env.local`

Both files document every variable actually read by the code, which ones are
required vs. optional, and which have safe defaults. A few call-outs:

- **`JWT_SECRET`** — must be a long random value in production, not the dev
  placeholder.
- **`NODE_ENV=production`** — required. This turns off Mongoose's `autoIndex`
  (index changes must go through a reviewed migration, not an implicit
  background build on every boot — see §5) and hides stack traces from API
  error responses (`middleware/error.js` only includes `stack` when
  `NODE_ENV === "development"`).
- **`CLIENT_URL`** — must list your real frontend origin(s), comma-separated
  if there's more than one (e.g. production + staging). Anything not on this
  list gets a 403 from CORS.
- **`NEXT_PUBLIC_API_URL`** (frontend) — has **no fallback default** in
  `services/api.js` on purpose (defaulting to `localhost` in production would
  be actively wrong). If this is unset in your build, every API call breaks
  silently. Double-check it's actually set wherever you configure frontend
  build-time env vars.

## 3. Cloudinary — one dashboard setting still required

**Settings → Security → enable PDF/ZIP delivery.**

This was found and re-confirmed live multiple times during this project's
hardening work and was never enabled. Until it is:
- Lecture attachment PDFs (public delivery) return 401.
- Admission documents (resultCard/SLC/CNIC) submitted as PDF are **also**
  blocked, even though they use signed/authenticated delivery — the
  restriction turned out to apply to `resource_type:"image"` PDFs regardless
  of public vs. authenticated access. CVs are unaffected (`resource_type:
  "raw"` bypasses it).

After enabling it, verify DOC/DOCX/PPT/PPTX delivery separately — do not
assume the same toggle covers every format; only PDF/ZIP was tested.

## 4. Legacy local file uploads — check your host's filesystem persistence

Before the Cloudinary migration, uploads were saved to `cenna-backend/uploads/`
and served via `app.use("/uploads", express.static(...))` (`server.js`). That
static route is still active, and any database record created before the
migration still stores a literal `/uploads/...` path (avatars, admission
docs, etc. — the migration was never run against historical records, by
design, to avoid touching real data during this project's tiered hardening).

**If you deploy to a platform with an ephemeral filesystem** (common on
Heroku/Render/most container platforms — local disk is wiped on every
redeploy or restart), the physical files in `uploads/` will not survive a
redeploy, and any old record still pointing at `/uploads/...` will start
404ing. Either:
- deploy somewhere with a persistent volume for `cenna-backend/uploads/`, or
- accept that pre-migration file links will break after the first redeploy
  (new uploads are unaffected — they all go to Cloudinary), or
- run a one-time migration of historical `/uploads/...` records to Cloudinary
  before decommissioning local storage (not done as part of this project —
  it touches real historical records and needs its own explicit, reviewed
  pass, same caution as any other data migration in this project's history).

## 5. Database indexes

`config/db.js` sets `autoIndex: false` when `NODE_ENV=production`. This is
intentional: `autoIndex` only ever *adds* indexes that are missing — it never
drops one that's deployed but no longer in the schema, which is exactly how
two real index-drift bugs went undetected in this project (a stale 3-field
Attendance index that blocked marking more than one period/day, and an
undocumented Class index tied to a field the schema had stopped defining).

A read-only `checkIndexDrift()` (`utils/indexSync.js`) runs once at every
boot and **logs a warning** if a deployed compound index doesn't match the
schema — it never modifies anything itself. If you see a warning on a fresh
production boot, treat it exactly like the two cases above: inspect the
deployed index, back up the collection, run the duplicate-conflict check
before touching anything, then apply an explicit, reviewed `dropIndex`/
`createIndex` — never let it happen automatically.

## 6. Build & start

Backend:
```bash
cd cenna-backend
npm install
npm start        # node server.js
```

Frontend:
```bash
cd cenna-frontend
npm install
npm run build     # next build
npm start         # next start
```

## 7. Post-deploy smoke test

- `GET /api/health` returns `{"success": true, ...}`.
- Log in as each role at least once (admin, teacher, student, parent,
  coordinator, accountant, operator) and confirm the dashboard loads.
- Submit a test admission application (use an obviously fake name/email) and
  confirm: the application saves, the response's `emailSent` field matches
  whether your SMTP credentials actually work, and no 500 occurs either way.
- Upload one avatar image and confirm it's publicly reachable.
- Check server logs for any `⚠️ Index drift` warning on boot.

## 8. Authorization status — final patch applied

All confirmed record-level authorization/ownership gaps have been closed:

- `GET /remarks/student/:studentId` — now enforces parent-ownership and
  teacher-class-assignment checks (previously trusted the role only).
- `GET /attendance/student/:studentId` — now enforces teacher-class-assignment
  (parent check already existed).
- `GET /attendance/report/monthly` — a teacher must now specify a class
  they're actually assigned to; previously `classId` was optional and
  unchecked, so any teacher could pull a school-wide attendance report.
  Admin's unrestricted, classId-optional behavior is unchanged.
- Coordinator granted read access to `/results`, `/results/student/:studentId`,
  `/students`, `/students/:id`, and `/students/class/:classId` — unrestricted,
  matching the same trust level already given to this role on every existing
  coordinator monitoring endpoint. Write access (create/update/delete) on all
  of these remains admin/teacher-only, unchanged.
- `class-subjects/teacher/:teacherId` — deliberately left coordinator-only-if-
  already-authorized per the original instruction; coordinator was never
  authorized here and still isn't (no ask to change it).

## 9. Known gaps and pending decisions

These are not deployment blockers, but they're unresolved product/scope
questions surfaced during this project's hardening work — none were
addressed because they need a decision from the project owner, not because
they were missed:

- **Parent lecture/quiz viewing**: no backend route exists at all for a
  parent to see a child's lectures or quizzes.
- **Parent-teacher messaging**: a `ParentMessage` model exists but is
  imported and never used by any route or controller — the model is real,
  the API surface for it doesn't exist.
- **Parent-teacher meetings, certificates (operator), fee-structure
  management (operator)**: no backend support of any kind for any of these
  three — would need new models/controllers/routes from scratch, explicitly
  out of scope for every tier of this project.
- **~17 of the ~27 originally-hardcoded portal pages** are still hardcoded —
  only pages with real, matching backend support were wired; the rest need
  backend work first (see the gaps above for several of them).
- **`coordinator/teacher-performance`** and the underlying evaluation system
  (legacy vs. new) were explicitly left untouched throughout — that's a
  business decision, not an oversight.
- **SMS** (`utils/helpers.js#sendSMS`) is a stub — it logs to console and
  returns `true`, it does not send a real SMS. The example integration code
  is commented out in the source.
