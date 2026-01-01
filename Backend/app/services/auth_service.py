from app.models.user import User
from app.core.database import get_database, USERS_COLLECTION
from app.core.security import verify_password, get_password_hash
from typing import Optional
from bson import ObjectId


async def authenticate_user(email: str, password: str) -> Optional[User]:
    """
    Authenticate a user by email and password.
    
    Args:
        email: User email
        password: Plain text password
    
    Returns:
        User object if authentication successful, None otherwise
    """
    db = get_database()
    user_data = await db[USERS_COLLECTION].find_one({"email": email})
    
    if not user_data:
        return None
    
    if not verify_password(password, user_data["hashed_password"]):
        return None
    
    # Convert ObjectId to string
    user_data["_id"] = str(user_data["_id"])
    
    return User(**user_data)


async def get_user_by_id(user_id: str) -> Optional[User]:
    """
    Get user by ID.
    
    Args:
        user_id: User ID
    
    Returns:
        User object if found, None otherwise
    """
    db = get_database()
    
    try:
        user_data = await db[USERS_COLLECTION].find_one({"_id": ObjectId(user_id)})
    except:
        return None
    
    if not user_data:
        return None
    
    user_data["_id"] = str(user_data["_id"])
    return User(**user_data)


async def get_user_by_email(email: str) -> Optional[User]:
    """
    Get user by email.
    
    Args:
        email: User email
    
    Returns:
        User object if found, None otherwise
    """
    db = get_database()
    user_data = await db[USERS_COLLECTION].find_one({"email": email})
    
    if not user_data:
        return None
    
    user_data["_id"] = str(user_data["_id"])
    return User(**user_data)


async def create_user(email: str, password: str, full_name: str, role: str) -> User:
    """
    Create a new user.
    
    Args:
        email: User email
        password: Plain text password
        full_name: User's full name
        role: User role (patient, caregiver, clinician)
    
    Returns:
        Created User object
    """
    db = get_database()
    
    # Create user
    user = User(
        email=email,
        hashed_password=get_password_hash(password),
        full_name=full_name,
        role=role
    )
    
    user_dict = user.model_dump(by_alias=True, exclude={"id"})
    result = await db[USERS_COLLECTION].insert_one(user_dict)
    user.id = str(result.inserted_id)
    
    return user
