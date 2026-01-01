from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class Patient(BaseModel):
    """
    Patient model with medical information.
    Links to User model via user_id.
    """
    id: Optional[str] = Field(default=None, alias="_id")
    user_id: str  # Reference to User._id
    
    # Medical Information
    blood_type: Optional[str] = None
    allergies: List[str] = Field(default_factory=list)
    medications: List[str] = Field(default_factory=list)
    medical_conditions: List[str] = Field(default_factory=list)
    
    # Emergency Contact
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None
    
    # Device Information
    device_id: Optional[str] = None
    device_calibrated: bool = False
    last_calibration_date: Optional[datetime] = None
    
    # Vital Sign Thresholds (for alerts)
    heart_rate_min: int = 60
    heart_rate_max: int = 100
    systolic_bp_min: int = 90
    systolic_bp_max: int = 140
    diastolic_bp_min: int = 60
    diastolic_bp_max: int = 90
    oxygen_saturation_min: int = 95
    temperature_min: float = 36.1
    temperature_max: float = 37.2
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
