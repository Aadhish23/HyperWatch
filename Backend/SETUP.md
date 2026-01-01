# HyperWatch Backend - Quick Start Guide

## 🎯 What's Been Built

A complete FastAPI backend with:
- ✅ JWT Authentication (bcrypt password hashing)
- ✅ Role-Based Access Control (Patient, Caregiver, Clinician)
- ✅ MongoDB integration (async with Motor)
- ✅ RESTful API endpoints for vitals, alerts, users, dashboard
- ✅ Automatic vital sign monitoring with alert generation
- ✅ CORS configuration for frontend
- ✅ Input validation with Pydantic
- ✅ Complete project structure

## 📁 Project Structure

```
Backend/
├── app/
│   ├── main.py                    # FastAPI application entry point
│   ├── core/
│   │   ├── config.py              # Settings (from .env)
│   │   ├── database.py            # MongoDB connection
│   │   └── security.py            # JWT & password hashing
│   ├── models/                    # Database models
│   │   ├── user.py
│   │   ├── patient.py
│   │   ├── vitals.py
│   │   └── alert.py
│   ├── schemas/                   # Pydantic validation schemas
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── vitals.py
│   │   └── alert.py
│   ├── api/
│   │   ├── deps.py                # Auth & RBAC dependencies
│   │   └── routes/                # API endpoints
│   │       ├── auth.py            # Login, register, /me
│   │       ├── users.py           # User profile management
│   │       ├── vitals.py          # Vital signs CRUD
│   │       ├── alerts.py          # Alert management
│   │       └── dashboard.py       # Dashboard data
│   ├── services/                  # Business logic
│   │   ├── auth_service.py
│   │   ├── vitals_service.py
│   │   └── alert_service.py
│   └── utils/
│       └── role_check.py          # RBAC utilities
├── tests/
│   └── test_auth.py               # Sample tests
├── .env                           # Environment variables (EDIT THIS!)
├── requirements.txt               # Python dependencies
├── README.md                      # Full documentation
├── run.bat / run.sh               # Quick start scripts
└── .gitignore

```

## 🚀 Installation & Setup

### Step 1: Install Python Dependencies

```bash
cd Backend
pip install -r requirements.txt
```

### Step 2: Install & Start MongoDB

**Option A: Local MongoDB**
```bash
# Download from: https://www.mongodb.com/try/download/community
# After installation, start MongoDB:
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

### Step 3: Configure Environment Variables

Edit the `.env` file:

```env
# REQUIRED: Generate a secure secret key
JWT_SECRET=CHANGE_ME_TO_A_SECURE_RANDOM_STRING

# Generate with: openssl rand -hex 32
# Or: python -c "import secrets; print(secrets.token_hex(32))"

# MongoDB connection
MONGO_URI=mongodb://localhost:27017/hyperwatch

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

### Step 4: Start the Backend

**Windows:**
```bash
run.bat
```

**Linux/Mac:**
```bash
chmod +x run.sh
./run.sh
```

**Or manually:**
```bash
uvicorn app.main:app --reload
```

The API will be available at:
- **API:** http://localhost:8000
- **Swagger Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## 🔑 API Authentication

All protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Get a Token

1. Register a user:
```bash
POST http://localhost:8000/auth/register
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "securepass123",
  "full_name": "John Doe",
  "role": "patient"
}
```

2. Use the returned `access_token` in subsequent requests

## 📋 API Endpoints Summary

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile
- `GET /users/patients` - Get assigned patients (caregiver/clinician)

### Vital Signs
- `POST /vitals` - Submit vitals (patient only)
- `GET /vitals/live` - Get latest vitals
- `GET /vitals/history` - Get historical vitals
- `GET /vitals/trends` - Get trends/analytics

### Alerts
- `GET /alerts` - Get alerts (filtered by role)
- `POST /alerts` - Create alert (caregiver/clinician)
- `PUT /alerts/{id}/read` - Mark as read
- `PUT /alerts/{id}/resolve` - Resolve alert
- `GET /alerts/stats` - Get alert statistics

