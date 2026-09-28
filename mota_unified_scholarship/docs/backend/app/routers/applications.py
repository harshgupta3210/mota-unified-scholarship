import random
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import (
    Application, ApplicationTimeline, ScholarshipScheme, 
    StudentProfile, User, Notification
)
from app.routers.auth import get_current_user

router = APIRouter(prefix="/applications", tags=["Applications"])

class ApplyRequest(BaseModel):
    scheme_code: str
    academic_year: Optional[str] = "2026-27"
    is_draft: Optional[bool] = False
    documents_submitted: Optional[List[str]] = []
    override_conflict_ack: Optional[bool] = False

class ResolveDeficiencyRequest(BaseModel):
    document_type: str
    document_number: Optional[str] = None
    remarks: str

@router.get("")
def get_student_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.profile
    if not profile:
        return []

    apps = db.query(Application).filter(Application.student_id == profile.id).all()
    
    # Also fetch all schemes to compute status for each of the 5 schemes for the unified dashboard
    all_schemes = db.query(ScholarshipScheme).all()
    apps_by_scheme = {a.scheme.code: a for a in apps}

    unified_overview = []
    for s in all_schemes:
        active_app = apps_by_scheme.get(s.code)
        
        if active_app:
            unified_overview.append({
                "id": active_app.id,
                "scheme_id": s.id,
                "scheme_code": s.code,
                "scheme_name": s.name,
                "scheme_name_hi": s.name_hi,
                "max_amount_display": s.max_amount_display,
                "application_number": active_app.application_number,
                "eligibility_status": active_app.eligibility_status,
                "application_status": active_app.status,
                "verification_status": active_app.verification_status,
                "sanction_status": active_app.sanction_status,
                "disbursement_status": active_app.disbursement_status,
                "current_stage": active_app.current_stage,
                "current_stage_name": active_app.current_stage_name,
                "deficiency_remarks": active_app.deficiency_remarks,
                "deficiency_field": active_app.deficiency_field,
                "sanction_amount": active_app.sanction_amount,
                "important_dates": s.important_dates,
                "has_active_application": True
            })
        else:
            # Determine mock eligibility/relevance for unapplied schemes for Demo Student (MCA student)
            if s.code == "PRE_MATRIC":
                elig_status = "Not Applicable"
                app_status = "Not Applicable"
            elif s.code == "NFST":
                elig_status = "Not Applicable"
                app_status = "Not Applicable"
            elif s.code == "NOS":
                elig_status = "Eligible"
                app_status = "Not Applied"
            else:
                elig_status = "Eligible"
                app_status = "Not Applied"

            unified_overview.append({
                "id": None,
                "scheme_id": s.id,
                "scheme_code": s.code,
                "scheme_name": s.name,
                "scheme_name_hi": s.name_hi,
                "max_amount_display": s.max_amount_display,
                "application_number": None,
                "eligibility_status": elig_status,
                "application_status": app_status,
                "verification_status": "Not Started",
                "sanction_status": "N/A",
                "disbursement_status": "N/A",
                "current_stage": 0,
                "current_stage_name": "Not Applied",
                "deficiency_remarks": None,
                "deficiency_field": None,
                "sanction_amount": 0.0,
                "important_dates": s.important_dates,
                "has_active_application": False
            })

    return unified_overview

