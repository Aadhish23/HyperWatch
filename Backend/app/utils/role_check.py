from typing import List, Literal


def check_user_role(user_role: str, allowed_roles: List[Literal["patient", "caregiver", "clinician"]]) -> bool:
    """
    Check if user role is in allowed roles list.
    
    Args:
        user_role: User's role
        allowed_roles: List of allowed roles
    
    Returns:
        True if user has permission, False otherwise
    """
    return user_role in allowed_roles


def can_access_patient_data(
    current_user_role: str,
    current_user_id: str,
    target_patient_id: str,
    assigned_patients: List[str]
) -> bool:
    """
    Check if user can access specific patient's data.
    
    Args:
        current_user_role: Current user's role
        current_user_id: Current user's ID
        target_patient_id: Patient ID being accessed
        assigned_patients: List of patient IDs assigned to current user
    
    Returns:
        True if access is allowed, False otherwise
    """
    # Patients can only access their own data
    if current_user_role == "patient":
        return current_user_id == target_patient_id
    
    # Caregivers and clinicians can access assigned patients
    if current_user_role in ["caregiver", "clinician"]:
        return target_patient_id in assigned_patients
    
    return False


def get_accessible_patient_ids(
    user_role: str,
    user_id: str,
    assigned_patients: List[str]
) -> List[str]:
    """
    Get list of patient IDs that user can access.
    
    Args:
        user_role: User's role
        user_id: User's ID
        assigned_patients: List of assigned patient IDs
    
    Returns:
        List of accessible patient IDs
    """
    if user_role == "patient":
        return [user_id]
    elif user_role in ["caregiver", "clinician"]:
        return assigned_patients
    else:
        return []
