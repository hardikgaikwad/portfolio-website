# Portfolio — Retro Cybersecurity Terminal

A full-stack personal portfolio combining retro collegiate poster design with a cybersecurity terminal aesthetic.

## Architecture

```
Frontend (React + Vite + TypeScript)
        ↓ API calls
Backend (Django REST Framework)
        ↓
Database (SQLite dev / PostgreSQL prod)
```

## Tech Stack

| Layer | Technology |
|:---|:---|
| Frontend | React 18, Vite, TypeScript, Vanilla CSS |
| Backend | Python 3.11+, Django 5.x, Django REST Framework |
| Auth | JWT (simplejwt) |
| Database | SQLite (dev) / PostgreSQL (prod) |

## Local Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py seed_data
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Environment Variables

See `backend/.env.example` and `frontend/.env.example` for required variables.

## API Endpoints

### Public

| Endpoint | Method | Description |
|:---|:---|:---|
| `/api/profile/` | GET | Profile info |
| `/api/projects/` | GET | All published projects |
| `/api/projects/<slug>/` | GET | Project detail |
| `/api/skills/` | GET | Skill categories with skills |
| `/api/social/` | GET | Social links |
| `/api/site-settings/` | GET | Site configuration |

### Admin (JWT Required)

| Endpoint | Method | Description |
|:---|:---|:---|
| `/api/admin/projects/` | GET, POST | List/create projects |
| `/api/admin/projects/<id>/` | GET, PUT, PATCH, DELETE | Project CRUD |
| `/api/admin/profile/` | GET, PUT | Profile management |
| `/api/admin/skills/` | GET, POST | Skill category CRUD |
| `/api/admin/skills/<id>/` | PUT, DELETE | Skill management |
| `/api/admin/social/` | GET, POST | Social links CRUD |
| `/api/admin/social/<id>/` | PUT, DELETE | Link management |
| `/api/admin/resume/` | POST | Upload resume |
| `/api/auth/login/` | POST | JWT token obtain |
| `/api/auth/refresh/` | POST | JWT token refresh |

## Admin Portal

Navigate to `/admin` on the frontend to access the content management portal. Login with your Django superuser credentials.

## Deployment

The app is designed for independent frontend/backend deployment:

- **Frontend**: Vercel / Netlify / Cloudflare Pages
- **Backend**: Render / Railway / Fly.io / VPS
- **Database**: PostgreSQL
- **Media**: Cloudinary or object storage

Configure via environment variables — no provider lock-in.
