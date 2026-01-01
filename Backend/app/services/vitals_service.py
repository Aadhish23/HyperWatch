from app.models.vitals import VitalSigns
from app.models.alert import Alert
from typing import Tuple, List, Dict, Any
from datetime import datetime


async def check_vitals_anomaly(
    vitals: VitalSigns,
    patient_data: Dict[str, Any]
) -> Tuple[bool, str, List[Dict[str, Any]]]:
    """
    Check if vital signs are outside normal thresholds.
    
    Args:
        vitals: VitalSigns object with measurements
        patient_data: Patient document with threshold settings
    
    Returns:
        Tuple of (is_anomaly, anomaly_type, list_of_alerts)
    """
    is_anomaly = False
    anomaly_type = None
    alerts = []
    
    # Check heart rate
    if vitals.heart_rate is not None:
        hr_min = patient_data.get("heart_rate_min", 60)
        hr_max = patient_data.get("heart_rate_max", 100)
        
        if vitals.heart_rate < hr_min:
            is_anomaly = True
            anomaly_type = "low"
            alerts.append(create_alert_dict(
                patient_id=vitals.patient_id,
                vital_type="heart_rate",
                vital_value=vitals.heart_rate,
                threshold_crossed="below_min",
                title="Low Heart Rate Detected",
                message=f"Heart rate ({vitals.heart_rate} BPM) is below minimum threshold ({hr_min} BPM)",
                alert_type="warning" if vitals.heart_rate >= (hr_min - 10) else "critical"
            ))
        elif vitals.heart_rate > hr_max:
            is_anomaly = True
            anomaly_type = "high"
            alerts.append(create_alert_dict(
                patient_id=vitals.patient_id,
                vital_type="heart_rate",
                vital_value=vitals.heart_rate,
                threshold_crossed="above_max",
                title="High Heart Rate Detected",
                message=f"Heart rate ({vitals.heart_rate} BPM) is above maximum threshold ({hr_max} BPM)",
                alert_type="warning" if vitals.heart_rate <= (hr_max + 20) else "critical"
            ))
    
    # Check blood pressure
    if vitals.systolic_bp is not None:
        sys_min = patient_data.get("systolic_bp_min", 90)
        sys_max = patient_data.get("systolic_bp_max", 140)
        
        if vitals.systolic_bp < sys_min:
            is_anomaly = True
            anomaly_type = "low"
            alerts.append(create_alert_dict(
                patient_id=vitals.patient_id,
                vital_type="systolic_bp",
                vital_value=vitals.systolic_bp,
                threshold_crossed="below_min",
                title="Low Blood Pressure Detected",
                message=f"Systolic BP ({vitals.systolic_bp} mmHg) is below minimum threshold ({sys_min} mmHg)",
                alert_type="warning"
            ))
        elif vitals.systolic_bp > sys_max:
            is_anomaly = True
            anomaly_type = "high"
            alerts.append(create_alert_dict(
                patient_id=vitals.patient_id,
                vital_type="systolic_bp",
                vital_value=vitals.systolic_bp,
                threshold_crossed="above_max",
                title="High Blood Pressure Detected",
                message=f"Systolic BP ({vitals.systolic_bp} mmHg) is above maximum threshold ({sys_max} mmHg)",
                alert_type="critical" if vitals.systolic_bp > 180 else "warning"
            ))
    
    # Check oxygen saturation
    if vitals.oxygen_saturation is not None:
        o2_min = patient_data.get("oxygen_saturation_min", 95)
        
        if vitals.oxygen_saturation < o2_min:
            is_anomaly = True
            anomaly_type = "low"
            alerts.append(create_alert_dict(
                patient_id=vitals.patient_id,
                vital_type="oxygen_saturation",
                vital_value=vitals.oxygen_saturation,
                threshold_crossed="below_min",
                title="Low Oxygen Saturation Detected",
                message=f"Oxygen saturation ({vitals.oxygen_saturation}%) is below minimum threshold ({o2_min}%)",
                alert_type="critical" if vitals.oxygen_saturation < 90 else "warning"
            ))
    
    # Check temperature
    if vitals.temperature is not None:
        temp_min = patient_data.get("temperature_min", 36.1)
        temp_max = patient_data.get("temperature_max", 37.2)
        
        if vitals.temperature < temp_min:
            is_anomaly = True
            anomaly_type = "low"
            alerts.append(create_alert_dict(
                patient_id=vitals.patient_id,
                vital_type="temperature",
                vital_value=vitals.temperature,
                threshold_crossed="below_min",
                title="Low Body Temperature Detected",
                message=f"Temperature ({vitals.temperature}°C) is below minimum threshold ({temp_min}°C)",
                alert_type="warning"
            ))
        elif vitals.temperature > temp_max:
            is_anomaly = True
            anomaly_type = "high"
            alerts.append(create_alert_dict(
                patient_id=vitals.patient_id,
                vital_type="temperature",
                vital_value=vitals.temperature,
                threshold_crossed="above_max",
                title="High Body Temperature Detected",
                message=f"Temperature ({vitals.temperature}°C) is above maximum threshold ({temp_max}°C)",
                alert_type="critical" if vitals.temperature > 39 else "warning"
            ))
    
    return is_anomaly, anomaly_type, alerts


def create_alert_dict(
    patient_id: str,
    vital_type: str,
    vital_value: float,
    threshold_crossed: str,
    title: str,
    message: str,
    alert_type: str = "warning"
) -> Dict[str, Any]:
    """
    Create an alert dictionary for database insertion.
    
    Args:
        patient_id: Patient ID
        vital_type: Type of vital sign
        vital_value: Measured value
        threshold_crossed: "above_max" or "below_min"
        title: Alert title
        message: Alert message
        alert_type: "critical", "warning", or "info"
    
    Returns:
        Alert dictionary ready for database insertion
    """
    severity_map = {
        "critical": "high",
        "warning": "medium",
        "info": "low"
    }
    
    return {
        "patient_id": patient_id,
        "alert_type": alert_type,
        "severity": severity_map.get(alert_type, "medium"),
        "title": title,
        "message": message,
        "vital_type": vital_type,
        "vital_value": vital_value,
        "threshold_crossed": threshold_crossed,
        "is_read": False,
        "is_resolved": False,
        "notified_users": [],
        "notification_sent": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }


async def create_vital_alert(alert_data: Dict[str, Any], db):
    """
    Create and save a vital sign alert to database.
    
    Args:
        alert_data: Alert data dictionary
        db: Database instance
    
    Returns:
        Inserted alert ID
    """
    from app.core.database import ALERTS_COLLECTION
    result = await db[ALERTS_COLLECTION].insert_one(alert_data)
    return str(result.inserted_id)
