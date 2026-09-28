from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import User, StudentProfile
from app.core.security import verify_password, create_access_token, decode_access_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

class LoginRequest(BaseModel):
    username_or_email: str
    password: Optional[str] = None
    role: Optional[str] = "student"

class SendOtpRequest(BaseModel):
    mobile_or_email: str

class VerifyOtpRequest(BaseModel):
    mobile_or_email: str
    otp: str

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication credentials"
        )
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.post("/send-otp")
def send_otp(req: SendOtpRequest):
    """
    Simulates sending an OTP to mobile or email via government SMS gateway (CDAC).
    For demo / SIH presentations, returns standard OTP '123456'.
    """
    return {
        "success": True,
        "message": f"Demo OTP sent to {req.mobile_or_email}. For evaluation use: 123456",
        "demo_otp": "123456",
        "channel": "SMS Gateway (Mock CDAC / NIC)",
        "expires_in_seconds": 300
    }

@router.post("/verify-otp")
def verify_otp(req: VerifyOtpRequest, db: Session = Depends(get_db)):
    """
    Verifies OTP and returns an authentication JWT.
    Accepts demo OTP '123456' for any demo account.
    """
    if req.otp != "123456":
        raise HTTPException(status_code=400, detail="Invalid OTP entered. Please use demo OTP: 123456")
    
    # Check if student exists or locate default demo student
    user = db.query(User).filter(
        (User.phone == req.mobile_or_email) | (User.email == req.mobile_or_email)
    ).first()
    
    if not user:
        # Default to first student user in seed data
        user = db.query(User).filter(User.role == "student").first()

    token = create_access_token(subject=user.id, role=user.role)
    profile = user.profile

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "full_name": profile.full_name if profile else "Tribal Student",
            "institution": profile.institution_name if profile else "",
            "is_pvtg": profile.is_pvtg if profile else False
        }
    }

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """
    Password login supporting both Demo Student and MoTA Official / Admin accounts.
    """
    user = db.query(User).filter(
        (User.email == req.username_or_email) | (User.phone == req.username_or_email)
    ).first()
    
    # If using one-click demo login without strict password
    if not user:
        if "admin" in req.username_or_email.lower():
            user = db.query(User).filter(User.role == "admin").first()
        else:
            user = db.query(User).filter(User.role == "student").first()
            
    if not user:
        raise HTTPException(status_code=400, detail="User account not found")

    token = create_access_token(subject=user.id, role=user.role)
    profile = user.profile

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "full_name": profile.full_name if profile else ("MoTA Official" if user.role == "admin" else "Student"),
            "institution": profile.institution_name if profile else "Ministry of Tribal Affairs",
            "is_pvtg": profile.is_pvtg if profile else False,
            "aadhaar_masked": profile.aadhaar_masked if profile else "XXXX-XXXX-8921"
        }
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    profile = current_user.profile
    return {
        "id": current_user.id,
        "email": current_user.email,
        "phone": current_user.phone,
        "role": current_user.role,
        "profile": {
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
            "course_level": profile.course_level,
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
        } if profile else None
    }
