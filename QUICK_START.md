# Quick Start Guide

## Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

## 1️⃣ First Time Setup

```bash
# Clone/enter project
cd c:/Users/mothe/Desktop/icycon2

# Install Python dependencies (if not done)
cd icycon
pip install -r requirements.txt

# Install Node dependencies (if not done)
cd ..
npm install

# Run database migrations
cd icycon
python manage.py migrate
```

## 2️⃣ Development Mode

### Option A: Both Servers (Recommended for Development)

**Terminal 1: Django Backend**
```bash
cd c:/Users/mothe/Desktop/icycon2/icycon
python manage.py runserver 8000
```
- Backend: http://127.0.0.1:8000
- Admin: http://127.0.0.1:8000/admin

**Terminal 2: React Frontend (Hot Reload)**
```bash
cd c:/Users/mothe/Desktop/icycon2
npm run dev
```
- Frontend: http://localhost:3000

### Option B: Production Build (Django Serves Everything)
```bash
cd c:/Users/mothe/Desktop/icycon2

# Build frontend
npm run build

# Start Django
cd icycon
python manage.py runserver 8000
```
- Access: http://127.0.0.1:8000
- Django serves both API and SPA

## 3️⃣ Account Creation

### Via Frontend
1. Go to http://localhost:3000 (dev) or http://127.0.0.1:8000 (prod)
2. Click "Sign Up"
3. Enter email, username, password
4. You'll be logged in automatically with token saved

### Via API (curl)
```bash
curl -X POST http://127.0.0.1:8000/users/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "username":"myusername",
    "password":"MyPassword123!",
    "password_confirm":"MyPassword123!"
  }'
```

Response:
```json
{
  "email": "user@example.com",
  "username": "myusername",
  "token": "0b8540656bca5536aac343471a808eca35e1d7c6"
}
```

## 4️⃣ Using the Application

### Login
1. Click "Log In" on landing page
2. Enter email and password
3. You're redirected to dashboard

### Navigate Features
From dashboard sidebar, access:
- **Dashboard** - Overview (placeholder for now)
- **SEO Tools** - SEO sites and keywords
- **ASO** - App Store Optimization apps
- **Marketplace** - Digital products
- **Analytics** - Website analytics
- **Social Media** - Social accounts and posts
- **Email Engine** - Email lists and templates
- **Profile** - User profile
- **Account** - Account & billing

## 5️⃣ Test API Endpoints

```bash
# 1. Signup
RESPONSE=$(curl -s http://127.0.0.1:8000/users/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"Test1234!","password_confirm":"Test1234!"}')

echo "$RESPONSE"
# Extract token from response: "token":"YOUR_TOKEN_HERE"

# 2. Set token
TOKEN="YOUR_TOKEN_HERE"

# 3. Test endpoints
curl -H "Authorization: Token $TOKEN" http://127.0.0.1:8000/api/dashboard/
curl -H "Authorization: Token $TOKEN" http://127.0.0.1:8000/api/aso/apps/
curl -H "Authorization: Token $TOKEN" http://127.0.0.1:8000/api/marketplace/products/
curl -H "Authorization: Token $TOKEN" http://127.0.0.1:8000/api/analytics/sites/
curl -H "Authorization: Token $TOKEN" http://127.0.0.1:8000/api/social/accounts/
curl -H "Authorization: Token $TOKEN" http://127.0.0.1:8000/api/email/lists/
curl -H "Authorization: Token $TOKEN" http://127.0.0.1:8000/api/seo/sites/
```

## 6️⃣ Admin Panel

```bash
cd c:/Users/mothe/Desktop/icycon2/icycon
python manage.py createsuperuser
```

Then visit: http://127.0.0.1:8000/admin

## 7️⃣ Common Issues

### Problem: "Module not found" error
```bash
cd c:/Users/mothe/Desktop/icycon2
npm install
cd icycon
pip install -r requirements.txt
```

### Problem: Database errors
```bash
cd c:/Users/mothe/Desktop/icycon2/icycon
python manage.py migrate
```

### Problem: Frontend not loading
- Make sure you run `npm run build` first
- Check: http://127.0.0.1:8000 loads the SPA
- If blank, check browser console (F12) for errors

### Problem: "Port already in use"
```bash
# For port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# For port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 8️⃣ Useful Commands

```bash
# Build frontend
cd c:/Users/mothe/Desktop/icycon2
npm run build

# Check Django configuration
cd icycon
python manage.py check

# Reset database
rm db.sqlite3
python manage.py migrate

# View API documentation
# Access: http://127.0.0.1:8000/api/ (DRF browsable API)

# Run tests (if any)
python manage.py test

# Create static files
python manage.py collectstatic --noinput

# Shell access
python manage.py shell
```

## 9️⃣ Project Structure

```
.
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── pages/              # Feature pages
│   │   ├── api/                # API functions
│   │   └── components/         # Reusable components
│   ├── index.html
│   └── vite.config.ts
├── icycon/                      # Django backend
│   ├── users/                  # User management
│   ├── analytics/              # Analytics
│   ├── aso/                    # App Store Optimization
│   ├── marketplace/            # Marketplace
│   ├── seo/                    # SEO Tools
│   ├── social_media/           # Social Media
│   ├── email_engine/           # Email Marketing
│   ├── manage.py
│   └── requirements.txt
├── docs/                        # Documentation
└── README.md
```

## 🔟 Deployment Checklist

Before deploying to production:

- [ ] Update `ALLOWED_HOSTS` in settings.py
- [ ] Set `DEBUG = False`
- [ ] Set `SECRET_KEY` to environment variable
- [ ] Configure production database (PostgreSQL)
- [ ] Set up Redis for caching/sessions
- [ ] Configure static file serving (WhiteNoise or CDN)
- [ ] Set up environment variables (.env file)
- [ ] Configure SSL/TLS certificates
- [ ] Set up error logging (Sentry)
- [ ] Configure email backend
- [ ] Run `npm run build` for production bundle
- [ ] Run `python manage.py collectstatic`
- [ ] Test on staging environment first

---

## 📞 Need Help?

1. Check `FULL_STACK_INTEGRATION_COMPLETE.md` for comprehensive guide
2. Check `FEATURE_PAGES_COMPLETE.md` for feature-specific info
3. View browser console (F12) for JavaScript errors
4. Check Django logs in terminal for backend errors
5. Check API responses using curl or Postman

---

**Everything is set up and ready to go! 🚀**
