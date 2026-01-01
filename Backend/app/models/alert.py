from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime


class Alert(BaseModel):
    """
    Alert model for abnormal vital signs or system notifications.
    """
    id: Optional[str] = Field(default=None, alias="_id")
    
    # Alert Target
    patient_id: str  # Patient this alert is about
    vital_reading_id: Optional[str] = None  # Reference to VitalSigns._id if applicable
    
    # Alert Details
    alert_type: Literal["critical", "warning", "info"] = "warning"
    severity: Literal["high", "medium", "low"] = "medium"
    title: str
    message: str
    
    # Vital Sign Context (if applicable)
    vital_type: Optional[str] = None  # "heart_rate", "blood_pressure", etc.
    vital_value: Optional[float] = None
    threshold_crossed: Optional[str] = None  # "above_max", "below_min"
    
    # Status
    is_read: bool = False
    is_resolved: bool = False
    read_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    read_by: Optional[str] = None  # User ID who read the alert
    
    # Notification
    notified_users: list[str] = Field(default_factory=list)  # User IDs notified
    notification_sent: bool = False
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class AlertRule(BaseModel):
    """
    Model for configurable alert rules.
    Defines when alerts should be triggered.
    """
    id: Optional[str] = Field(default=None, alias="_id")
    patient_id: str
    vital_type: str
    condition: Literal["above", "below", "between", "outside"]
    threshold_value: Optional[float] = None
    threshold_min: Optional[float] = None
    threshold_max: Optional[float] = None
    alert_severity: Literal["high", "medium", "low"] = "medium"
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
