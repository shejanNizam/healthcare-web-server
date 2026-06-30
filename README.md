# CENM Healthcare — Backend API Server

Production-ready REST API for the **CENM Healthcare** nurse-staffing platform serving Southern California and Tennessee. Built with **Express 5**, **TypeScript**, **MongoDB**, and **Redis**.

The API serves two separate frontends:
- **Public website** — Next.js 15 (job listings, applications, blogs, staffing solutions)
- **Admin dashboard** — React + Vite (user management, content, analytics)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ (CommonJS) |
| Framework | Express.js v5 |
| Language | TypeScript 5 |
| Database | MongoDB + Mongoose v9 |
| Cache / OTP Store | Redis v6 |
| Auth | JWT (access + refresh tokens), Passport.js (Google OAuth + local) |
| File Uploads | Multer + Cloudinary |
| Email | Nodemailer (SMTP) + EJS templates |
| Validation | Zod v4 |
| Real-time | Socket.io + Redis adapter |
| Logging | Winston |
| Security | Helmet, Bcrypt, HTTP-only cookies, XSS sanitizer, Mongo sanitizer |
| API Docs | Swagger UI (`/api/v1/docs`) |

---

## Project Structure

```
src/
├── server.ts                        # Entry point — DB/Redis connect, seed admin, graceful shutdown
├── app.ts                           # Express app, global middleware
└── app/
    ├── config/
    │   ├── index.ts                 # Zod-validated env config
    │   ├── cloudinary.config.ts
    │   ├── multer.config.ts
    │   ├── passport.ts              # Google OAuth + local strategy
    │   └── redis.config.ts
    ├── interfaces/
    │   ├── index.d.ts               # Express Request augmentation (req.user)
    │   └── error.types.ts
    ├── errorHelpers/
    │   └── AppError.ts              # Custom operational error class
    ├── helpers/                     # Error normalizers (cast, duplicate, validation, zod)
    ├── middlewares/
    │   ├── checkAuth.ts             # JWT guard + RBAC (role-based access)
    │   ├── validateRequest.ts       # Zod schema middleware
    │   ├── rateLimiter.ts           # Auth, OTP rate limiters
    │   ├── globalErrorHandler.ts
    │   └── notFound.ts
    ├── routes/
    │   └── index.ts                 # Aggregates all module routes under /api/v1
    ├── modules/
    │   ├── auth/                    # Login, logout, refresh token, OAuth, password management
    │   ├── user/                    # Register, profile, admin user management
    │   │   ├── user.auth.service.ts # Healthcare signup/OTP/forget-password/reset flow
    │   │   └── pending_user.model.ts# Temporary pre-verification accounts (TTL index)
    │   ├── value/                   # Dropdown option management (Category, Profession, Specialty…)
    │   ├── job_post/                # Job post CRUD
    │   ├── apply/                   # 3-step job application flow + international applications
    │   ├── notification/            # Admin notifications (auto-fired on new app/contact)
    │   ├── blog/                    # Blog posts (id or slug lookup)
    │   ├── staffing/                # Staffing solution pages + FAQs + whatWeDo
    │   ├── content/                 # About / Terms / Privacy (upsert by type)
    │   ├── banner/                  # Homepage banners
    │   ├── contact/                 # Contact form submissions (auto-marks read on view)
    │   ├── feedback/                # User feedback / testimonials
    │   ├── dashboard/               # Admin overview + monthly chart + user/applicant lists
    │   ├── payment/                 # Payment records
    │   ├── charge/                  # Platform charge/fee configuration
    │   ├── community/               # Community member management
    │   ├── upload/                  # File upload to Cloudinary
    │   ├── otp/                     # OTP generation and verification
    │   └── device_token/            # Push notification device tokens
    └── utils/
        ├── catchAsync.ts
        ├── sendResponse.ts          # Standard response envelope
        ├── sendEmail.ts             # Nodemailer + EJS
        ├── setCookie.ts             # HttpOnly refresh-token cookie
        ├── userTokens.ts            # JWT access + refresh token factory
        ├── QueryBuilder.ts          # Filterable / paginated / sorted query builder
        ├── seedAdmin.ts
        ├── seedSuperAdmin.ts
        └── templates/              # EJS email templates (otp, forgot-password, welcome)
```

