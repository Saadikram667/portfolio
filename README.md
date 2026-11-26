# portfolio
# Saad Ikram · Crimson Nova — Full-Stack Portfolio

A full-stack personal portfolio and owner CMS built with **React, TypeScript, Django Ninja, and Supabase**, deployed on **Vercel**. Designed around a high-contrast light/dark editorial aesthetic with an interactive **Architecture Tree**, syntax-highlighted project case studies, and a terminal-inspired contact inbox.

**Live Site:** [portfolioweb-beta-black.vercel.app](https://portfolioweb-beta-black.vercel.app/)

---

## Features

### Frontend
* **Interactive Architecture Tree:** Desktop node-graph navigation powered by React Flow (`@xyflow/react`) with branch switching (*Projects*, *Experience*, *Skills*) and one-click view reset, paired with a native vertical tree on mobile.
* **Featured Projects & Case Studies:** Domain-filterable split cards featuring live syntax-highlighted code previews (lazy-loaded & cached via `shiki`), engineering metrics, and accessible detail modals (`CaseStudyModal`).
* **Credentials & Timeline:** Experience, leadership, and education timeline, tiered technical stack (*Daily*, *Comfortable*, *Familiar*), and a certifications showcase with a zoom lightbox.
* **Terminal Contact Form (`connect.sh`):** Validated contact workflow backed by Django Ninja with spam honeypot protection and toast feedback.
* **Theme & Asset Resilience:** Zero-flash Light / Dark theme toggle (`localStorage`-persisted) and automatic media/CV fallback handling.

### Backend & CMS
* **Django Ninja API:** Typed REST endpoints (`/api/portfolio/`, `/api/contact/`) using Pydantic schemas with Edge CDN cache headers (`s-maxage=60, stale-while-revalidate=300`).
* **Owner Studio CMS:** Custom-branded **Django Unfold** admin mounted on a configurable hidden path (`ADMIN_URL_PATH`) to manage profile details, projects, skills, timeline entries, certificates, and inbox messages.
* **Supabase Postgres & S3 Storage:** Uses Supabase Transaction Pooler (`6543`) for serverless requests, Session Pooler (`5432`) for IPv4-compatible migrations, SQLite fallback locally, and Supabase S3 (`django-storages`) for persistent media uploads.
* **Security Hardening:** Brute-force admin lockout via `django-axes`, proxy-aware IP rate limiting (`5/m`) via `django-ratelimit`, HTML stripping on contact inputs, HSTS/secure cookies in production, and Swagger docs restricted to `DEBUG=True`.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite 6, Tailwind CSS 3, React Flow (`@xyflow/react`), Motion, Shiki, Lucide Icons, Sonner |
| **Typography** | Fraunces Variable, Inter Variable, JetBrains Mono Variable (self-hosted via Fontsource) |
| **Backend** | Python, Django, Django Ninja, Django Unfold, Django Axes, `django-ratelimit`, WhiteNoise |
| **Database & Storage** | Supabase PostgreSQL (`psycopg2`, `dj-database-url`), Supabase S3 Storage (`django-storages`), SQLite (local fallback) |
| **Deployment** | Vercel (Static Vite build + Python serverless WSGI function at `api/index.py`) |

---

## Project Structure

```text
portfolio_v2/
├── api/
│   └── index.py                     # Vercel Python serverless entry point
├── backend/
│   ├── config/
│   │   ├── settings.py              # Core Django, Supabase DB/S3, Unfold & security config
│   │   ├── urls.py                  # API & hidden admin routing
│   │   └── wsgi.py                  # WSGI application
│   ├── portfolio/
│   │   ├── management/commands/
│   │   │   └── seed_portfolio.py    # Idempotent portfolio data seeder
│   │   ├── admin.py                 # Django Unfold CMS registrations
│   │   ├── api.py                   # Django Ninja endpoints (/portfolio/, /contact/)
│   │   ├── models.py                # Profile, Project, Skill, TimelineEntry, Certificate, ContactMessage
│   │   └── schemas.py               # Pydantic request/response schemas
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/assets/               # Static logo, portrait, certificates & fallback CV PDF
│   ├── src/
│   │   ├── components/
│   │   │   ├── reactbits/PillNav.tsx
│   │   │   ├── CaseStudyModal.tsx
│   │   │   ├── CertificatesSection.tsx
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── ContactTerminal.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   └── TreeCanvas.tsx
│   │   ├── lib/
│   │   │   ├── api.ts               # API client & fallback payload
│   │   │   ├── media.ts             # S3 download & static fallback resolver
│   │   │   └── motion.ts            # Shared easing & duration tokens
│   │   ├── types/portfolio.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── vercel.json                      # Build config, cache headers & SPA/API rewrites
```

---

## Local Development

### Prerequisites
* **Python 3.12+**
* **Node.js 20+** and **npm**

### 1. Clone the Repository

```bash
git clone [https://github.com/Saadikram667/portfolio.git](https://github.com/Saadikram667/portfolio.git)
cd portfolio
```

### 2. Backend Setup (Django)

```bash
cd backend
python -m venv .venv

# Windows (PowerShell)
.venv\Scripts\Activate.ps1
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

Create `backend/.env` (optional for local SQLite testing; required for Supabase Postgres & S3):

```env
DEBUG=True
DJANGO_SECRET_KEY=<generate-a-strong-secret-key>
ALLOWED_HOSTS=localhost,127.0.0.1,.vercel.app
CSRF_TRUSTED_ORIGINS=http://localhost:5173,[http://127.0.0.1:8000](http://127.0.0.1:8000)
CORS_ALLOWED_ORIGINS=http://localhost:5173
ADMIN_URL_PATH=<custom-admin-slug>

# Database (leave blank to fall back to local SQLite)
USE_DIRECT_DB=False
DATABASE_URL=postgresql://postgres.<PROJECT_REF>:<URL_ENCODED_PASSWORD>@aws-X-<REGION>[.pooler.supabase.com:6543/postgres?sslmode=require](https://.pooler.supabase.com:6543/postgres?sslmode=require)
DIRECT_DATABASE_URL=postgresql://postgres.<PROJECT_REF>:<URL_ENCODED_PASSWORD>@aws-X-<REGION>[.pooler.supabase.com:5432/postgres?sslmode=require](https://.pooler.supabase.com:5432/postgres?sslmode=require)

# Supabase S3 Storage (optional locally; required in production for Admin uploads)
SUPABASE_S3_ENDPOINT=https://<PROJECT_REF>.storage.supabase.co/storage/v1/s3
SUPABASE_S3_REGION=<REGION>
SUPABASE_S3_ACCESS_KEY=<S3_ACCESS_KEY_ID>
SUPABASE_S3_SECRET_KEY=<S3_SECRET_ACCESS_KEY>
SUPABASE_BUCKET=portfolio-media
SUPABASE_PUBLIC_DOMAIN=<PROJECT_REF>.supabase.co/storage/v1/object/public/portfolio-media
```

Run migrations, seed data, create an admin user, and start the backend:

```bash
# If migrating against Supabase, set USE_DIRECT_DB=True first so Django uses port 5432
python manage.py migrate
python manage.py seed_portfolio
python manage.py createsuperuser
python manage.py runserver
```

* API runs at `http://127.0.0.1:8000/api/portfolio/`
* Interactive API docs (local `DEBUG=True` only): `http://127.0.0.1:8000/api/docs`
* Owner CMS: `http://127.0.0.1:8000/<ADMIN_URL_PATH>/`

### 3. Frontend Setup (React + Vite)

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173` and automatically proxies `/api` and `/media` to Django (`http://127.0.0.1:8000`).

### Verification Scripts

```bash
# Frontend typecheck & production build
cd frontend
npm run typecheck
npm run build

# Backend system check
cd ../backend
python manage.py check
```

---

## Deployment (Vercel + Supabase)

1. **Supabase Database:** Use the **Transaction Pooler (port `6543`)** URI for `DATABASE_URL` on Vercel (`conn_max_age=0`, server-side cursors disabled). Use the IPv4 **Session Pooler (port `5432`)** for `DIRECT_DATABASE_URL` when running local migrations.
2. **Supabase Storage:** Create a public bucket named `portfolio-media`, generate S3 Access Keys under **Project Settings → Storage**, and set all `SUPABASE_*` environment variables in Vercel (**without** `https://` in `SUPABASE_PUBLIC_DOMAIN`).
3. **Vercel Environment Variables:** Add all production keys with `DEBUG=False` and `USE_DIRECT_DB=False`. Ensure `ADMIN_URL_PATH` matches the admin rewrite path configured in `vercel.json`.
4. **Deploy from Root:**
   ```bash
   npx vercel --prod
   ```

---

## Author & Links

**Saad Ikram** — *Founder, Crimson Nova (CN)*  
BS Computer Science · DHA Suffa University, Karachi

* **Live Portfolio:** [portfolioweb-beta-black.vercel.app](https://portfolioweb-beta-black.vercel.app/)
* **GitHub:** [@Saadikram667](https://github.com/Saadikram667)
* **LinkedIn:** [Saad Ikram](https://www.linkedin.com/in/saad-ikram-403712392/)
* **Credly:** [Badges & Certifications](https://www.credly.com/users/saad-ikram.3a64e354/badges)
* **Email:** [saadikramansari@gmail.com](mailto:saadikramansari@gmail.com)
