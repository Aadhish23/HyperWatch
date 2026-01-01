from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.user import (
    UserUpdate,
    UserProfile,
    PatientCreateRequest,
    PatientCreateResponse,
    PatientOverview,
)
from app.models.user import User
from app.models.patient import Patient
from app.api.deps import get_current_user, require_caregiver_or_clinician
from app.core.database import get_database, USERS_COLLECTION, PATIENTS_COLLECTION, VITALS_COLLECTION
from app.core.security import get_password_hash
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/profile", response_model=UserProfile)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """
    Get current user's profile with extended information.
    
    - Returns user details including medical info for patients
    """
    db = get_database()
    profile = UserProfile(
        id=current_user.id or "",
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        phone=current_user.phone,
        date_of_birth=current_user.date_of_birth,
        gender=current_user.gender,
        assigned_patients=current_user.assigned_patients,
        assigned_caregiver=current_user.assigned_caregiver,
        created_at=current_user.created_at
    )
    
    # If patient, fetch medical information
    if current_user.role == "patient":
        patient_data = await db[PATIENTS_COLLECTION].find_one({"user_id": current_user.id})
        if patient_data:
            profile.blood_type = patient_data.get("blood_type")
            profile.allergies = patient_data.get("allergies", [])
            profile.medications = patient_data.get("medications", [])
            profile.medical_conditions = patient_data.get("medical_conditions", [])
            profile.emergency_contact_name = patient_data.get("emergency_contact_name")
            profile.emergency_contact_phone = patient_data.get("emergency_contact_phone")
            profile.device_id = patient_data.get("device_id")
            profile.device_calibrated = patient_data.get("device_calibrated", False)
    
    return profile


@router.put("/profile", response_model=dict)
async def update_user_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Update current user's profile.
    
    - Updates user information
    - For patients, also updates medical information
    """
    db = get_database()
    user_id = ObjectId(current_user.id)
    
    # Build update dictionary for user
    user_update = {}
    if update_data.full_name is not None:
        user_update["full_name"] = update_data.full_name
    if update_data.phone is not None:
        user_update["phone"] = update_data.phone
    if update_data.date_of_birth is not None:
        user_update["date_of_birth"] = update_data.date_of_birth
    if update_data.gender is not None:
        user_update["gender"] = update_data.gender
    
    if user_update:
        user_update["updated_at"] = datetime.utcnow()
        await db[USERS_COLLECTION].update_one(
            {"_id": user_id},
            {"$set": user_update}
        )
    
    # Update patient-specific information
    if current_user.role == "patient":
        patient_update = {}
        if update_data.blood_type is not None:
            patient_update["blood_type"] = update_data.blood_type
        if update_data.allergies is not None:
            patient_update["allergies"] = update_data.allergies
        if update_data.medications is not None:
            patient_update["medications"] = update_data.medications
        if update_data.medical_conditions is not None:
            patient_update["medical_conditions"] = update_data.medical_conditions
        if update_data.emergency_contact_name is not None:
            patient_update["emergency_contact_name"] = update_data.emergency_contact_name
        if update_data.emergency_contact_phone is not None:
            patient_update["emergency_contact_phone"] = update_data.emergency_contact_phone
        if update_data.emergency_contact_relationship is not None:
            patient_update["emergency_contact_relationship"] = update_data.emergency_contact_relationship
        
        if patient_update:
            patient_update["updated_at"] = datetime.utcnow()
            await db[PATIENTS_COLLECTION].update_one(
                {"user_id": current_user.id},
                {"$set": patient_update}
            )
    
    return {"message": "Profile updated successfully"}


@router.get("/patients", response_model=list[dict])
async def get_assigned_patients(current_user: User = Depends(get_current_user)):
    """
    Get list of assigned patients (for caregivers and clinicians).
    
    - Returns patient information for monitoring
    """
    if current_user.role not in ["caregiver", "clinician"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only caregivers and clinicians can access this endpoint"
        )
    
    db = get_database()
    
    # Get assigned patient IDs
    patient_ids = current_user.assigned_patients
    if not patient_ids:
        return []
    
    # Fetch patient users
    patients = []
    for patient_id in patient_ids:
        try:
            user_data = await db[USERS_COLLECTION].find_one({"_id": ObjectId(patient_id)})
            if user_data:
                patients.append({
                    "id": str(user_data["_id"]),
                    "full_name": user_data.get("full_name"),
                    "email": user_data.get("email"),
                    "phone": user_data.get("phone")
                })
        except:
            continue
    
    return patients


