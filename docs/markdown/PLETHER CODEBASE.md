# Plether — Project Overview

A Tether clone (stablecoin platform). Three deployed apps talking to one backend API.

---

## Repos

| Repo | Purpose | Live URL |
|------|---------|----------|
| `backend-plether-06-14-2025-2` | Rust API server | https://api.plether.co.uk |
| `frontend-plether-06-14-2025-2` | Public-facing React app | https://plether.co.uk |
| `internal-plether-06-14-2025-2` | Authenticated dashboard | https://internal.plether.co.uk |
| `admiend-plether-06-14-2025-2` | Docs, assets, admin reference | GitHub only |
| `scraper-news-plether-06-14-2025-2` | News scraper Lambda | AWS Lambda |

---

## All URLs

**Backend API**
- Production: https://api.plether.co.uk/health
- Staging: https://staging-api.plether.co.uk/health

**Frontend**
- Production: https://plether.co.uk
- Staging: https://staging-frontend.plether.co.uk

**Internal**
- Production: https://internal.plether.co.uk
- Staging: https://staging-internal.plether.co.uk
- Via frontend routing: https://plether.co.uk/app/

---

## Backend — Rust / Axum

**Stack**: Rust, Axum, Diesel ORM, PostgreSQL, Docker, ECS Fargate.

**Startup sequence:**
1. Loads config from environment variables
2. Creates PostgreSQL connection pool (R2D2 + Diesel)
3. Runs pending database migrations (embedded at compile time — baked into the binary)
4. Creates a single shared `AuthenticationService` instance
5. Spawns background task — runs every hour to clean up expired pending users
6. Starts HTTP server on port 5678

**Middleware stack** (applied to every request):
- TraceLayer — HTTP request logging
- Security headers — CSP, HSTS, X-Frame-Options etc
- Cookie layer — tower-cookies
- CORS — environment-aware (loose in dev, strict in prod)
- CSRF — token validation on mutating requests
- TokenStore — in-memory token tracking

**API routes:**
- `GET /health` — load balancer health check
- `GET /csrf-token` — frontend fetches before any mutating request
- `POST /api/authentication/check-email` — step 1 of signup, sends verification email
- `GET /api/authentication/verify` — user clicks email link, validates token
- `POST /api/users/signup` — step 2, creates full user record
- `POST /api/authentication/login` — login, returns JWT in httpOnly cookie
- `POST /api/authentication/logout` — clears cookies
- `POST /api/authentication/refresh` — rotates access/refresh tokens
- `POST /api/authentication/setup-2fa` / `verify-2fa-enable` / `disable-2fa` — Google Authenticator TOTP (partially implemented)
- `GET/PATCH /api/users/profile` — get/update own profile (protected)
- `GET /api/users/` — get all users (protected)
- `GET/PATCH/DELETE /api/users/{id}` — user management (protected)

**Authentication model:**
- Access token — JWT, 15 minute expiry, httpOnly cookie
- Refresh token — JWT, 7 day expiry, httpOnly cookie
- Tokens rotated on refresh
- Passwords hashed with Argon2

**Two-step signup flow:**
1. User enters email → `check-email` → backend creates a `pending_users` record with a UUID token, sends verification email via SES
2. User clicks email link → `verify` → backend validates token, deletes pending user record, returns verified email to frontend
3. Frontend collects full signup data → `signup` → backend creates permanent user record in `users` table

**Database:**
- PostgreSQL on RDS (`plether-server-db.cub2nefawn1o.us-east-1.rds.amazonaws.com`)
- Production DB: `plether_server` — Staging DB: `plether_server_staging`
- Diesel ORM with compile-time query validation
- Tables: `users`, `pending_users`, `api_keys`

**Notifications:**
- Discord webhook fires on new user signup and on every email check request (with IP geolocation)
- SES via SMTP for transactional emails: verification email, login reminder, successful login alert

---

## Frontend — React / TypeScript / Vite

**Stack**: React 19, TypeScript, Vite, Redux Toolkit, React Router 7, CSS Modules.

**What it is**: Public-facing app at `plether.co.uk`. Marketing pages plus the full signup and login flow.

**Key pages:**
- Initial splash / landing
- Security & Performance page
- CI/CD & Deployment page
- Login flow
- Signup flow (multi-step: email → verify → account info → address → trading amount → services/terms)
- 2FA pages

**API communication:**
- All requests go through `apiService.ts` which handles CSRF token fetching and retry logic (up to 3 retries with exponential backoff on 403s)
- JWT token stored in localStorage as `plether_authentication_token`
- On successful login, sets a cookie with `domain=.plether.co.uk` so the internal app can pick it up

