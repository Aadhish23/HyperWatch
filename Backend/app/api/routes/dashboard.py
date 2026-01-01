from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import User
from app.api.deps import get_current_user
from app.core.database import get_database, VITALS_COLLECTION, ALERTS_COLLECTION, PATIENTS_COLLECTION
from datetime import datetime, timedelta
from typing import Dict, Any, List

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/patient", response_model=Dict[str, Any])
async def get_patient_dashboard(current_user: User = Depends(get_current_user)):
    """
    Get patient dashboard data.
    
    - Recent vitals summary
    - Alert statistics
    - Device status
    """
    if current_user.role != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is only for patients"
        )
    
    db = get_database()
    
    # Get latest vitals
    latest_vitals = await db[VITALS_COLLECTION].find_one(
        {"patient_id": current_user.id},
        sort=[("measured_at", -1)]
    )
    
    # Get alerts count
    total_alerts = await db[ALERTS_COLLECTION].count_documents({"patient_id": current_user.id})
    unread_alerts = await db[ALERTS_COLLECTION].count_documents({
        "patient_id": current_user.id,
        "is_read": False
    })
    
    # Get patient info
    patient_info = await db[PATIENTS_COLLECTION].find_one({"user_id": current_user.id})
    
    # Get vitals from last 24 hours
    start_time = datetime.utcnow() - timedelta(hours=24)
    recent_vitals_count = await db[VITALS_COLLECTION].count_documents({
        "patient_id": current_user.id,
        "measured_at": {"$gte": start_time}
    })
    
    dashboard_data = {
        "user_info": {
            "name": current_user.full_name,
            "email": current_user.email,
            "role": current_user.role
        },
        "latest_vitals": {
            "heart_rate": latest_vitals.get("heart_rate") if latest_vitals else None,
            "blood_pressure": f"{latest_vitals.get('systolic_bp')}/{latest_vitals.get('diastolic_bp')}" if latest_vitals and latest_vitals.get('systolic_bp') else None,
            "oxygen_saturation": latest_vitals.get("oxygen_saturation") if latest_vitals else None,
            "temperature": latest_vitals.get("temperature") if latest_vitals else None,
            "measured_at": latest_vitals.get("measured_at") if latest_vitals else None,
            "is_anomaly": latest_vitals.get("is_anomaly", False) if latest_vitals else False
        },
        "alerts": {
            "total": total_alerts,
            "unread": unread_alerts
        },
        "device_status": {
            "calibrated": patient_info.get("device_calibrated", False) if patient_info else False,
            "device_id": patient_info.get("device_id") if patient_info else None,
            "last_calibration": patient_info.get("last_calibration_date") if patient_info else None
        },
        "activity": {
            "measurements_24h": recent_vitals_count
        }
    }
    
    return dashboard_data


@router.get("/caregiver", response_model=Dict[str, Any])
async def get_caregiver_dashboard(current_user: User = Depends(get_current_user)):
    """
    Get caregiver dashboard data.
    
    - Assigned patients summary
    - Overall alerts
    - Patient vitals overview
    """
    if current_user.role != "caregiver":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is only for caregivers"
        )
    
    db = get_database()
    
    # Get assigned patients count
    assigned_patients = current_user.assigned_patients
    patient_count = len(assigned_patients)
    
    # Get total alerts for all assigned patients
    total_alerts = await db[ALERTS_COLLECTION].count_documents({
        "patient_id": {"$in": assigned_patients}
    })
    
    # Get unread alerts
    unread_alerts = await db[ALERTS_COLLECTION].count_documents({
        "patient_id": {"$in": assigned_patients},
        "is_read": False
    })
    
    # Get critical alerts
    critical_alerts = await db[ALERTS_COLLECTION].count_documents({
        "patient_id": {"$in": assigned_patients},
        "alert_type": "critical",
        "is_resolved": False
    })
    
    # Get recent alerts (last 10)
    recent_alerts_cursor = db[ALERTS_COLLECTION].find(
        {"patient_id": {"$in": assigned_patients}},
        {"_id": 1, "patient_id": 1, "title": 1, "alert_type": 1, "created_at": 1}
    ).sort("created_at", -1).limit(10)
    
    recent_alerts = []
    async for alert in recent_alerts_cursor:
        recent_alerts.append({
            "id": str(alert["_id"]),
            "patient_id": alert["patient_id"],
            "title": alert["title"],
            "type": alert["alert_type"],
            "created_at": alert["created_at"]
        })
    
    dashboard_data = {
        "user_info": {
            "name": current_user.full_name,
            "email": current_user.email,
            "role": current_user.role
        },
        "patients": {
            "total": patient_count,
            "assigned_patient_ids": assigned_patients
        },
        "alerts": {
            "total": total_alerts,
            "unread": unread_alerts,
            "critical": critical_alerts,
            "recent": recent_alerts
        }
    }
    
    return dashboard_data


@router.get("/clinician", response_model=Dict[str, Any])
async def get_clinician_dashboard(current_user: User = Depends(get_current_user)):
    """
    Get clinician dashboard data.
    
    - System-wide statistics
    - All patients overview
    - Analytics summary
    """
    if current_user.role != "clinician":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is only for clinicians"
        )
    
    db = get_database()
    
    # Get assigned patients
    assigned_patients = current_user.assigned_patients
    patient_count = len(assigned_patients)
    
    # Get total vitals measurements today
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    vitals_today = await db[VITALS_COLLECTION].count_documents({
        "patient_id": {"$in": assigned_patients},
        "measured_at": {"$gte": today_start}
    })
    
    # Get alerts
    total_alerts = await db[ALERTS_COLLECTION].count_documents({
        "patient_id": {"$in": assigned_patients}
    })
    
    critical_alerts = await db[ALERTS_COLLECTION].count_documents({
        "patient_id": {"$in": assigned_patients},
        "alert_type": "critical",
        "is_resolved": False
    })
    
    # Get anomaly count
    anomaly_count = await db[VITALS_COLLECTION].count_documents({
        "patient_id": {"$in": assigned_patients},
        "is_anomaly": True,
        "measured_at": {"$gte": today_start}
    })
    
    # Get recent critical alerts
    critical_alerts_cursor = db[ALERTS_COLLECTION].find(
        {
            "patient_id": {"$in": assigned_patients},
            "alert_type": "critical"
        },
        {"_id": 1, "patient_id": 1, "title": 1, "severity": 1, "created_at": 1}
    ).sort("created_at", -1).limit(10)
    
    critical_alerts_list = []
    async for alert in critical_alerts_cursor:
        critical_alerts_list.append({
            "id": str(alert["_id"]),
            "patient_id": alert["patient_id"],
            "title": alert["title"],
            "severity": alert["severity"],
            "created_at": alert["created_at"]
        })
    
    dashboard_data = {
        "user_info": {
            "name": current_user.full_name,
            "email": current_user.email,
            "role": current_user.role
        },
        "patients": {
            "total": patient_count
        },
        "vitals": {
            "measurements_today": vitals_today,
            "anomalies_today": anomaly_count
        },
        "alerts": {
            "total": total_alerts,
            "critical_unresolved": critical_alerts,
            "recent_critical": critical_alerts_list
        },
        "analytics": {
            "average_measurements_per_patient": round(vitals_today / patient_count, 2) if patient_count > 0 else 0
        }
    }
    
    return dashboard_data