@router.get("/patients/overview", response_model=list[PatientOverview])
async def get_patients_overview(current_user: User = Depends(require_caregiver_or_clinician)):
    """
    Get assigned patients with latest vitals snapshot.

    - Caregiver/Clinician only
    - Includes basic demographics and most recent vitals
    """

    db = get_database()
    patient_ids = current_user.assigned_patients or []

    if not patient_ids:
        return []

    overview: list[PatientOverview] = []

    for patient_id in patient_ids:
        try:
            user_data = await db[USERS_COLLECTION].find_one({"_id": ObjectId(patient_id)})
            if not user_data:
                continue

            latest_vitals = await db[VITALS_COLLECTION].find_one(
                {"patient_id": patient_id},
                sort=[("measured_at", -1)],
            )

            overview.append(
                PatientOverview(
                    id=str(user_data["_id"]),
                    email=user_data.get("email"),
                    full_name=user_data.get("full_name"),
                    phone=user_data.get("phone"),
                    gender=user_data.get("gender"),
                    date_of_birth=user_data.get("date_of_birth"),
                    systolic_bp=latest_vitals.get("systolic_bp") if latest_vitals else None,
                    diastolic_bp=latest_vitals.get("diastolic_bp") if latest_vitals else None,
                    heart_rate=latest_vitals.get("heart_rate") if latest_vitals else None,
                    oxygen_saturation=latest_vitals.get("oxygen_saturation") if latest_vitals else None,
                    temperature=latest_vitals.get("temperature") if latest_vitals else None,
                    last_measurement_at=latest_vitals.get("measured_at") if latest_vitals else None,
                    is_anomaly=latest_vitals.get("is_anomaly", False) if latest_vitals else False,
                )
            )
        except Exception:
            # Skip malformed IDs or lookup issues without failing the entire list
            continue

    return overview


@router.post("/patients", response_model=PatientCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_patient(
    patient_data: PatientCreateRequest,
    current_user: User = Depends(require_caregiver_or_clinician)
):
    """
    Create a new patient (Caregiver/Clinician only).
    
    - Creates a User account with role=patient
    - Creates a PatientProfile document
    - Assigns to caregiver/clinician if provided
    - Generates a temporary password (should be changed on first login)
    """
    db = get_database()
    
    # Check if email already exists
    existing_user = await db[USERS_COLLECTION].find_one({"email": patient_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )
    
    # Generate temporary password (format: FirstName123!)
    temp_password = f"{patient_data.full_name.split()[0]}123!"
    
    # Calculate date of birth from age if provided
    date_of_birth = None
    if patient_data.age is not None:
        from datetime import timedelta
        current_year = datetime.utcnow().year
        birth_year = current_year - patient_data.age
        date_of_birth = datetime(birth_year, 1, 1)
    
    # Create User document
    new_user = User(
        email=patient_data.email,
        hashed_password=get_password_hash(temp_password),
        full_name=patient_data.full_name,
        role="patient",
        phone=patient_data.phone,
        date_of_birth=date_of_birth,
        gender=patient_data.gender,
        assigned_caregiver=patient_data.assigned_caregiver_id,
        assigned_patients=[]
    )
    
    # Insert user
    user_dict = new_user.model_dump(by_alias=True, exclude={"id"})
    user_result = await db[USERS_COLLECTION].insert_one(user_dict)
    user_id = str(user_result.inserted_id)
    
    # Create Patient profile
    new_patient = Patient(
        user_id=user_id,
        blood_type=patient_data.blood_type,
        allergies=patient_data.allergies or [],
        medications=patient_data.medications or [],
        medical_conditions=patient_data.medical_conditions or [],
        emergency_contact_name=patient_data.emergency_contact_name,
        emergency_contact_phone=patient_data.emergency_contact_phone,
        emergency_contact_relationship=patient_data.emergency_contact_relationship
    )
    
    patient_dict = new_patient.model_dump(by_alias=True, exclude={"id"})
    patient_result = await db[PATIENTS_COLLECTION].insert_one(patient_dict)
    patient_id = str(patient_result.inserted_id)
    
    # Update caregiver's assigned_patients list if provided
    if patient_data.assigned_caregiver_id:
        try:
            await db[USERS_COLLECTION].update_one(
                {"_id": ObjectId(patient_data.assigned_caregiver_id)},
                {"$addToSet": {"assigned_patients": user_id}}
            )
        except Exception as e:
            # Log warning but don't fail the patient creation
            print(f"Warning: Could not assign to caregiver: {e}")
    
    # Update clinician's assigned_patients list if provided
    if patient_data.assigned_clinician_id:
        try:
            await db[USERS_COLLECTION].update_one(
                {"_id": ObjectId(patient_data.assigned_clinician_id)},
                {"$addToSet": {"assigned_patients": user_id}}
            )
        except Exception as e:
            # Log warning but don't fail the patient creation
            print(f"Warning: Could not assign to clinician: {e}")
    
    return PatientCreateResponse(
        patient_id=patient_id,
        user_id=user_id,
        email=patient_data.email,
        full_name=patient_data.full_name,
        message=f"Patient created successfully. Temporary password: {temp_password}"
    )