---

## Getting Started

**Prerequisites:** Node.js 18+, MongoDB, Redis

```bash
# 1. Clone the repository
git clone <repo-url>
cd healthcare-web-server

# 2. Install dependencies
npm install

# 3. Copy and fill in environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables section below)

# 4. Start development server (loads .env automatically)
npm run dev:local

# 5. Build for production
npm run build

# 6. Start production server
npm start
```

> **Note:** `npm run dev` does **not** load `.env`. Always use `npm run dev:local` in development.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev:local` | Dev server with hot-reload + `.env` loaded via `--env-file` |
| `npm run dev` | Dev server without `.env` (CI/container environments with injected vars) |
| `npm run build` | Compile TypeScript to `dist/` + copy email templates |
| `npm start` | Run compiled server from `dist/server.js` (loads `.env`) |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest test suite |
| `npm run test:coverage` | Jest with coverage report |

---

## Environment Variables

Create a `.env` file in the project root:

```env
# ─── Server ──────────────────────────────────────────────────────────────────
PORT=5000
NODE_ENV=development

# ─── Database ────────────────────────────────────────────────────────────────
DATABASE_URL=mongodb://localhost:27017/cenm_healthcare

# ─── JWT ─────────────────────────────────────────────────────────────────────
JWT_ACCESS_SECRET=your_access_secret_here
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES=30d
JWT_RESET_SECRET=your_reset_secret_here
JWT_RESET_EXPIRES=15m

# ─── Security ────────────────────────────────────────────────────────────────
BCRYPT_SALT_ROUND=12
DEFAULT_PASSWORD=default_password

# ─── Seeded Admin Accounts ───────────────────────────────────────────────────
SUPER_ADMIN_EMAIL=superadmin@cenm.com
SUPER_ADMIN_PASSWORD=SuperAdminPass123
ADMIN_EMAIL=admin@cenm.com
ADMIN_PASSWORD=AdminPass123

# ─── Google OAuth ────────────────────────────────────────────────────────────
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# ─── Session ─────────────────────────────────────────────────────────────────
EXPRESS_SESSION_SECRET=your_session_secret

# ─── CORS ────────────────────────────────────────────────────────────────────
FRONTEND_URL=http://localhost:3000

# ─── Redis ───────────────────────────────────────────────────────────────────
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=
REDIS_PASSWORD=

# ─── Cloudinary ──────────────────────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ─── Email (SMTP) ────────────────────────────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com
```

---

## API Overview

All routes are prefixed with `/api/v1`.  
Full documentation is split into two files:

| Audience | File |
|---|---|
| Public website (Next.js) | [`docs/api-website.md`](docs/api-website.md) |
| Admin dashboard (React + Vite) | [`docs/api-admin.md`](docs/api-admin.md) |

Interactive Swagger UI is available at **`/api/v1/docs`** when the server is running.

---

### Auth — `/api/v1/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/login` | Public | Email + password login |
| POST | `/logout` | Public | Clear refresh token cookie |
| POST | `/refresh-token` | Public | Issue new access token from cookie |
| POST | `/change-password` | All roles | Change own password |
| POST | `/set-password` | All roles | Set password for OAuth-only accounts |
| POST | `/forgot-password` | Public | Send reset link to email |
| POST | `/reset-password` | Reset token | Reset password |
| GET | `/google` | Public | Start Google OAuth flow |
| GET | `/google/callback` | — | Google OAuth callback (handled by Google) |

---

### User — `/api/v1/user`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/signup` | Public | Register — stores pending + sends OTP |
| POST | `/verify-email` | Public | Verify OTP → promote to active user + issue tokens |
| POST | `/resend` | Public | Resend registration OTP |
| POST | `/forget-password` | Public | Send reset OTP to email |
| POST | `/verify-forget-otp` | Public | Verify reset OTP → return reset grant |
| POST | `/reset-password` | Public | Complete reset with grant |
| GET | `/me` | All roles | Get own profile |
| GET | `/my-profile` | All roles | Alias for `/me` |
| POST | `/update` | All roles | Update own profile (name, phone, address, avatar) |
| DELETE | `/me` | All roles | Soft-delete own account |
| POST | `/register` | Public | Direct register (no OTP) |
| GET | `/all-users` | Admin | Paginated user list |
| GET | `/:id` | Admin | Get user by ID |
| PATCH | `/:id` | Admin | Update user (role, status, etc.) |
| DELETE | `/:id` | Admin | Soft-delete user |

