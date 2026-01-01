from app.models.alert import Alert
from app.core.database import get_database, ALERTS_COLLECTION
from typing import List, Optional
from bson import ObjectId
from datetime import datetime


async def create_system_alert(
    patient_id: str,
    title: str,
    message: str,
    alert_type: str = "info",
    severity: str = "low"
) -> str:
    """
    Create a system-generated alert.
    
    Args:
        patient_id: Patient ID
        title: Alert title
        message: Alert message
        alert_type: "critical", "warning", or "info"
        severity: "high", "medium", or "low"
    
    Returns:
        Created alert ID
    """
    db = get_database()
    
    alert = Alert(
        patient_id=patient_id,
        alert_type=alert_type,
        severity=severity,
        title=title,
        message=message
    )
    
    alert_dict = alert.model_dump(by_alias=True, exclude={"id"})
    result = await db[ALERTS_COLLECTION].insert_one(alert_dict)
    
    return str(result.inserted_id)


async def get_unread_alerts_for_patient(patient_id: str, limit: int = 50) -> List[Alert]:
    """
    Get unread alerts for a specific patient.
    
    Args:
        patient_id: Patient ID
        limit: Maximum number of alerts to return
    
    Returns:
        List of Alert objects
    """
    db = get_database()
    
    cursor = db[ALERTS_COLLECTION].find(
        {"patient_id": patient_id, "is_read": False}
    ).sort("created_at", -1).limit(limit)
    
    alerts = []
    async for alert_data in cursor:
        alert_data["_id"] = str(alert_data["_id"])
        alerts.append(Alert(**alert_data))
    
    return alerts


async def mark_alert_read(alert_id: str, user_id: str) -> bool:
    """
    Mark an alert as read.
    
    Args:
        alert_id: Alert ID
        user_id: User ID who read the alert
    
    Returns:
        True if successful, False otherwise
    """
    db = get_database()
    
    try:
        result = await db[ALERTS_COLLECTION].update_one(
            {"_id": ObjectId(alert_id)},
            {
                "$set": {
                    "is_read": True,
                    "read_at": datetime.utcnow(),
                    "read_by": user_id,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0
    except:
        return False


async def get_critical_alerts_count(patient_ids: List[str]) -> int:
    """
    Get count of critical unresolved alerts for multiple patients.
    
    Args:
        patient_ids: List of patient IDs
    
    Returns:
        Count of critical alerts
    """
    db = get_database()
    
    count = await db[ALERTS_COLLECTION].count_documents({
        "patient_id": {"$in": patient_ids},
        "alert_type": "critical",
        "is_resolved": False
    })
    
    return count
