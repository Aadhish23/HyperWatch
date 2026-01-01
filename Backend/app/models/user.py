from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    """Custom ObjectId type for Pydantic models."""
    
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)
    
    @classmethod
    def __get_pydantic_json_schema__(cls, schema, handler):
        schema.update(type="string")
        return schema


class UserRole(str):
    """User role enumeration."""
    PATIENT = "patient"
    CAREGIVER = "caregiver"
    CLINICIAN = "clinician"


class User(BaseModel):
    """
    User model representing all users in the system.
    Supports patient, caregiver, and clinician roles.
    """
    id: Optional[str] = Field(default=None, alias="_id")
    email: EmailStr
    hashed_password: str
    full_name: str
    role: Literal["patient", "caregiver", "clinician"]
    
    # Profile information
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[Literal["male", "female", "other"]] = None
    
    # Relationships
    assigned_patients: list[str] = Field(default_factory=list)  # For caregivers/clinicians
    assigned_caregiver: Optional[str] = None  # For patients
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True


class UserInDB(User):
    """User model as stored in database."""
    pass