---

### Values / Dropdowns — `/api/v1/value`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/all/:group` | Public | List options for a group |
| POST | `/create/:group` | Admin | Add a new option |
| POST | `/update/:group/:id` | Admin | Update an option |
| DELETE | `/delete/:id` | Admin | Soft-delete an option |

**Groups:** `Category` · `Profession` · `Discipline` · `Specialty` · `License` · `Job-type`

---

### Job Posts — `/api/v1/job`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/all` | Public | Paginated + filtered job list |
| GET | `/single/:id` | Public | Single job by ObjectId |
| POST | `/create` | Admin | Create job post |
| POST | `/update/:id` | Admin | Update job post |
| DELETE | `/delete/:id` | Admin | Soft-delete job post |

---

### Applications — `/api/v1/apply`

3-step sequential flow for job applications. International applications omit `jobPostId`.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/personal-info` | Public | Step 1 — personal info (atomic, returns `appliedJobId`) |
| POST | `/create/:id` | Public | Step 2 — professional licenses + certifications |
| PUT | `/education-info/:id` | Public | Step 3 — education + employment history |
| GET | `/all/:id` | Admin | All applications for a job post |
| GET | `/single/:id` | Admin | Full detail of one application |

---

### Dashboard — `/api/v1/dashboard`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/over-view` | Admin | Total jobs / applicants / contacts / users |
| GET | `/:year` | Admin | Monthly applicant counts for the year (all 12 months) |
| GET | `/user-list` | Admin | Paginated user list (same as `/user/all-users`) |
| GET | `/all-international-application` | Admin | All international applications |
| GET | `/single-international-application/:id` | Admin | Single international application |

---

### Blogs — `/api/v1/blog`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/all` | Public | Paginated blog list |
| GET | `/single/:id` | Public | Blog by ObjectId **or** URL slug |
| GET | `/category/blogs` | Public | All distinct categories |
| POST | `/create` | Admin | Create blog post |
| POST | `/edit/:id` | Admin | Update blog post |
| DELETE | `/delete/:id` | Admin | Soft-delete blog post |

---

### Staffing Solutions — `/api/v1/staffing`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/all` | Public | List all staffing pages |
| GET | `/all-faq` | Public | All FAQs across staffing pages |
| GET | `/:id` | Public | Single staffing page (full detail) |
| POST | `/create` | Admin | Create a staffing page |
| POST | `/update/:id` | Admin | Update a staffing page |
| PATCH | `/FQA/:id` | Admin | Add or remove a single FAQ |
| PATCH | `/what_we_do/:id` | Admin | Add or remove a "What We Do" item |

---

### Static Content — `/api/v1`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/about` | Public | About Us content |
| POST | `/about/update` | Admin | Create or replace About content |
| GET | `/terms` | Public | Terms and Conditions |
| POST | `/terms/update` | Admin | Create or replace Terms content |
| GET | `/privacy` | Public | Privacy Policy |
| POST | `/privacy/update` | Admin | Create or replace Privacy content |

---

### Banners — `/api/v1/banner`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List active banners |
| POST | `/create` | Admin | Create a banner |
| PATCH | `/update` | Admin | Update banner (id in request body) |
| DELETE | `/delete` | Admin | Soft-delete banner (id in body or query) |

---

### Contact — `/api/v1/contact`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/create` | Public | Submit enquiry (triggers admin notification) |
| GET | `/all` | Admin | Paginated enquiry list |
| GET | `/single/:id` | Admin | Single enquiry (auto-marks as read) |

