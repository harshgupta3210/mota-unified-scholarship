from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import ScholarshipScheme, StudentProfile, Application
from app.routers.auth import get_current_user

router = APIRouter(prefix="/scholarships", tags=["Scholarships"])

class EligibilityCheckRequest(BaseModel):
    scheme_code: str
    annual_income: float
    course_level: str
    has_premier_admission: Optional[bool] = False
    has_net_jrf: Optional[bool] = False
    has_foreign_offer: Optional[bool] = False

@router.get("")
def list_scholarships(
    db: Session = Depends(get_db)
):
    schemes = db.query(ScholarshipScheme).filter(ScholarshipScheme.is_active == True).all()
    results = []
    for s in schemes:
        results.append({
            "id": s.id,
            "code": s.code,
            "name": s.name,
            "name_hi": s.name_hi,
            "level": s.level,
            "description": s.description,
            "description_hi": s.description_hi,
            "max_amount": s.max_amount,
            "max_amount_display": s.max_amount_display,
            "income_limit": s.income_limit,
            "income_limit_display": s.income_limit_display,
            "eligibility_criteria": s.eligibility_criteria,
            "required_documents": s.required_documents.split(", "),
            "important_dates": s.important_dates
        })
    return results

@router.get("/{scheme_id}")
def get_scholarship_details(scheme_id: int, db: Session = Depends(get_db)):
    s = db.query(ScholarshipScheme).filter(ScholarshipScheme.id == scheme_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Scholarship scheme not found")
    return {
        "id": s.id,
        "code": s.code,
        "name": s.name,
        "name_hi": s.name_hi,
        "level": s.level,
        "description": s.description,
        "description_hi": s.description_hi,
        "max_amount": s.max_amount,
        "max_amount_display": s.max_amount_display,
        "income_limit": s.income_limit,
        "income_limit_display": s.income_limit_display,
        "eligibility_criteria": s.eligibility_criteria,
        "required_documents": s.required_documents.split(", "),
        "important_dates": s.important_dates
    }

@router.post("/check-eligibility")
def check_eligibility(req: EligibilityCheckRequest):
    """
    Evaluates real-time eligibility criteria for the 5 MoTA schemes.
    """
    eligible = False
    reasons = []

    if req.scheme_code == "PRE_MATRIC":
        if "school" in req.course_level.lower() or "secondary" in req.course_level.lower() or "class 9" in req.course_level.lower() or "class 10" in req.course_level.lower():
            if req.annual_income <= 250000:
                eligible = True
            else:
                reasons.append("Annual parental income exceeds ₹2.50 Lakh limit.")
        else:
            reasons.append("Pre-Matric is applicable only for Class IX and X students.")

    elif req.scheme_code == "POST_MATRIC":
        if req.annual_income <= 250000:
            eligible = True
        else:
            reasons.append("Parental income exceeds ₹2.50 Lakh limit for Post-Matric.")

    elif req.scheme_code == "TOP_CLASS":
        if req.annual_income <= 600000:
            if req.has_premier_admission:
                eligible = True
            else:
                reasons.append("Requires admission to a notified premier institute (IIT/IIM/NIT/AIIMS).")
        else:
            reasons.append("Parental income exceeds ₹6.00 Lakh limit for Top Class.")

    elif req.scheme_code == "NFST":
        if req.has_net_jrf:
            eligible = True
        else:
            reasons.append("NFST requires qualification in UGC-NET or CSIR-NET JRF for regular M.Phil/Ph.D.")

    elif req.scheme_code == "NOS":
        if req.annual_income <= 600000:
            if req.has_foreign_offer:
                eligible = True
            else:
                reasons.append("NOS requires an unconditional offer letter from top-500 QS ranked university abroad.")
        else:
            reasons.append("Income exceeds ₹6.00 Lakh ceiling for Overseas Scholarship.")

    return {
        "scheme_code": req.scheme_code,
        "is_eligible": eligible,
        "status": "Eligible" if eligible else "Not Eligible",
        "reasons": reasons if not eligible else ["Student satisfies caste, income, and educational requirements."]
    }
