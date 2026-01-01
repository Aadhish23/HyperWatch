from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.schemas.alert import AlertCreate, AlertUpdate, AlertResponse, AlertStats
from app.models.user import User
from app.models.alert import Alert
from app.api.deps import get_current_user
from app.core.database import get_database, ALERTS_COLLECTION
from bson import ObjectId
from datetime import datetime
from typing import Optional, List

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("", response_model=List[AlertResponse])
async def get_alerts(
    patient_id: Optional[str] = Query(None),
    alert_type: Optional[str] = Query(None),
    is_read: Optional[bool] = Query(None),
    limit: int = Query(50, ge=1, le=500),
    current_user: User = Depends(get_current_user)
):
    """
    Get alerts based on user role and filters.
    
    - Patients see their own alerts
    - Caregivers/Clinicians see alerts for assigned patients
    """
    db = get_database()
    
    # Build query based on role
    query = {}
    
    if current_user.role == "patient":
        # Patients only see their own alerts
        query["patient_id"] = current_user.id
    else:
        # Caregivers/Clinicians see alerts for assigned patients
        if patient_id:
            # Verify access
            if patient_id not in current_user.assigned_patients:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied to this patient's alerts"
                )
            query["patient_id"] = patient_id
        else:
            # Show all assigned patients' alerts
            query["patient_id"] = {"$in": current_user.assigned_patients}
    
    # Add optional filters
    if alert_type:
        query["alert_type"] = alert_type
    if is_read is not None:
        query["is_read"] = is_read
    
    # Query alerts
    cursor = db[ALERTS_COLLECTION].find(query).sort("created_at", -1).limit(limit)
    
    alerts = []
    async for alert_data in cursor:
        alert_data["_id"] = str(alert_data["_id"])
        alerts.append(AlertResponse(**alert_data))
    
    return alerts


@router.post("", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
async def create_alert(
    alert_data: AlertCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Create a new alert.
    
    - Only caregivers and clinicians can manually create alerts
    - Patients' alerts are created automatically by the system
    """
    if current_user.role not in ["caregiver", "clinician"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only caregivers and clinicians can create manual alerts"
        )
    
    db = get_database()
    
    # Verify access to patient
    if alert_data.patient_id not in current_user.assigned_patients:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this patient"
        )
    
    # Create alert
    alert = Alert(
        patient_id=alert_data.patient_id,
        alert_type=alert_data.alert_type,
        severity=alert_data.severity,
        title=alert_data.title,
        message=alert_data.message,
        vital_type=alert_data.vital_type,
        vital_value=alert_data.vital_value
    )
    
    alert_dict = alert.model_dump(by_alias=True, exclude={"id"})
    result = await db[ALERTS_COLLECTION].insert_one(alert_dict)
    alert.id = str(result.inserted_id)
    
    return AlertResponse(
        _id=alert.id,
        patient_id=alert.patient_id,
        alert_type=alert.alert_type,
        severity=alert.severity,
        title=alert.title,
        message=alert.message,
        vital_type=alert.vital_type,
        vital_value=alert.vital_value,
        threshold_crossed=alert.threshold_crossed,
        is_read=alert.is_read,
        is_resolved=alert.is_resolved,
        read_at=alert.read_at,
        created_at=alert.created_at
    )


@router.put("/{alert_id}/read", response_model=dict)
async def mark_alert_as_read(
    alert_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Mark an alert as read.
    
    - Updates alert status
    - Records who read it and when
    """
    db = get_database()
    
    # Verify alert exists and user has access
    try:
        alert_data = await db[ALERTS_COLLECTION].find_one({"_id": ObjectId(alert_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid alert ID"
        )
    
    if not alert_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    # Check access
    patient_id = alert_data["patient_id"]
    if current_user.role == "patient":
        if patient_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
    else:
        if patient_id not in current_user.assigned_patients:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
    
    # Update alert
    await db[ALERTS_COLLECTION].update_one(
        {"_id": ObjectId(alert_id)},
        {
            "$set": {
                "is_read": True,
                "read_at": datetime.utcnow(),
                "read_by": current_user.id,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": "Alert marked as read"}


@router.put("/{alert_id}/resolve", response_model=dict)
async def resolve_alert(
    alert_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Mark an alert as resolved.
    
    - Only caregivers and clinicians can resolve alerts
    """
    if current_user.role not in ["caregiver", "clinician"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only caregivers and clinicians can resolve alerts"
        )
    
    db = get_database()
    
    try:
        alert_data = await db[ALERTS_COLLECTION].find_one({"_id": ObjectId(alert_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid alert ID"
        )
    
    if not alert_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    # Check access
    if alert_data["patient_id"] not in current_user.assigned_patients:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Update alert
    await db[ALERTS_COLLECTION].update_one(
        {"_id": ObjectId(alert_id)},
        {
            "$set": {
                "is_resolved": True,
                "resolved_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": "Alert marked as resolved"}


@router.get("/stats", response_model=AlertStats)
async def get_alert_stats(
    patient_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user)
):
    """
    Get alert statistics.
    
    - Returns counts of different alert types and statuses
    """
    db = get_database()
    
    # Build query based on role
    query = {}
    
    if current_user.role == "patient":
        query["patient_id"] = current_user.id
    else:
        if patient_id:
            if patient_id not in current_user.assigned_patients:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied"
                )
            query["patient_id"] = patient_id
        else:
            query["patient_id"] = {"$in": current_user.assigned_patients}
    
    # Count total alerts
    total = await db[ALERTS_COLLECTION].count_documents(query)
    
    # Count unread alerts
    unread_query = {**query, "is_read": False}
    unread = await db[ALERTS_COLLECTION].count_documents(unread_query)
    
    # Count critical alerts
    critical_query = {**query, "alert_type": "critical"}
    critical = await db[ALERTS_COLLECTION].count_documents(critical_query)
    
    # Count warning alerts
    warning_query = {**query, "alert_type": "warning"}
    warning = await db[ALERTS_COLLECTION].count_documents(warning_query)
    
    # Count resolved alerts
    resolved_query = {**query, "is_resolved": True}
    resolved = await db[ALERTS_COLLECTION].count_documents(resolved_query)
    
    return AlertStats(
        total_alerts=total,
        unread_alerts=unread,
        critical_alerts=critical,
        warning_alerts=warning,
        resolved_alerts=resolved
    )