---

### Notifications — `/api/v1/notification`

Auto-created when a new application or contact form is submitted.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Admin | All notifications (latest first) |
| PATCH | `/read/:id` | Admin | Mark notification as read |

---

### Feedback — `/api/v1/feedback`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/create` | Logged-in users | Submit feedback (name/email auto-filled) |
| GET | `/all` | Admin | All feedback submissions |

---

### Payment — `/api/v1/payment`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/history` | Admin | Paginated payment records |

---

### Charge — `/api/v1/charge`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Admin | Current charge/fee settings |
| PATCH | `/update` | Admin | Update charge settings |

---

### Community — `/api/v1/community`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Admin | List community members |
| GET | `/details` | Admin | Detail view of a member (`id` in query) |
| DELETE | `/delete` | Admin | Delete a member (`id` in body or query) |

---

### File Upload — `/api/v1/upload`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | — | Upload file to Cloudinary (`multipart/form-data`, field: `file`) |

> Also available at `/api/v1/uploded` (legacy alias).

---

## Response Format

**Success**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {},
  "meta": { "page": 1, "limit": 10, "total": 100, "totalPage": 10 }
}
```

**Error**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation Error",
  "errorMessages": [
    { "path": "body.email", "message": "Invalid email address" }
  ]
}
```

---

## Roles and Access

| Role | Description |
|---|---|
| `super_admin` | Full platform access including all admin operations |
| `admin` | Manage jobs, applications, content, users, and dashboard |
| `user` | Browse jobs, submit applications, manage own profile, leave feedback |

Admin and super-admin accounts are **auto-seeded** on server start from `SUPER_ADMIN_*` and `ADMIN_*` env vars.

---

## Key Features

- **OTP-based signup** — New users go through `PendingUser` → OTP email → verified `User`. MongoDB TTL index auto-purges unverified signups after 24 hours.
- **Two password-reset flows** — Classic reset-link flow via `/auth/forgot-password` and OTP-based flow via `/user/forget-password` + grant token.
- **Token versioning** — `tokenVersion` field on User is bumped on every password reset, invalidating all previously issued JWTs.
- **Atomic application step 1** — MongoDB session/transaction ensures no orphan `JobInfo` records are left if the deduplication check fails.
- **Partial unique index** — `AppliedJob` blocks duplicate local applications to the same job while allowing unlimited international (job-less) applications from the same email.
- **Auto-notifications** — `createNotification()` is called automatically when a new application or contact form is submitted.
- **Soft deletes everywhere** — No hard-deletes. All reads filter `{ isDeleted: false }`.
- **QueryBuilder** — Reusable utility for pagination, sorting, field filtering, and full-text search across all list endpoints.
- **Slug + ObjectId lookup** — Blog posts can be fetched by either MongoDB ObjectId or URL slug in the same endpoint.
- **Auto-seeding** — Super admin and admin accounts are created on first run; skipped on subsequent runs.
- **Graceful shutdown** — Handles `SIGTERM`, `SIGINT`, `unhandledRejection`, `uncaughtException` — closes MongoDB and Redis connections cleanly before exit.
- **Modular architecture** — Each feature is self-contained with its own interface, model, service, controller, validation, and route file.

---

## Rate Limits

| Route group | Limit |
|---|---|
| `/auth/login`, `/auth/forgot-password`, `/auth/change-password`, `/auth/set-password` | 10 req / 15 min per IP |
| `/user/signup`, `/user/forget-password` | 5 req / 15 min per IP |
| `/user/resend` | 3 req / 5 min per IP |

---

## Common Query Parameters

All paginated list endpoints support:

| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: `1`) |
| `limit` | number | Items per page (default: `10`) |
| `sort` | string | Field to sort by; prefix `-` for descending (e.g. `-createdAt`) |
| `searchTerm` | string | Partial-match search across indexed text fields |
| any field | string | Exact filter (e.g. `status=active`, `role=admin`) |
