from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime


class VitalSigns(BaseModel):
    """
    Vital signs measurement model.
    Stores real-time and historical vital sign data.
    """
    id: Optional[str] = Field(default=None, alias="_id")
    patient_id: str  # Reference to Patient user_id
    
    # Vital Sign Measurements
    heart_rate: Optional[int] = Field(None, description="Heart rate in BPM")
    systolic_bp: Optional[int] = Field(None, description="Systolic blood pressure in mmHg")
    diastolic_bp: Optional[int] = Field(None, description="Diastolic blood pressure in mmHg")
    oxygen_saturation: Optional[float] = Field(None, description="Oxygen saturation percentage")
    temperature: Optional[float] = Field(None, description="Body temperature in Celsius")
    respiratory_rate: Optional[int] = Field(None, description="Respiratory rate in breaths per minute")
    
    # Measurement Context
    measurement_type: Literal["manual", "automatic", "device"] = "automatic"
    device_id: Optional[str] = None
    
    # Status
    is_anomaly: bool = False
    anomaly_type: Optional[str] = None  # "high", "low", "critical"
    notes: Optional[str] = None
    
    # Timestamp
    measured_at: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class VitalsTrend(BaseModel):
    """
    Model for vital sign trends and statistics.
    Used for dashboard analytics.
    """
    patient_id: str
    vital_type: str
    average: float
    min_value: float
    max_value: float
    trend: Literal["increasing", "decreasing", "stable"]
    period: str  # "24h", "7d", "30d"
    calculated_at: datetime = Field(default_factory=datetime.utcnow)