### Dashboard
- `GET /dashboard/patient` - Patient dashboard data
- `GET /dashboard/caregiver` - Caregiver dashboard data
- `GET /dashboard/clinician` - Clinician dashboard data

## 🔐 Role-Based Access Control (RBAC)

### Roles

1. **Patient**
   - View own vitals and history
   - View own alerts
   - Update own profile
   - Submit vital signs

2. **Caregiver**
   - View assigned patients' vitals
   - View and manage alerts for assigned patients
   - Monitor multiple patients

3. **Clinician**
   - Full access to assigned patients
   - Create manual alerts
   - View analytics and reports
   - Access to advanced dashboard

### RBAC Enforcement

- Server-side validation on every request
- JWT token contains user role
- Dependencies (`require_patient`, `require_caregiver`, etc.) enforce access
- Frontend role checks are NOT trusted

## 🧪 Testing

Run tests:
```bash
pip install -r requirements-dev.txt
pytest tests/
```

## 📊 Database Collections

The system uses 4 main MongoDB collections:

1. **users** - All user accounts (patients, caregivers, clinicians)
2. **patients** - Extended patient medical information
3. **vitals** - Vital signs measurements with timestamps
4. **alerts** - System and manual alerts

## 🎨 Frontend Integration

The backend is designed to work with the Next.js frontend without modifications.

**Expected Frontend Behavior:**
- Sends JWT in `Authorization: Bearer <token>` header
- Receives user role from `/auth/login` and `/auth/register`
- Uses role for client-side UI rendering (server enforces access)
- Calls appropriate endpoints based on role

## 🔒 Security Features

- ✅ Bcrypt password hashing
- ✅ JWT token expiration
- ✅ CORS restricted to frontend URL
- ✅ RBAC on all protected routes
- ✅ Input validation with Pydantic
- ✅ SQL injection prevention (MongoDB)
- ✅ No sensitive data in responses

## 🚨 Important Notes

### Automatic Alert System

When patients submit vitals:
1. System checks against patient thresholds
2. Automatically creates alerts if anomalies detected
3. Alert severity based on how far values deviate
4. Alerts visible to patient and assigned caregivers/clinicians

### Placeholder Values

The `.env` file contains placeholders. **You MUST change:**
- `JWT_SECRET` - Use a secure random string
- `MONGO_URI` - Update if using cloud MongoDB

## 🐛 Troubleshooting

**"Connection refused" error:**
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`

**"Invalid token" error:**
- Token may be expired (60 min default)
- Re-login to get new token

**"Access denied" error:**
- Check user role has permission for endpoint
- Verify JWT token is included in request

**Import errors:**
- Ensure you're in the Backend directory
- Run from project root: `uvicorn app.main:app --reload`

## 📝 Next Steps

1. ✅ Backend is complete and ready to run
2. Generate secure `JWT_SECRET` (see below)
3. Start MongoDB
4. Run the backend
5. Test with Swagger UI at `/docs`
6. Connect frontend

---

## 🔑 KEYS YOU MUST GENERATE

### 1. JWT_SECRET (CRITICAL)

Generate a secure secret key:

**Using OpenSSL:**
```bash
openssl rand -hex 32
```

**Using Python:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Then update in `.env`:
```env
JWT_SECRET=your_generated_secret_here
```

### 2. MongoDB URI (if using cloud)

**For MongoDB Atlas:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account & cluster
3. Get connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/hyperwatch
   ```
4. Update in `.env`:
   ```env
   MONGO_URI=your_connection_string_here
   ```

### 3. FRONTEND_URL (for production)

Update when deploying:
```env
FRONTEND_URL=https://your-frontend-domain.com
```

---

## ✅ Verification Checklist

- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] MongoDB is running
- [ ] `.env` file updated with secure `JWT_SECRET`
- [ ] Backend starts without errors
- [ ] Can access Swagger docs at http://localhost:8000/docs
- [ ] Can register a user via API
- [ ] Can login and receive JWT token
- [ ] Can access protected endpoints with token

---

## 🎉 You're Ready!

The backend is fully implemented and ready to use. Start it with:

```bash
uvicorn app.main:app --reload
```

Visit http://localhost:8000/docs to explore the API!
