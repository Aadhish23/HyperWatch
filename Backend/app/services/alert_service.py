from app.models.alert import Alert
from app.core.database import get_database, ALERTS_COLLECTION, USERS_COLLECTION, PATIENTS_COLLECTION
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from app.services.email_service import email_service


async def create_system_alert(
    patient_id: str,
    title: str,
    message: str,
    alert_type: str = "info",
    severity: str = "low",
    vitals_data: Optional[dict] = None
) -> str:
    """
    Create a system-generated alert and send email notifications.
    
    Args:
        patient_id: Patient ID
        title: Alert title
        message: Alert message
        alert_type: "critical", "warning", or "info"
        severity: "high", "medium", or "low"
        vitals_data: Optional vital signs data to include in email
    
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
    
    # Send email notification for critical and warning alerts
    if alert_type in ["critical", "warning"]:
        try:
            # Get patient information
            user_data = await db[USERS_COLLECTION].find_one({"_id": ObjectId(patient_id)})
            if user_data:
                patient_name = user_data.get("full_name", "Patient")
                
                # Get patient's assigned caregivers/clinicians
                patient_record = await db[PATIENTS_COLLECTION].find_one({"user_id": patient_id})
                if patient_record:
                    assigned_caregiver_id = patient_record.get("assigned_caregiver")
                    
                    # Send email to assigned caregiver
                    if assigned_caregiver_id:
                        caregiver_data = await db[USERS_COLLECTION].find_one({"_id": ObjectId(assigned_caregiver_id)})
                        if caregiver_data:
                            await email_service.send_alert_email(
                                to_email=caregiver_data["email"],
                                patient_name=patient_name,
                                alert_type=alert_type,
                                alert_message=message,
                                vitals_data=vitals_data
                            )
                
                # TODO: Send to family members from patient's family_alert_recipients list
                
        except Exception as e:
            # Log error but don't fail alert creation
            print(f"Failed to send alert email: {e}")
    
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
