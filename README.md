# Icycon

A multi-tenant web application for managing digital marketing and content.

## Setup

1. Clone the repository:
```bash
git clone https://github.com/agentikxai/icycon_.git
cd icycon_
```

2. Create a virtual environment and install dependencies:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
# Copy the example env file and edit with your values
cp .env.example .env
```

Required environment variables:
- `DJANGO_SECRET_KEY`: Django secret key
- `OPENAI_API_KEY`: Your OpenAI API key
- `EMAIL_HOST_USER`: Email sending account
- `EMAIL_HOST_PASSWORD`: Email account password/app password

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

The server will run at http://127.0.0.1:8000
Visit http://127.0.0.1:8000/admin to access the admin interface.

## Development

- The project uses python-dotenv for environment variable management
- Environment variables are loaded from `.env` file in the project root
- Never commit `.env` file - use `.env.example` as a template
- Keep `requirements.txt` updated when adding new dependencies

 ## Notes
 -dry run user is the obly one who can see the chat bot admins cannot 

## Deploying to Heroku

1. Register for a free Heroku account: https://signup.heroku.com/
2. Install the Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
3. Login and create a new app:
	```bash
	heroku login
	heroku create your-app-name
	```
4. Set environment variables in Heroku dashboard (Settings > Config Vars):
	- DJANGO_SECRET_KEY
	- OPENAI_API_KEY
	- EMAIL_HOST_USER
	- EMAIL_HOST_PASSWORD
	- DJANGO_ALLOWED_HOSTS (e.g. your-app-name.herokuapp.com)
	- DJANGO_DEBUG (optional, set to False)
5. Deploy:
	```bash
	git push heroku master
	heroku run python manage.py migrate
	heroku run python manage.py collectstatic --noinput
	```
6. Visit your app at https://your-app-name.herokuapp.com


## Deploying to Vercel

Quick notes to prepare this project for Vercel:

- Required environment variables (set in Vercel dashboard):
	- `DJANGO_SECRET_KEY`
	- `OPENAI_API_KEY`
	- `EMAIL_HOST_USER`
	- `EMAIL_HOST_PASSWORD`
	- `DJANGO_ALLOWED_HOSTS` (comma-separated, e.g. `yourdomain.com,vercel.app`)
	- `DJANGO_DEBUG` (optional, set to `False` in production)


- Vercel will install dependencies from `requirements.txt` and use `icycon/wsgi.py` as the app entrypoint. Vercel runs Python code as serverless functions; to ensure static files are available you should run `collectstatic` during the build. Set the following Build Command in the Vercel project settings:

```bash
python -m pip install -r requirements.txt
python manage.py collectstatic --noinput
```

- In the Vercel dashboard set Environment Variables (Project Settings > Environment Variables):
	- `DJANGO_SECRET_KEY`
	- `OPENAI_API_KEY`
	- `EMAIL_HOST_USER`
	- `EMAIL_HOST_PASSWORD`
	- `DJANGO_ALLOWED_HOSTS` (comma-separated)
	- `DJANGO_DEBUG` (optional)

- Note: Vercel's runtime is serverless — it does not run a persistent Gunicorn process. The `Procfile` and `runtime.txt` used by Heroku-style buildpacks are not required for a Vercel-only deployment.


## Frontend (React + Vite) integration with Django

This repository includes a React frontend (in `frontend/`) built with Vite. The recommended integration is to build the frontend into Django's static files and let Django serve the built SPA.

Quick steps (build for production):

1. Install Node dependencies at the project root (or in `frontend/` if you prefer):

```bash
# from repo root
npm install
```

2. Build the frontend. The Vite config was updated to output into `static/frontend/`:

```bash
npm run build
```

3. Collect static files and run Django (or run server in development):

```bash
# collect static into STATIC_ROOT (for production)
python manage.py collectstatic --noinput
# run Django
python manage.py runserver
```

Now visiting `/` will serve the built React `index.html` from `static/frontend/index.html`. If the frontend hasn't been built yet the app will fall back to the server-rendered `home.html` template so the site still functions.

Development workflow (recommended):

- Run the Django backend locally:

```bash
python manage.py runserver
```

- In a separate terminal run the Vite dev server for the React app (hot reload):

```bash
npm run dev
```

If your React app needs to call the Django API during development, either:

- Enable CORS for the dev origin (e.g. http://localhost:3000) by setting `CORS_ALLOWED_ORIGINS` or enabling `CORS_ALLOW_ALL_ORIGINS` in `.env` while debugging; or
- Configure Vite proxy rules to forward /api/* to the Django server.

Security note: Do not enable permissive CORS in production.

## Running Both Servers (Development)

To run both the Django backend and React frontend development servers simultaneously for a full-stack development experience:

### Terminal 1: Start Django backend

```bash
# From the repository root, activate the virtual environment if not already active
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Navigate to the Django app directory and run the server
cd icycon
python manage.py runserver
```

The Django backend will be available at: **http://127.0.0.1:8000**

Admin panel: **http://127.0.0.1:8000/admin**

### Terminal 2: Start React dev server (Vite)

```bash
# From the repository root (in a new terminal window)
npm run dev
```

The React dev server will be available at: **http://127.0.0.1:3000**

### Which URL to use?

During development:
- **For the React frontend with hot-reload**: http://127.0.0.1:3000
- **For the built/production version served by Django**: http://127.0.0.1:8000 (after running `npm run build && python manage.py collectstatic --noinput`)

The React dev server (port 3000) includes hot module replacement (HMR) so changes to your React code are reflected instantly in the browser.

The Django server (port 8000) serves:
- The built React SPA at `/` (when the frontend has been built)
- Django REST API endpoints for your backend services
- The admin interface at `/admin`

````

