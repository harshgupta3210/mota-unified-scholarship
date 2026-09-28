from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import User, StudentProfile
from app.routers.auth import get_current_user

router = APIRouter(prefix="/students", tags=["Students"])

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    st_subcaste: Optional[str] = None
    is_pvtg: Optional[bool] = None
    pvtg_community: Optional[str] = None
    institution_name: Optional[str] = None
    aishe_code: Optional[str] = None
    course_name: Optional[str] = None
    academic_year: Optional[str] = None
    annual_family_income: Optional[float] = None

@router.get("/profile")
def get_student_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.profile
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    return {
        "id": profile.id,
        "full_name": profile.full_name,
        "dob": profile.dob,
        "gender": profile.gender,
        "state": profile.state,
        "district": profile.district,
        "st_category": profile.st_category,
        "st_subcaste": profile.st_subcaste,
        "is_pvtg": profile.is_pvtg,
        "pvtg_community": profile.pvtg_community,
        "institution_name": profile.institution_name,
        "aishe_code": profile.aishe_code,
        "course_name": profile.course_name,
        "academic_year": profile.academic_year,
        "apaar_id": profile.apaar_id,
        "aadhaar_masked": profile.aadhaar_masked,
        "is_aadhaar_verified": profile.is_aadhaar_verified,
        "is_st_verified": profile.is_st_verified,
        "is_income_verified": profile.is_income_verified,
        "annual_family_income": profile.annual_family_income,
        "bank_name": profile.bank_name,
        "bank_account_masked": profile.bank_account_masked,
        "ifsc_code": profile.ifsc_code,
        "is_dbt_enabled": profile.is_dbt_enabled
    }

@router.put("/profile")
def update_student_profile(
    req: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.profile
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    for key, value in req.dict(exclude_unset=True).items():
        setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    return {"success": True, "message": "Profile updated successfully"}
