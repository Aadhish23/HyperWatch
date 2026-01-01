from typing import Literal, List
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import decode_access_token
from app.core.database import get_database, USERS_COLLECTION
from app.models.user import User
from bson import ObjectId

# HTTP Bearer security scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    """
    Dependency to get the current authenticated user from JWT token.
    
    Args:
        credentials: HTTP Authorization header with Bearer token
    
    Returns:
        User: Current authenticated user
    
    Raises:
        HTTPException: If token is invalid or user not found
    """
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id: str = payload.get("user_id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Fetch user from database
    db = get_database()
    user_data = await db[USERS_COLLECTION].find_one({"_id": ObjectId(user_id)})
    
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Convert ObjectId to string for Pydantic
    user_data["_id"] = str(user_data["_id"])
    
    return User(**user_data)


def require_role(allowed_roles: List[Literal["patient", "caregiver", "clinician"]]):
    """
    Factory function to create a role-based access control dependency.
    
    Args:
        allowed_roles: List of roles allowed to access the endpoint
    
    Returns:
        Dependency function that checks user role
    """
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(allowed_roles)}"
            )
        return current_user
    
    return role_checker


# Pre-configured role dependencies
require_patient = require_role(["patient"])
require_caregiver = require_role(["caregiver"])
require_clinician = require_role(["clinician"])
require_caregiver_or_clinician = require_role(["caregiver", "clinician"])
require_any_role = require_role(["patient", "caregiver", "clinician"])
