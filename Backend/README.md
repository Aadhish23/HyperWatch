# HyperWatch Backend

FastAPI backend for HyperWatch - A real-time health monitoring system with RBAC.

## Tech Stack

- **FastAPI**: Modern, fast web framework
- **MongoDB**: NoSQL database with Motor async driver
- **JWT**: Token-based authentication
- **Bcrypt**: Password hashing
- **Pydantic**: Data validation

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Edit `.env` file with your configuration:

```env
MONGO_URI=mongodb://localhost:27017/hyperwatch
JWT_SECRET=<YOUR_SECURE_SECRET_KEY>
JWT_EXPIRE_MINUTES=60
FRONTEND_URL=http://localhost:3000
```

### 3. Start MongoDB

Ensure MongoDB is running locally or update `MONGO_URI` with your MongoDB connection string.

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas cloud service
```

### 4. Run the Application

```bash
uvicorn app.main:app --reload
```

The API will be available at: `http://localhost:8000`

### 5. Access API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
Backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── core/                # Core configuration
│   │   ├── config.py        # Settings management
│   │   ├── database.py      # MongoDB connection
│   │   └── security.py      # JWT & password hashing
│   ├── models/              # Database models
│   ├── schemas/             # Pydantic schemas
│   ├── api/                 # API routes
│   │   ├── deps.py          # Dependencies (auth, RBAC)
│   │   └── routes/          # Route handlers
│   ├── services/            # Business logic
│   └── utils/               # Helper functions
├── tests/                   # Unit tests
├── .env                     # Environment variables
└── requirements.txt         # Python dependencies
```

## User Roles

- **patient**: View own vitals, alerts, and dashboard
- **caregiver**: Monitor assigned patients
- **clinician**: Full access to analysis and reports

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user info

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile

### Vitals
- `POST /vitals` - Submit vital signs
- `GET /vitals/live` - Get live vitals
- `GET /vitals/history` - Get historical vitals

### Alerts
- `GET /alerts` - Get alerts
- `POST /alerts` - Create alert
- `PUT /alerts/{id}/read` - Mark alert as read

### Dashboard
- `GET /dashboard/patient` - Patient dashboard data
- `GET /dashboard/caregiver` - Caregiver dashboard data
- `GET /dashboard/clinician` - Clinician dashboard data

## KEYS YOU MUST GENERATE

Before deploying to production, generate and configure:

1. **JWT_SECRET**: 
   - Generate a secure random string (32+ characters)
   - Command: `openssl rand -hex 32`
   - Update in `.env` file

2. **MongoDB URI** (if using cloud):
   - Sign up for MongoDB Atlas: https://www.mongodb.com/cloud/atlas
   - Create a cluster and get connection string
   - Update `MONGO_URI` in `.env` file

3. **FRONTEND_URL**:
   - Update with your production frontend URL for CORS

## Testing

```bash
pytest tests/
```

## Development

The backend runs with auto-reload enabled. Any code changes will automatically restart the server.

## Production Deployment

1. Set all environment variables securely
2. Use a production ASGI server (uvicorn with workers)
3. Enable HTTPS
4. Set up MongoDB with authentication
5. Use a reverse proxy (nginx/traefik)

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Security Notes

- All passwords are hashed with bcrypt
- JWT tokens expire after configured time
- RBAC enforced on all protected routes
- CORS restricted to frontend URL
- Input validation with Pydantic

## Support

For issues or questions, refer to the API documentation at `/docs`.
