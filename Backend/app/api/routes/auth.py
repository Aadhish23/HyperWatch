from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.auth import UserLogin, UserRegister, AuthResponse
from app.models.user import User
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.database import get_database, USERS_COLLECTION, PATIENTS_COLLECTION
from app.api.deps import get_current_user
from datetime import timedelta
from app.core.config import settings
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    """
    Register a new user.
    
    - Creates a new user account with hashed password
    - Returns JWT token for immediate login
    """
    db = get_database()
    
    # Check if user already exists
    existing_user = await db[USERS_COLLECTION].find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = User(
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        full_name=user_data.full_name,
        role=user_data.role,
        phone=user_data.phone,
    )
    
    # Insert into database
    user_dict = new_user.model_dump(by_alias=True, exclude={"id"})
    result = await db[USERS_COLLECTION].insert_one(user_dict)
    user_id = str(result.inserted_id)
    
    # If patient, create patient profile
    if user_data.role == "patient":
        from app.models.patient import Patient
        patient = Patient(user_id=user_id)
        patient_dict = patient.model_dump(by_alias=True, exclude={"id"})
        await db[PATIENTS_COLLECTION].insert_one(patient_dict)
    
    # Create access token
    access_token = create_access_token(
        data={"user_id": user_id, "role": user_data.role},
        expires_delta=timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    )
    
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=user_id,
        email=new_user.email,
        full_name=new_user.full_name,
        role=new_user.role
    )


@router.post("/login", response_model=AuthResponse)
async def login(credentials: UserLogin):
    """
    Authenticate user and return JWT token.
    
    - Validates email and password
    - Returns token with user information
    """
    db = get_database()
    
    # Find user by email
    user_data = await db[USERS_COLLECTION].find_one({"email": credentials.email})
    
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(credentials.password, user_data["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user_data.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    user_id = str(user_data["_id"])
    
    # Create access token
    access_token = create_access_token(
        data={"user_id": user_id, "role": user_data["role"]},
        expires_delta=timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    )
    
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=user_id,
        email=user_data["email"],
        full_name=user_data["full_name"],
        role=user_data["role"]
    )


@router.get("/me", response_model=dict)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information.
    
    - Returns user profile based on JWT token
    """
    return {
        "user_id": current_user.id or "",
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "phone": current_user.phone,
        "is_active": current_user.is_active
    }
