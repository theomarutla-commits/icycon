# Icycon SEO Dashboard

This project now includes an SEO-focused Django app with a React-driven dashboard.

## Setup

1. Activate your virtual environment and install the requirements (Django and friends):
   ```bash
   pip install -r requirements.txt
   ```
   *(If `requirements.txt` does not exist yet, just install Django manually.)*
2. Run migrations:
   ```bash
   python manage.py migrate
   ```
3. Load sample metadata so the dashboard has initial data:
   ```bash
   python manage.py load_seo_samples
   ```

## Running the app

- Start Django's development server:
  ```bash
  python manage.py runserver
  ```
- Open the React dashboard at `http://localhost:8000/seo/dashboard/`.
  - The frontend loads React and Babel from CDN and talks to `/seo/api/pages/`.
  - The dashboard displays tracked pages and lets you save metadata (the API requires CSRF cookies).

## API Contract

- `GET /seo/api/pages/` returns the list of `PageMeta` entries.
- `GET or POST /seo/api/pages/<slug>/` reads or upserts metadata for that slug.

## Authentication stories

- Visit `http://localhost:8000/` to see the landing page that explains the SEO workflow.
- Use `/signup/` to create a new user (the view logs you in automatically so you can continue to the dashboard).
- Use `/login/` to authenticate after you previously created credentials, or `/logout/` to end the session.

## Backlink tracking

- The dashboard now surfaces backlinks per slug, letting you see all tracked references and add new ones directly from the UI.
- `GET /seo/api/pages/<slug>/backlinks/` lists the backlinks for a page while `POST` lets you submit new URLs, anchor text, source, follow status, and lifecycle tags (`active`, `pending`, `lost`).
 - The SEO dashboard now has a Directories panel; `GET or POST /seo/api/directories/` lets you track important citation/listing opportunities and see them alongside metadata.

## Site management

- Define site records (name, domain, description) from the dashboard and tie them to tracked pages for centralized oversight.
- Use the Sites panel in the React UI to create a domain, then select it from the metadata form when saving a page.
- The API exposes `GET or POST /seo/api/sites/` so you can seed or synchronize domain data externally.

## Social media management

- After logging in, the home page lets you register social profiles (platform, handle, URL, description) and keeps them tied to your account.
- This backend links to each user so team members can see who manages which handles and surface that info alongside SEO work.
- Visit `/accounts/social/dashboard/` (linked in the main nav) to open the React-based social publishing console that lists profiles and logs posts.
- The new `/accounts/profile/` page lets you upload an avatar, add a bio, and preview quick links to every dashboard (SEO, marketplace, social) from a single place.
- The `/accounts/support/` page summarizes Vapi AI’s assistant capabilities, and the floating Vapi badge in the corner follows you around every page so you always know how to get help.

## Marketplace

- Users can create products or services (name, type, price, description) via the dashboard and view aggregated sales/revenue per item.
- Track each sale with quantity/total price and log interactions (calls, emails, social posts, etc.) against a product.
- The header exposes a `/marketplace/dashboard/` link so signed-in users can jump straight to the dedicated marketplace React workspace.
- The API exposes `POST /marketplace/api/products/`, `POST /marketplace/api/products/<id>/sales/`, and `POST /marketplace/api/products/<id>/interactions/` for programmatic integrations.
- The marketplace summary card now highlights total revenue and the top performer so you have quick insight into campaign health.

## App store optimization

- A dedicated `/aso/dashboard/` page surfaces AppListing metadata (store, bundle ID, rating, downloads) plus lightweight metrics.
- Use `POST /aso/api/listings/` to welcome new listings (including optional metrics data) and track store-level performance.
- Visit `/aso/overview/` for a Django-rendered gallery of each listing’s metadata and metrics, making ASO data review-friendly for non-technical stakeholders.

## Deployment tips

- Install dependencies with `pip install -r requirements.txt`, run `python manage.py migrate`, and collect static files via `python manage.py collectstatic --noinput` before pointing your server at the Django WSGI entry point.
- Set the usual Django environment variables in your host environment (`DJANGO_SETTINGS_MODULE=icycon.settings`, `SECRET_KEY`, `DEBUG=false`, `ALLOWED_HOSTS`, etc.) and ensure any custom database or email credentials are also configured.
- Route `/static/` to the `staticfiles` directory produced by `collectstatic`, and expose `/sitemap.xml` if you want crawlers to discover each tracked `PageMeta`.

## Email notifications

- New account registrations trigger a welcome email via Django’s email API. In development this flows through the console backend (`settings.py`), so messages appear in the terminal output.
- To send real email, override `EMAIL_BACKEND`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, etc., and keep `DEFAULT_FROM_EMAIL` pointed at a verified address.
