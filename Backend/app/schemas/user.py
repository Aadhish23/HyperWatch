from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal, List
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema with common fields."""
    email: EmailStr
    full_name: str
    role: Literal["patient", "caregiver", "clinician"]


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[Literal["male", "female", "other"]] = None


class UserUpdate(BaseModel):
    """Schema for updating user profile."""
    full_name: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[Literal["male", "female", "other"]] = None
    
    # Medical info for patients
    blood_type: Optional[str] = None
    allergies: Optional[List[str]] = None
    medications: Optional[List[str]] = None
    medical_conditions: Optional[List[str]] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None


class UserResponse(UserBase):
    """Schema for user response (without sensitive data)."""
    id: str = Field(alias="_id")
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[Literal["male", "female", "other"]] = None
    assigned_patients: List[str] = []
    assigned_caregiver: Optional[str] = None
    created_at: datetime
    is_active: bool
    
    class Config:
        populate_by_name = True


class UserProfile(BaseModel):
    """Extended user profile with medical information."""
    id: str
    email: EmailStr
    full_name: str
    role: str
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    
    # Medical info (for patients)
    blood_type: Optional[str] = None
    allergies: List[str] = []
    medications: List[str] = []
    medical_conditions: List[str] = []
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    
    # Relationships
    assigned_patients: List[str] = []
    assigned_caregiver: Optional[str] = None
    
    # Device info (for patients)
    device_id: Optional[str] = None
    device_calibrated: bool = False
    
    created_at: datetime


class PatientCreateRequest(BaseModel):
    """Schema for creating a new patient (by caregiver/clinician)."""
    email: EmailStr
    full_name: str
    age: Optional[int] = Field(None, ge=0, le=150)
    gender: Optional[Literal["male", "female", "other"]] = None
    phone: Optional[str] = None
    
    # Medical information
    blood_type: Optional[str] = None
    allergies: Optional[List[str]] = None
    medications: Optional[List[str]] = None
    medical_conditions: Optional[List[str]] = None
    
    # Emergency contact
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None
    
    # Assignment
    assigned_caregiver_id: Optional[str] = None
    assigned_clinician_id: Optional[str] = None


class PatientCreateResponse(BaseModel):
    """Schema for patient creation response."""
    patient_id: str
    user_id: str
    email: str
    full_name: str
    message: str


class PatientOverview(BaseModel):
    """Lightweight overview for patient lists (caregivers/clinicians)."""

    id: str
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[datetime] = None

    systolic_bp: Optional[int] = None
    diastolic_bp: Optional[int] = None
    heart_rate: Optional[int] = None
    oxygen_saturation: Optional[float] = None
    temperature: Optional[float] = None
    last_measurement_at: Optional[datetime] = None
    is_anomaly: bool = False