@router.post("/check-conflict")
def check_application_conflict(
    req: ApplyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Checks if student is attempting to apply for conflicting scholarships.
    Under MoTA guidelines, a student cannot avail concurrent benefits from multiple scholarship schemes.
    """
    profile = current_user.profile
    if not profile:
        return {"has_conflict": False}

    # Find existing sanctioned or active applications
    active_apps = db.query(Application).filter(
        Application.student_id == profile.id,
        Application.status.in_(["Submitted", "Under Verification", "Deficiency", "Verified", "Sanctioned", "Payment Completed"])
    ).all()

    for app in active_apps:
        if app.scheme.code != req.scheme_code:
            return {
                "has_conflict": True,
                "conflict_scheme_name": app.scheme.name,
                "conflict_status": app.status,
                "warning_message": f"You are currently receiving or have an active application for {app.scheme.name} (Status: {app.status}). As per Ministry of Tribal Affairs guidelines, Scheduled Tribe students can avail only one scholarship/fellowship at a time. Please review scheme rules before proceeding."
            }

    return {"has_conflict": False, "warning_message": None}

@router.post("/submit")
def submit_application(
    req: ApplyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.profile
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile required")

    scheme = db.query(ScholarshipScheme).filter(ScholarshipScheme.code == req.scheme_code).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scholarship scheme not found")

    # Conflict Prevention Check
    active_apps = db.query(Application).filter(
        Application.student_id == profile.id,
        Application.status.in_(["Submitted", "Under Verification", "Deficiency", "Verified", "Sanctioned", "Payment Completed"])
    ).all()

    has_conflict = False
    conflicting_scheme = None
    for a in active_apps:
        if a.scheme.code != req.scheme_code and not req.override_conflict_ack:
            has_conflict = True
            conflicting_scheme = a.scheme.name
            break

    if has_conflict:
        return {
            "success": False,
            "conflict_blocked": True,
            "message": f"Conflict Detected: You are currently receiving/enrolled in {conflicting_scheme}. Under MoTA guidelines, only one scholarship can be availed at a time. Please acknowledge policy to proceed.",
            "warning": f"You are currently receiving {conflicting_scheme}. Please check the eligibility rules before applying for another scholarship."
        }

    # Generate unique application ID
    app_num = f"MOTA-{req.scheme_code[:2]}-2026-{random.randint(10000, 99999)}"
    
    status = "Draft" if req.is_draft else "Submitted"
    new_app = Application(
        application_number=app_num,
        student_id=profile.id,
        scheme_id=scheme.id,
        academic_year=req.academic_year,
        status=status,
        eligibility_status="Eligible",
        verification_status="Under Verification" if not req.is_draft else "Draft",
        sanction_status="Pending",
        disbursement_status="Pending",
        current_stage=1 if not req.is_draft else 0,
        current_stage_name="Application Submitted" if not req.is_draft else "Draft Saved",
        sanction_amount=scheme.max_amount,
        applied_date=datetime.utcnow()
    )
    db.add(new_app)
    db.flush()

    # Create 7-Stage Timeline
    stage_defs = [
        (1, "Application Submitted", "आवेदन जमा किया गया", "completed" if not req.is_draft else "pending", "Application submitted online via Unified MoTA Portal"),
        (2, "Document Verification", "दस्तावेज़ सत्यापन", "in_progress" if not req.is_draft else "pending", "Automated validation via DigiLocker, UIDAI & State Portals"),
        (3, "Institute Verification", "संस्थान सत्यापन", "pending", "Verification by College / University Nodal Officer"),
        (4, "State/Authority Verification", "राज्य/प्राधिकरण सत्यापन", "pending", "State Tribal Welfare Department Clearance"),
        (5, "Sanction", "स्वीकृति आदेश", "pending", "Ministry administrative and financial sanction"),
        (6, "DBT Processing", "डीबीटी प्रसंस्करण", "pending", "Public Financial Management System (PFMS) routing"),
        (7, "Payment Completed", "भुगतान संपन्न", "pending", "Direct transfer to Aadhaar-seeded bank account")
    ]
    for num, name, name_hi, st, desc in stage_defs:
        tl = ApplicationTimeline(
            application_id=new_app.id,
            stage_number=num,
            stage_name=name,
            stage_name_hi=name_hi,
            status=st,
            description=desc,
            completed_at=datetime.utcnow() if st == "completed" else None
        )
        db.add(tl)

    # Notify student
    notif = Notification(
        user_id=current_user.id,
        title=f"Application Submitted: {scheme.name}",
        title_hi=f"आवेदन जमा किया गया: {scheme.name_hi or scheme.name}",
        message=f"Your application {app_num} has been successfully submitted and forwarded for Document Verification.",
        message_hi=f"आपका आवेदन {app_num} सफलतापूर्वक जमा हो गया है और दस्तावेज़ सत्यापन के लिए अग्रेषित किया गया है।",
        type="submission"
    )
    db.add(notif)
    db.commit()

    return {
        "success": True,
        "application_id": new_app.id,
        "application_number": app_num,
        "message": f"Successfully applied for {scheme.name}!"
    }

@router.get("/{app_id}/timeline")
def get_application_timeline(app_id: int, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    timelines = db.query(ApplicationTimeline).filter(
        ApplicationTimeline.application_id == app_id
    ).order_by(ApplicationTimeline.stage_number).all()

    return {
        "application_number": app.application_number,
        "scheme_name": app.scheme.name,
        "status": app.status,
        "current_stage": app.current_stage,
        "deficiency_remarks": app.deficiency_remarks,
        "deficiency_field": app.deficiency_field,
        "stages": [
            {
                "stage_number": t.stage_number,
                "stage_name": t.stage_name,
                "stage_name_hi": t.stage_name_hi,
                "status": t.status,
                "description": t.description,
                "completed_at": t.completed_at.strftime("%d %b %Y, %I:%M %p") if t.completed_at else None
            }
            for t in timelines
        ]
    }

@router.post("/{app_id}/resolve-deficiency")
def resolve_deficiency(
    app_id: int,
    req: ResolveDeficiencyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    # Update application status
    app.status = "Under Verification"
    app.verification_status = "Pending Re-Verification"
    app.deficiency_remarks = None
    app.deficiency_field = None

    # Advance timeline stage
    stage2 = db.query(ApplicationTimeline).filter(
        ApplicationTimeline.application_id == app_id,
        ApplicationTimeline.stage_number == 2
    ).first()
    if stage2:
        stage2.status = "in_progress"
        stage2.description = f"Rectified {req.document_type} re-submitted. Automated re-verification initiated."

    notif = Notification(
        user_id=current_user.id,
        title="Deficiency Rectification Submitted",
        title_hi="त्रुटि सुधार जमा किया गया",
        message=f"Your updated document for {app.scheme.name} has been received and routed for re-verification.",
        message_hi=f"{app.scheme.name} के लिए आपका अद्यतन दस्तावेज़ प्राप्त हो गया है।",
        type="verification"
    )
    db.add(notif)
    db.commit()

    return {
        "success": True,
        "message": "Deficiency documents submitted successfully! Application is back under verification."
    }
