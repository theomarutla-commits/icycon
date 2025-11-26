# Icycon Monorepo (Frontend + Backend)

This repo contains:
- `frontend/` — Vite/React SPA.
- `backend/` — Django REST API (with DRF, JWT, CORS, and feature endpoints).

## Frontend
- Stack: Vite + React + TypeScript.
- Key paths: `frontend/App.tsx`, `frontend/components/`, `frontend/pages/`, `frontend/lib/api.ts`.
- Auth: Basic Auth stored as `Authorization` header; profile stored in `localStorage`.
- Feature pages: `/features/:slug` show marketing copy. `/features/:slug/data` provides forms to post data to the backend.
- Env: set `VITE_API_BASE` (e.g., your Render backend URL) in Vercel.
- Run locally:
  ```bash
  cd frontend
  npm install
  npm run dev -- --host --port 3000
  ```

## Backend
- Stack: Django 4.2 + DRF + JWT + CORS.
- Key paths: `backend/icycon/icycon/api_views.py`, `api_urls.py`, `settings.py`.
- Auth endpoints: `/api/auth/signup`, `/api/auth/login`, `/api/token/…`.
- Feature endpoints align with the frontend services (SEO, AEO, social, email, multilingual, backlinks/directories, ASO, marketplace, content).
- Media: `MEDIA_URL=/media/`, `MEDIA_ROOT=media`; avatar upload supported.
- Env vars (minimum): `DJANGO_SETTINGS_MODULE=icycon.settings`, `SECRET_KEY`, `ALLOWED_HOSTS`, `DEBUG`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`, optional `OPENAI_API_KEY`.
- Run locally:
  ```bash
  cd backend
  python -m venv .venv
  .\.venv\Scripts\activate   # on Windows; use source .venv/bin/activate on macOS/Linux
  pip install -r requirements.txt
  python icycon/manage.py migrate
  python icycon/manage.py runserver 0.0.0.0:8000
  ```

## Deployment
- Frontend on Vercel: `vercel.json` builds `frontend/` (`npm run build`, output `dist`). Set `VITE_API_BASE` to the backend URL.
- Backend on Render: `render.yaml` sets root `backend/`, `gunicorn icycon.wsgi:application --bind 0.0.0.0:$PORT`, and env vars. Add `ALLOWED_HOSTS/CORS_ALLOWED_ORIGINS/CSRF_TRUSTED_ORIGINS` for your Vercel domain, and provision Postgres if you need persistence.

## Links between frontend and backend
- Auth flow: frontend calls `/api/auth/login` and `/api/auth/signup`; stores Basic auth; fetches `/api/features/` to confirm.
- Profile: `/api/profile/dashboard` (GET/PATCH, multipart for avatar).
- Feature data pages: each `/features/:slug/data` form posts to the corresponding backend endpoint (e.g., SEO keywords, directories, FAQs, social posts, email assets, ASO apps, marketplace products, translations).