---

## Internal App — React / TypeScript / Vite

**Stack**: Same as frontend — React 19, TypeScript, Vite, Redux Toolkit, React Router.

**What it is**: Authenticated dashboard at `internal.plether.co.uk`, also accessible via `plether.co.uk/app/` through a CloudFront cache behavior on the external distribution.

**What it does:**
- Reads auth token from the cross-subdomain cookie set by the frontend on login
- Transfers token to localStorage, clears the cookie
- Fetches user profile from `/api/users/profile`
- Displays dashboard with Holdings, Transactions, TopNav, BottomNav components
- 5-minute localStorage cache on user data to reduce API calls

**CloudFront routing:**
- `plether.co.uk` distribution (`EFWGZ7NHYRBKM`) has a cache behavior: `/app/*` → `internal.plether.co.uk` S3 bucket
- No redirect — URL stays as `plether.co.uk/app/...`
- Both apps remain in separate repos, separate S3 buckets, separate deployments

---

## How Deployment Works

### Branch Strategy
```
feature → Development → Staging → Production → main
```
- `Staging` branch triggers staging deployment
- `Production` branch triggers production deployment
- Each branch owns its own workflow files (protected by `.gitattributes` merge driver)
- `main` mirrors Production

### Frontend & Internal (S3 + CloudFront)
```
Push to branch
  → GitHub Actions
  → npm ci
  → Vite build
  → AWS credentials (access key)
  → S3 sync
  → CloudFront invalidation
  → Discord notification
```
~5 minutes total.

### Backend (ECS Fargate)
```
Push to branch
  → Test & Security job (cargo fmt, clippy, tests, cargo audit)
  → Build & Scan job (Docker build, Trivy vulnerability scan, push to ECR)
  → Backup job (RDS snapshot)
  → Deploy job (update ECS task definition, rolling deployment, health checks)
  → Notify job (Discord pipeline summary)
```
~15-20 minutes total.

ECS rolling deployment: new container starts → runs migrations → passes health check → traffic shifts over → old container terminated. Zero downtime.

### Discord Notifications
Every pipeline posts a summary to a dedicated Discord channel:

| Channel | Trigger |
|---------|---------|
| `github-backend-production` | Backend production pipeline |
| `github-backend-staging` | Backend staging pipeline |
| `github-frontend-production` | Frontend production pipeline |
| `github-frontend-staging` | Frontend staging pipeline |
| `github-internal-production` | Internal production pipeline |
| `github-internal-staging` | Internal staging pipeline |
| `aws-backend-production` | Health monitor — production down |
| `aws-backend-staging` | Health monitor — staging down |

---

## AWS Infrastructure

| Service | Purpose |
|---------|---------|
| ECS Fargate | Runs backend containers (public subnets, `assignPublicIp=ENABLED`) |
| ECR | Docker image registry (`plether-server-staging`, `plether-server-production`) |
| RDS PostgreSQL | Database (`db.t3.small`, private subnets) |
| ALB | Load balancer routing to ECS (`plether-server-alb-940809361.us-east-1.elb.amazonaws.com`) |
| S3 | Static hosting for frontend and internal apps |
| CloudFront | CDN for all 5 distributions |
| Route 53 | DNS for `plether.co.uk` (hosted zone `Z071394224COERN925DPC`) |
| ACM | SSL cert `fb4c5b0b` covering all 7 domains |
| SES | Transactional email via SMTP (`no-reply@plether.co.uk`) |
| WorkMail | `scottfeichter@plether.co.uk` mailbox |
| GitHub Actions OIDC | Keyless auth for backend deployments |

---

## Merge Scripts

| Script | Location | Run from | Does |
|--------|----------|----------|------|
| `mergeDevelopment.sh` | `Z__Scripts/GitHub/` | `Development` | Merges up through Staging → Production → main |
| `mergeStaging.sh` | `Z__Scripts/GitHub/` | `Staging` | Merges up through Production → main |
| `mergeProduction.sh` | `Z__Scripts/GitHub/` | `Production` | Merges down to main, Staging, Development |
| `mergeProduction.sh` | each repo `scripts/` | `Production` | Same as above, repo-local copy |
| `mergeStaging.sh` | frontend/internal `scripts/` | `Staging` | Merges up through Production → main |

Workflow files are protected from accidental overwrite during merges via `.gitattributes`:
```
.github/workflows/* merge=ours
```
Requires one-time global setup: `git config --global merge.ours.driver true`
