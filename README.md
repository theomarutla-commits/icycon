# Icycon Monorepo

Frontend and backend now live side by side in this repo.

## Project layout
- `backend/` – Django REST API (`manage.py`, apps, sqlite DB, `.venv`, `requirements.txt`)
- `frontend/` – Vite/React SPA (`App.tsx`, components, `package.json`, `.env.local`)
- `.gitignore` and `.vscode/` remain at the repo root

## Backend (Django)
```bash
cd backend
.\.venv\Scripts\activate      # or source .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
python icycon/manage.py migrate
python icycon/manage.py runserver 0.0.0.0:8000
```
- API base: `http://localhost:8000`
- CORS/CSRF already allow the frontend dev origins (3000/3001/8000).
- Auth endpoints used by the frontend:
  - `POST /api/auth/signup` (email, username, password, password_confirm)
  - `POST /api/auth/login` (email, password) – returns user info; use Basic auth for subsequent calls.

## Frontend (Vite/React)
```bash
cd frontend
npm install
npm run dev -- --host --port 3000
```
- API base is set via `frontend/.env.local` (`VITE_API_BASE=http://localhost:8000`); adjust if the backend runs elsewhere.

## Basic wiring check
1) Start the backend on `:8000`.
2) Start the frontend on `:3000`.
3) In the UI, sign up or log in; the app stores a Basic auth header and calls `GET /api/features/` to verify the session.
4) You can also curl an endpoint directly:
```bash
curl -u "email:password" http://localhost:8000/api/features/
```

Both services should now talk to each other locally with no extra configuration. Adjust `ALLOWED_HOSTS`/`CORS_ALLOWED_ORIGINS` in `backend/icycon/settings.py` if you expose the backend on a different host.
