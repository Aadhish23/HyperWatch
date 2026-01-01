from pydantic import BaseModel, EmailStr
from typing import Optional, Literal


class UserLogin(BaseModel):
    """Schema for user login request."""
    email: EmailStr
    password: str


class UserRegister(BaseModel):
    """Schema for user registration request."""
    email: EmailStr
    password: str
    full_name: str
    role: Literal["patient", "caregiver", "clinician"]
    phone: Optional[str] = None


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for decoded token data."""
    user_id: Optional[str] = None
    role: Optional[str] = None


class AuthResponse(BaseModel):
    """Schema for authentication response with user info."""
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    full_name: str
    role: str
