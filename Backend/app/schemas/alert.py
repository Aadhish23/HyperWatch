from pydantic import BaseModel, Field
from typing import Optional, Literal, List
from datetime import datetime


class AlertCreate(BaseModel):
    """Schema for creating an alert."""
    patient_id: str
    alert_type: Literal["critical", "warning", "info"] = "warning"
    severity: Literal["high", "medium", "low"] = "medium"
    title: str
    message: str
    vital_type: Optional[str] = None
    vital_value: Optional[float] = None


class AlertUpdate(BaseModel):
    """Schema for updating an alert."""
    is_read: Optional[bool] = None
    is_resolved: Optional[bool] = None


class AlertResponse(BaseModel):
    """Schema for alert response."""
    id: str = Field(alias="_id")
    patient_id: str
    alert_type: str
    severity: str
    title: str
    message: str
    vital_type: Optional[str] = None
    vital_value: Optional[float] = None
    threshold_crossed: Optional[str] = None
    is_read: bool
    is_resolved: bool
    read_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        populate_by_name = True


class AlertStats(BaseModel):
    """Schema for alert statistics."""
    total_alerts: int
    unread_alerts: int
    critical_alerts: int
    warning_alerts: int
    resolved_alerts: int


class AlertFilter(BaseModel):
    """Schema for filtering alerts."""
    patient_id: Optional[str] = None
    alert_type: Optional[Literal["critical", "warning", "info"]] = None
    severity: Optional[Literal["high", "medium", "low"]] = None
    is_read: Optional[bool] = None
    is_resolved: Optional[bool] = None
    limit: int = Field(default=50, le=500)
