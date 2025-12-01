# Icycon Monorepo (Frontend + Backend)

This repo contains:
- `frontend/` - Vite/React SPA.
- `backend/` - Django REST API (with DRF, JWT, CORS, and feature endpoints).

## Feature coverage & flows (mapped to icycon_summary.pdf)
- SEO (website + local):
  - Backend: `/api/analytics/sites`, `/api/seo/sites`, `/api/seo/keywords`, `/api/seo/content`, `/api/seo/faqs`, `/api/seo/backlinks`, `/api/seo/directories`.
  - Frontend: forms at `/seo/data` and `/data-entry`.
  - Flow: add site → seed keywords/content/FAQs/backlinks/directories.
- AEO (answer-engine optimization):
  - Backend: `/api/aeo/readiness` (LLM/stored checklist) plus SEO/AEO forms.
  - Frontend: `/aeo/data` for FAQs/content/backlinks/directories, plus readiness runner.
  - Flow: run readiness → act on quick actions → rerun with `regenerate=true`.
- Social & community:
  - Backend: `/api/social/accounts|posts|conversations|comments|engagement|messages|schedule/`.
  - Frontend: Social page + dashboard cards; create posts/scheduled posts in `/data-entry`.
  - Flow: add posts or schedule via `/api/social/schedule/`; due scheduled posts auto-publish on fetch.
- Email & SMS revenue:
  - Backend: `/api/email/lists|templates|flows|contacts|sends|sms|campaigns/`, marketing summary.
  - Frontend: forms in `/data-entry`; SMS fallback uses user `phone_number`.
  - Flow: add list/templates/contacts → send email/SMS or launch campaigns (send now or schedule).
- Translation:
  - Backend: `/api/translate/` (OpenAI if available; stub otherwise).
  - Frontend: translation form in `/data-entry`.
  - Flow: supply text/target_lang (or url); receive translated content.
- Multilingual SEO:
  - Backend: `/api/multilingual/summary`, `/api/translate`.
  - Frontend: Data entry + dashboard display.
- Ethical link earning / digital PR:
  - Backend: `/api/seo/backlinks`, `/api/seo/directories`, `/api/seo/pr-pitches/`.
  - Frontend: forms in `/data-entry`.
  - Flow: add opportunities/backlinks/directories/pitches.
- Curated directories & citations:
  - Backend: `/api/seo/directories`.
  - Frontend: forms in SEO/AEO data pages.
- Free Zone (microtools/ideas):
  - Backend: `/api/free-zone` (LLM with persistence).
  - Frontend: form in `/data-entry`, dashboard quick actions.
- ASO:
  - Backend: `/api/aso/apps|keywords|listings`.
  - Frontend: `/data-entry`, dashboard stats.
- Marketplace & software directories:
  - Backend: `/api/marketplace/products|orders|reviews|saved|conversations|messages`.
  - Frontend: `/data-entry`, dashboard stats.
- Trending blog engine (repurpose/scheduling):
  - Backend: `/api/seo/content`, `/api/seo/repurpose/` (LLM snippets).
  - Frontend: repurpose form in `/seo/data`.
- Leads/CRM:
  - Backend: `/api/leads/` (public POST, auth GET).
  - Frontend: `/leads` page and `/data-entry` card.
- Dashboard report:
  - Backend: `/api/report/dashboard/?range=today|7d|30d|90d|custom&start_date&end_date` (PDF).
  - Frontend: dashboard “Download Report” with range presets/slider.
- Password reset:
  - Backend: `/api/auth/request-reset` (email if exists) and `/api/auth/confirm-reset` to set new password.
  - Frontend: not wired; call via API or add a simple form.
- Usage/tasks:
  - Backend stubs for usage/tasks are present in dashboard report and features; add billing limits as needed.
- Auth flow:
  - Backend: `/api/auth/signup`, `/api/auth/login`.
  - Frontend: `/auth` with phone capture (E.164). Basic auth stored locally.
- SMS config: set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`; SMS POST falls back to the authenticated user's `phone_number` if `to_number` is omitted.

Notes: Free Zone/AEO readiness can use OpenAI if `OPENAI_API_KEY` is set; otherwise stubs persist. Repurpose and report are synchronous; long-running or async queues can be added later.

## Frontend
- Stack: Vite + React + TypeScript.
- Key paths: `frontend/App.tsx`, `frontend/components/`, `frontend/pages/`, `frontend/lib/api.ts`.
- Auth: Basic Auth stored as `Authorization` header; profile stored in `localStorage`.
- Feature pages: `/features/:slug` show marketing copy. `/features/:slug/data` provides forms to post data to the backend.
- API base resolution: prefers `VITE_API_BASE`; otherwise auto-points to `http://localhost:8000` when running on localhost, or the current origin if the SPA is served by the backend.
- Run locally:
  ```bash
  cd frontend
  npm install
  npm run dev -- --host --port 3000
  ```

## Backend
- Stack: Django 4.2 + DRF + JWT + CORS.
- Key paths: `backend/icycon/icycon/api_views.py`, `api_urls.py`, `settings.py`.
- Auth endpoints: `/api/auth/signup`, `/api/auth/login`, `/api/token/*`.
- Feature endpoints align with the frontend services (SEO, AEO, social, email, multilingual, backlinks/directories, ASO, marketplace, content).
- Media: `MEDIA_URL=/media/`, `MEDIA_ROOT=media`; avatar upload supported.
- Env vars (minimum): `DJANGO_SETTINGS_MODULE=icycon.settings`, `SECRET_KEY`, `ALLOWED_HOSTS`, `DEBUG`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`; optionally `FRONTEND_URL` (added to CORS), `OPENAI_API_KEY`, email/Twilio creds.
- Run locally:
  ```bash
  cd backend
  python -m venv .venv
  .\.venv\Scripts\activate   # on Windows; use source .venv/bin/activate on macOS/Linux
  pip install -r requirements.txt
  python icycon/manage.py migrate
  python icycon/manage.py runserver 0.0.0.0:8000
  ```

## Connecting frontend + backend
- Local dev: start the backend (`runserver 0.0.0.0:8000`) then `npm run dev -- --host --port 3000` in `frontend/`. With no env vars set, the SPA will call `http://localhost:8000` automatically.
- Deployed: set `VITE_API_BASE` in the frontend (e.g., `https://your-backend.onrender.com`). On the backend, set `CORS_ALLOWED_ORIGINS`/`CSRF_TRUSTED_ORIGINS` to your frontend domain(s) (comma-separated) and ensure `ALLOWED_HOSTS` includes your backend hostname.
- Quick connectivity check: hit `/` or `/api/features/` on the backend (e.g., `curl https://your-backend/api/features/`) and load `/dashboard` in the frontend to confirm authenticated requests succeed.

## Deployment
- Frontend on Vercel: `vercel.json` builds `frontend/` (`npm run build`, output `dist`). Set `VITE_API_BASE` to the backend URL.
- Backend on Render: `render.yaml` sets root `backend/`, `gunicorn icycon.wsgi:application --bind 0.0.0.0:$PORT`, and env vars. Add `ALLOWED_HOSTS/CORS_ALLOWED_ORIGINS/CSRF_TRUSTED_ORIGINS` for your Vercel domain(s), and provision Postgres if you need persistence.
