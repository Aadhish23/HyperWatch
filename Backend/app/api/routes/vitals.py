from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.schemas.vitals import VitalsCreate, VitalsResponse, VitalsTrendResponse
from app.models.user import User
from app.models.vitals import VitalSigns
from app.api.deps import get_current_user, require_patient, require_caregiver_or_clinician
from app.core.database import get_database, VITALS_COLLECTION, PATIENTS_COLLECTION, ALERTS_COLLECTION
from app.services.vitals_service import check_vitals_anomaly, create_vital_alert
from bson import ObjectId
from datetime import datetime, timedelta
from typing import Optional, List

router = APIRouter(prefix="/vitals", tags=["Vital Signs"])


@router.post("", response_model=VitalsResponse, status_code=status.HTTP_201_CREATED)
async def submit_vitals(
    vitals_data: VitalsCreate,
    current_user: User = Depends(require_patient)
):
    """
    Submit new vital signs measurement (Patient only).
    
    - Records vital signs
    - Checks for anomalies
    - Creates alerts if thresholds exceeded
    """
    db = get_database()
    
    # Create vitals record
    vitals = VitalSigns(
        patient_id=current_user.id,
        heart_rate=vitals_data.heart_rate,
        systolic_bp=vitals_data.systolic_bp,
        diastolic_bp=vitals_data.diastolic_bp,
        oxygen_saturation=vitals_data.oxygen_saturation,
        temperature=vitals_data.temperature,
        respiratory_rate=vitals_data.respiratory_rate,
        measurement_type=vitals_data.measurement_type,
        notes=vitals_data.notes
    )
    
    # Get patient thresholds
    patient_data = await db[PATIENTS_COLLECTION].find_one({"user_id": current_user.id})
    
    # Check for anomalies
    if patient_data:
        is_anomaly, anomaly_type, alerts = await check_vitals_anomaly(vitals, patient_data)
        vitals.is_anomaly = is_anomaly
        vitals.anomaly_type = anomaly_type
        
        # Create alert records if anomalies detected
        if alerts:
            for alert in alerts:
                await db[ALERTS_COLLECTION].insert_one(alert)
    
    # Insert vitals
    vitals_dict = vitals.model_dump(by_alias=True, exclude={"id"})
    result = await db[VITALS_COLLECTION].insert_one(vitals_dict)
    vitals.id = str(result.inserted_id)
    
    return VitalsResponse(
        _id=vitals.id,
        patient_id=vitals.patient_id,
        heart_rate=vitals.heart_rate,
        systolic_bp=vitals.systolic_bp,
        diastolic_bp=vitals.diastolic_bp,
        oxygen_saturation=vitals.oxygen_saturation,
        temperature=vitals.temperature,
        respiratory_rate=vitals.respiratory_rate,
        measurement_type=vitals.measurement_type,
        is_anomaly=vitals.is_anomaly,
        anomaly_type=vitals.anomaly_type,
        measured_at=vitals.measured_at,
        created_at=vitals.created_at
    )


@router.get("/live", response_model=VitalsResponse)
async def get_live_vitals(
    patient_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user)
):
    """
    Get most recent vital signs.
    
    - Patients see their own vitals
    - Caregivers/Clinicians can specify patient_id
    """
    db = get_database()
    
    # Determine which patient to query
    if current_user.role == "patient":
        target_patient_id = current_user.id
    else:
        if not patient_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="patient_id is required for caregivers/clinicians"
            )
        # Verify access
        if patient_id not in current_user.assigned_patients:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this patient's data"
            )
        target_patient_id = patient_id
    
    # Get most recent vitals
    vitals_data = await db[VITALS_COLLECTION].find_one(
        {"patient_id": target_patient_id},
        sort=[("measured_at", -1)]
    )
    
    if not vitals_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No vital signs found"
        )
    
    vitals_data["_id"] = str(vitals_data["_id"])
    return VitalsResponse(**vitals_data)


@router.get("/history", response_model=List[VitalsResponse])
async def get_vitals_history(
    patient_id: Optional[str] = Query(None),
    hours: int = Query(24, ge=1, le=720),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user)
):
    """
    Get historical vital signs.
    
    - Returns vitals from the specified time period
    - Patients see their own history
    - Caregivers/Clinicians can specify patient_id
    """
    db = get_database()
    
    # Determine which patient to query
    if current_user.role == "patient":
        target_patient_id = current_user.id
    else:
        if not patient_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="patient_id is required for caregivers/clinicians"
            )
        # Verify access
        if patient_id not in current_user.assigned_patients:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this patient's data"
            )
        target_patient_id = patient_id
    
    # Calculate time range
    start_time = datetime.utcnow() - timedelta(hours=hours)
    
    # Query vitals
    cursor = db[VITALS_COLLECTION].find(
        {
            "patient_id": target_patient_id,
            "measured_at": {"$gte": start_time}
        }
    ).sort("measured_at", -1).limit(limit)
    
    vitals_list = []
    async for vitals_data in cursor:
        vitals_data["_id"] = str(vitals_data["_id"])
        vitals_list.append(VitalsResponse(**vitals_data))
    
    return vitals_list


@router.get("/trends", response_model=List[VitalsTrendResponse])
async def get_vitals_trends(
    patient_id: Optional[str] = Query(None),
    period: str = Query("24h", regex="^(24h|7d|30d)$"),
    current_user: User = Depends(get_current_user)
):
    """
    Get vital signs trends and statistics.
    
    - Calculates averages, min, max for each vital type
    - Available periods: 24h, 7d, 30d
    """
    db = get_database()
    
    # Determine which patient to query
    if current_user.role == "patient":
        target_patient_id = current_user.id
    else:
        if not patient_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="patient_id is required for caregivers/clinicians"
            )
        target_patient_id = patient_id
    
    # Calculate time range
    period_map = {"24h": 24, "7d": 168, "30d": 720}
    hours = period_map.get(period, 24)
    start_time = datetime.utcnow() - timedelta(hours=hours)
    
    # Aggregate vitals data
    pipeline = [
        {
            "$match": {
                "patient_id": target_patient_id,
                "measured_at": {"$gte": start_time}
            }
        },
        {
            "$group": {
                "_id": None,
                "avg_heart_rate": {"$avg": "$heart_rate"},
                "min_heart_rate": {"$min": "$heart_rate"},
                "max_heart_rate": {"$max": "$heart_rate"},
                "count": {"$sum": 1}
            }
        }
    ]
    
    result = await db[VITALS_COLLECTION].aggregate(pipeline).to_list(length=1)
    
    if not result:
        return []
    
    data = result[0]
    trends = []
    
    if data.get("avg_heart_rate"):
        trends.append(VitalsTrendResponse(
            vital_type="heart_rate",
            average=data["avg_heart_rate"],
            min_value=data["min_heart_rate"],
            max_value=data["max_heart_rate"],
            trend="stable",
            data_points=data["count"],
            period=period
        ))
    
    return trends
