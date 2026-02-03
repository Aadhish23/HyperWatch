from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.auth import UserLogin, UserRegister, AuthResponse, PasswordChange
from app.models.user import User
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.database import get_database, USERS_COLLECTION, PATIENTS_COLLECTION
from app.api.deps import get_current_user
from datetime import timedelta, datetime
from app.core.config import settings
from bson import ObjectId
from app.services.email_service import email_service
import secrets

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


@router.post("/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user)
):
    """
    Change user password.
    
    - Verifies old password
    - Updates to new password
    """
    db = get_database()
    
    # Get user with current password
    user_data = await db[USERS_COLLECTION].find_one({"_id": ObjectId(current_user.id)})
    
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify old password
    if not verify_password(password_data.old_password, user_data["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    
    # Update password
    new_hashed_password = get_password_hash(password_data.new_password)
    await db[USERS_COLLECTION].update_one(
        {"_id": ObjectId(current_user.id)},
        {"$set": {"hashed_password": new_hashed_password}}
    )
    
    return {"message": "Password changed successfully"}


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


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(email: str):
    """
    Send password reset email.
    
    - Generates a reset token
    - Sends email with reset link
    """
    db = get_database()
    
    # Check if user exists
    user_data = await db[USERS_COLLECTION].find_one({"email": email})
    
    # Return error if user not found
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email address"
        )
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    reset_expires = datetime.utcnow() + timedelta(hours=1)
    
    # Store reset token in database
    await db[USERS_COLLECTION].update_one(
        {"_id": user_data["_id"]},
        {
            "$set": {
                "reset_token": reset_token,
                "reset_token_expires": reset_expires
            }
        }
    )
    
    # Send reset email
    try:
        await email_service.send_password_reset_email(
            to_email=email,
            user_name=user_data.get("full_name", "User"),
            reset_token=reset_token
        )
    except Exception as e:
        print(f"Failed to send password reset email: {e}")
        # Don't fail the request if email fails
    
    return {"message": "If an account with that email exists, a password reset link has been sent."}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(token: str, new_password: str):
    """
    Reset password using reset token.
    
    - Validates reset token
    - Updates password
    """
    db = get_database()
    
    # Find user with valid reset token
    user_data = await db[USERS_COLLECTION].find_one({
        "reset_token": token,
        "reset_token_expires": {"$gt": datetime.utcnow()}
    })
    
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Validate new password
    if len(new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long"
        )
    
    # Update password and clear reset token
    new_hashed_password = get_password_hash(new_password)
    await db[USERS_COLLECTION].update_one(
        {"_id": user_data["_id"]},
        {
            "$set": {"hashed_password": new_hashed_password},
            "$unset": {"reset_token": "", "reset_token_expires": ""}
        }
    )
    
    return {"message": "Password reset successfully"}
