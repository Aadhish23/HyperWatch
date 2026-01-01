from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime


class VitalsCreate(BaseModel):
    """Schema for creating vital signs measurement."""
    heart_rate: Optional[int] = Field(None, ge=0, le=300, description="Heart rate in BPM")
    systolic_bp: Optional[int] = Field(None, ge=0, le=300, description="Systolic BP in mmHg")
    diastolic_bp: Optional[int] = Field(None, ge=0, le=200, description="Diastolic BP in mmHg")
    oxygen_saturation: Optional[float] = Field(None, ge=0, le=100, description="O2 saturation %")
    temperature: Optional[float] = Field(None, ge=30, le=45, description="Temperature in Celsius")
    respiratory_rate: Optional[int] = Field(None, ge=0, le=100, description="Breaths per minute")
    measurement_type: Literal["manual", "automatic", "device"] = "automatic"
    notes: Optional[str] = None


class VitalsResponse(BaseModel):
    """Schema for vital signs response."""
    id: str = Field(alias="_id")
    patient_id: str
    heart_rate: Optional[int] = None
    systolic_bp: Optional[int] = None
    diastolic_bp: Optional[int] = None
    oxygen_saturation: Optional[float] = None
    temperature: Optional[float] = None
    respiratory_rate: Optional[int] = None
    measurement_type: str
    is_anomaly: bool
    anomaly_type: Optional[str] = None
    measured_at: datetime
    created_at: datetime
    
    class Config:
        populate_by_name = True


class VitalsHistory(BaseModel):
    """Schema for vital signs history query."""
    patient_id: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    limit: int = Field(default=100, le=1000)


class VitalsTrendResponse(BaseModel):
    """Schema for vital signs trend analytics."""
    vital_type: str
    average: float
    min_value: float
    max_value: float
    trend: str
    data_points: int
    period: str
