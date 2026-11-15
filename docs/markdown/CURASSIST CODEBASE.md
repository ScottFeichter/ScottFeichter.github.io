# CurAssist — Codebase & Deployment Overview

**Production URL**: https://sfsgcurassist.com

CurAssist is an internal curation tool for ShelterTech volunteers. It lets curators review, edit, and submit nonprofit org records to the [SF Service Guide](https://www.sfserviceguide.org) (SFSG). Records are stored in MongoDB Atlas and hydrated into an HTML form template at request time.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 (via nvm) |
| Language | TypeScript → compiled to `dist/` |
| Framework | Express 4 |
| Database | MongoDB Atlas (Mongoose ODM) |
| Process manager | PM2 (`ecosystem.config.js`) |
| Hosting | AWS EC2 t3.micro (us-east-1) |
| Reverse proxy | Nginx + Let's Encrypt SSL |
| CI/CD | GitHub Actions (`.github/workflows/deploy.yml`) |
| Logging | Winston with daily-rotate-file |
| Testing | Jest + supertest + mongodb-memory-server |

---

## Codebase Structure

```
src/
  entry.ts                    # App entry point — loads env, starts server
  config/env-module.ts        # Loads .env/.env.{NODE_ENV}, validates required vars
  server/
    server.ts                 # Express app setup (middleware, routes, error handling)
    routes/                   # Route handlers (buckets, SF proxy, dev/docs)
    data-integrity/           # Per-field sanitizers and validators
      sanitizer-validation-controller.ts
      shared/                 # Fields shared by org + service
      organization/           # Org-only fields
      service/                # Service-only fields
      location/               # Address component sanitizers
      phone/                  # Phone component sanitizers
    helpers/                  # Server-side utility functions
    middlewares/              # Express middleware (CSRF, rate limit, etc.)
  database/
    atlas.ts                  # Mongoose connect/disconnect
    models/
      org.model.ts            # Org schema (embedded services + history audit trail)
      bucket.model.ts         # Bucket metadata schema
  public/frontend/
    index.html                # Single-page UI shell
    app.js                    # Frontend app logic
    Scripts/
      collector.js            # Extracts field values from iframe DOM
      transform.js            # Maps form data → SFSG API payload shape
      submitNewOrg.js         # 3-step SFSG submit (create org → services → change_requests)
      submitService.js        # Submits a standalone service to an existing org
  views/backendHTML/          # EJS templates for dev/docs pages
  tests/
    unit/                     # Sanitizer, transform, and hydrateTemplate tests
    integration/              # API route tests (supertest + in-memory MongoDB)
    _helpers/                 # testConfig, testData, testUtils
  utils/logger/               # Winston logger setup
  types/ts-definitions.d.ts   # Shared TypeScript type definitions

content/Templates/
  orgServTemplate-combined.html   # Master HTML form template (built from components)
  build-template.js               # Assembles combined template from component files

scripts/
  build-lookup-tables.js      # Fetches SFSG categories/eligibilities → lookup tables
  typedoc-runner.js           # TypeDoc wrapper
```

---

## Data Model

All data lives in MongoDB Atlas. There are no files on disk in production.

```
Atlas DB: curassist (prod) / curassist-dev (dev)
  orgs      — org documents
              ├── embedded services[]
              ├── bucket (e.g. "DCYF 10.01.25")
              ├── status: "incomplete" | "pending" | "complete"
              └── history[]  — full audit trail of every save/move/submit
  buckets   — bucket metadata (name, createdBy, timestamps)
```

Buckets and subdirectories are UI concepts — they map to `bucket` and `status` fields on the org document, not filesystem folders.

---

## Request Flow

```
Browser → Nginx (443) → Express (5555)
                              ├── GET /api/buckets/:bucket/:subdir/:id
                              │     → fetch org from Atlas
                              │     → hydrate orgServTemplate-combined.html
                              │     → return populated HTML
                              │
                              ├── POST /api/buckets/save
                              │     → sanitize/validate fields
                              │     → update org in Atlas + append history entry
                              │
                              └── POST /api/sf/*  (proxy)
                                    → forward to sfserviceguide.org/api/*
                                    → log request/response
                                    → return response to browser
```

---

## Submit Flow (SFSG)

Triggered by the "Submit" button in the browser:

1. `collector.js` — extracts all field values from the iframe DOM
2. `transform.js` — maps form data to SFSG API payload shape
3. `submitNewOrg.js` — three sequential API calls:
   - `POST /api/resources` — create org (name, addresses, phones, notes, schedule)
   - `POST /api/resources/:id/services` — add services
   - `POST /api/resources/:id/change_requests` — set `alternate_name` + `internal_note` (silently ignored on create)
4. Server writes the new SFSG `id` back to Atlas and sets `status = "complete"`

The batch submit path (`create-bucket-spreadsheet-submit`) reuses `submitNewOrg()` for each org.

---

## Environment Variables

Loaded by `src/config/env-module.ts` from `.env/.env.{NODE_ENV}` (gitignored).

| Variable | Purpose |
|----------|---------|
| `NODE_ENV` | `development` \| `production` \| `test` |
| `SERVER_PORT` | Express listen port (5555) |
| `BASE_URL` | Full origin URL |
| `WINSTON_LOG_LEVEL` | Log verbosity (`debug` in dev, `info` in prod) |
| `DB_CONNECT` | MongoDB Atlas connection string |

`NODE_ENV` must be set before the app starts — PM2 sets it via `ecosystem.config.js` in production; `dev-runner.js` sets it to `development` locally.

---

## Local Development

```bash
npm install
mkdir .env && cp .env/.env.example .env/.env.development
# fill in DB_CONNECT and other vars
npm run dev        # full build + start with auto-restart
```

Open `http://localhost:5555`. The `/test` page lists all endpoints and links to docs.

### Build steps (run by `npm run build`)

1. `build-lookup-tables.js` — fetches SFSG categories/eligibilities, writes lookup tables
2. `build-template.js` — assembles `orgServTemplate-combined.html` from component files
3. `tsc` — compiles TypeScript to `dist/`
4. `cp -r src/views dist/ && cp -r src/public dist/` — copies static assets
5. `typedoc-runner.js` — generates API docs to `docs/typedocs/`

---

## Testing

Tests never touch Atlas or the running dev server.

```bash
npm test                  # all tests
npm run test:unit         # sanitizers, transform, hydrateTemplate
npm run test:integration  # API routes via supertest + in-memory MongoDB
npm run test:coverage     # with coverage report
```

- `NODE_ENV=test` is set automatically by all test scripts
- Winston uses a silent transport — no log files written during tests
- Each integration test gets a fresh in-memory DB
- CSRF tokens are fetched via a real `GET /api/csrf/restore` call using a cookie-persisting agent
- First run on a new machine downloads a MongoDB binary (~100MB) via `mongodb-memory-server`

---

## Deployment

### Infrastructure

```
GitHub (production branch)
    │  push triggers GitHub Actions
    ▼
EC2 t3.micro (us-east-1)  —  ip: 54.197.109.5
    ├── Nginx (ports 80/443)  →  reverse proxy to localhost:5555
    │     └── Let's Encrypt SSL (auto-renews via certbot systemd timer)
    ├── Express app (port 5555)  —  managed by PM2
    └── .env/.env.production  —  gitignored, lives only on server
```

### Branch strategy

| Branch | Purpose |
|--------|---------|
| `development` | All active work |
| `staging` | Pre-production testing |
| `production` | Triggers auto-deploy to EC2 |

Workflow: `development` → `staging` → `production`

### CI/CD (`.github/workflows/deploy.yml`)

On push to `production`, GitHub Actions SSHs into EC2 and runs:

```bash
pm2 stop curassist
git pull origin production
npm install
npm run build
pm2 start ecosystem.config.js --env production
```

Secrets required in GitHub repo settings: `EC2_HOST`, `EC2_USER`, `EC2_KEY` (base64-encoded PEM).

### SSH access

```bash
ssh -i ~/.ssh/curassist-key.pem ec2-user@54.197.109.5
```

Key is at `~/.ssh/curassist-key.pem`. Run `chmod 600` if SSH refuses it.

If the instance is stopped:
```bash
aws ec2 start-instances --instance-ids i-0af1c43da4bab3b6c --region us-east-1
```

### Nginx config (`/etc/nginx/conf.d/curassist.conf`)

```nginx
server {
    server_name sfsgcurassist.com www.sfsgcurassist.com;
    client_max_body_size 50m;   # must match Express json limit

    location / {
        proxy_pass http://localhost:5555;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl;  # certs managed by Certbot
    ...
}
```

Useful Nginx commands:
```bash
sudo nginx -t                    # validate config
sudo systemctl reload nginx      # apply changes (no downtime)
sudo systemctl status nginx
sudo cat /var/log/nginx/error.log
```

### MongoDB Atlas

- Cluster: `nodeexpressprojects.fctmvi1.mongodb.net`
- Prod DB: `curassist` | Dev DB: `curassist-dev`
- EC2 instance IP must be whitelisted in Atlas → Network Access
- No S3 or filesystem storage — Atlas handles all persistence and backups

### Manual redeploy (if CI/CD fails)

```bash
ssh -i ~/.ssh/curassist-key.pem ec2-user@54.197.109.5
cd ~/CurAssist
git pull origin production
npm install
npm run build
pm2 restart curassist
```

---

## Key Docs

| File | Contents |
|------|---------|
| `docs/deployment-DB-noS3.md` | Full deployment guide (current MongoDB architecture) |
| `docs/ssh-and-nginx.md` | SSH connection details, Nginx config reference |
| `docs/spreadsheet-data-flow.md` | How spreadsheet columns map to org/service fields |
| `docs/spreadsheet-format.md` | Spreadsheet column header guide for bucket creation |
| `docs/tests.md` | Test coverage documentation |
| `docs/todo.md` | Active todo list |
| `docs/typedocs/` | Auto-generated TypeDoc API documentation |
