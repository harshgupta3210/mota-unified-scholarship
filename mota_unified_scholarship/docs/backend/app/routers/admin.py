from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.db.models import (
    Application, ApplicationTimeline, ScholarshipScheme, 
    StudentProfile, User, VerificationLog, PaymentRecord, Notification
)

router = APIRouter(prefix="/admin", tags=["MoTA Official Admin Portal"])

class ManualReviewActionRequest(BaseModel):
    action: str  # "approve", "deficiency", "reject"
    remarks: str
    deficiency_field: Optional[str] = None
    sanction_amount: Optional[float] = None

@router.get("/stats")
def get_admin_dashboard_stats(db: Session = Depends(get_db)):
    """
    Returns high-level Ministry overview metrics.
    """
    total_apps = db.query(Application).count()
    pending_verification = db.query(Application).filter(Application.status == "Under Verification").count()
    deficiencies = db.query(Application).filter(Application.status == "Deficiency").count()
    approved = db.query(Application).filter(Application.status.in_(["Verified", "Sanctioned", "Payment Completed"])).count()
    rejected = db.query(Application).filter(Application.status == "Rejected").count()
    
    manual_reviews = db.query(VerificationLog).filter(VerificationLog.routed_to_manual_queue == True).count()
    
    total_disbursed = db.query(func.sum(PaymentRecord.amount)).scalar() or 0.0

    # Applications by scheme
    schemes = db.query(ScholarshipScheme).all()
    scheme_stats = []
    for s in schemes:
        count = db.query(Application).filter(Application.scheme_id == s.id).count()
        scheme_stats.append({
            "scheme_id": s.id,
            "code": s.code,
            "name": s.name,
            "count": count
        })

    # State-wise distribution
    state_breakdown = [
        {"state": "Uttar Pradesh", "applications": 4200, "sanctioned": 3800, "disbursed_cr": "₹9.5 Cr"},
        {"state": "Madhya Pradesh", "applications": 8900, "sanctioned": 7950, "disbursed_cr": "₹19.8 Cr"},
        {"state": "Odisha", "applications": 7400, "sanctioned": 6700, "disbursed_cr": "₹16.2 Cr"},
        {"state": "Jharkhand", "applications": 6800, "sanctioned": 6100, "disbursed_cr": "₹15.0 Cr"},
        {"state": "Chhattisgarh", "applications": 5900, "sanctioned": 5300, "disbursed_cr": "₹13.1 Cr"},
        {"state": "Rajasthan", "applications": 5100, "sanctioned": 4650, "disbursed_cr": "₹11.4 Cr"},
        {"state": "Gujarat", "applications": 4800, "sanctioned": 4200, "disbursed_cr": "₹10.5 Cr"}
    ]

    # Institution-wise statistics
    institution_stats = [
        {"institution": "Demo Government College", "type": "State College", "total_applied": 142, "verified": 128, "pending": 14},
        {"institution": "IIT Bombay", "type": "Premier Institute", "total_applied": 85, "verified": 82, "pending": 3},
        {"institution": "Banaras Hindu University (BHU)", "type": "Central University", "total_applied": 310, "verified": 284, "pending": 26},
        {"institution": "National Institute of Technology (NIT) Rourkela", "type": "NIT", "total_applied": 115, "verified": 109, "pending": 6},
        {"institution": "Indira Gandhi National Tribal University (IGNTU)", "type": "Central Tribal Univ", "total_applied": 450, "verified": 412, "pending": 38}
    ]

    return {
        "overview": {
            "total_applications": total_apps + 43100,  # Combined aggregate mock for GoI scale
            "pending_verification": pending_verification + 1420,
            "manual_review_cases": manual_reviews + 380,
            "deficiencies": deficiencies + 890,
            "approved_applications": approved + 38200,
            "rejected_applications": rejected + 2210,
            "total_disbursed_cr": "₹85.4 Cr",
            "active_academic_year": "2026-27"
        },
        "scheme_stats": scheme_stats,
        "state_breakdown": state_breakdown,
        "institution_stats": institution_stats
    }

@router.get("/applications")
def list_admin_applications(
    status: Optional[str] = None,
    scheme_code: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Application)
    if status:
        query = query.filter(Application.status == status)
    if scheme_code:
        query = query.join(ScholarshipScheme).filter(ScholarshipScheme.code == scheme_code)
    
    apps = query.order_by(Application.applied_date.desc()).all()
    results = []
    for a in apps:
        student = a.student
        results.append({
            "id": a.id,
            "application_number": a.application_number,
            "student_name": student.full_name if student else "N/A",
            "state": student.state if student else "N/A",
            "district": student.district if student else "N/A",
            "st_category": student.st_category if student else "ST",
            "is_pvtg": student.is_pvtg if student else False,
            "pvtg_community": student.pvtg_community if student else None,
            "institution": student.institution_name if student else "N/A",
            "course": student.course_name if student else "N/A",
            "scheme_name": a.scheme.name if a.scheme else "N/A",
            "scheme_code": a.scheme.code if a.scheme else "N/A",
            "status": a.status,
            "current_stage": a.current_stage,
            "current_stage_name": a.current_stage_name,
            "verification_status": a.verification_status,
            "deficiency_remarks": a.deficiency_remarks,
            "applied_date": a.applied_date.strftime("%d %b %Y")
        })
    return results

@router.post("/applications/{app_id}/action")
def perform_admin_action(
    app_id: int,
    req: ManualReviewActionRequest,
    db: Session = Depends(get_db)
):
    """
    MoTA Official decision on flagged applications in manual review queue:
    - "approve": clears deficiency / manual flag, advances to Sanction Approved
    - "deficiency": sends deficiency notification to student with remarks
    - "reject": formally rejects application with reason
    """
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    student_user = app.student.user if app.student else None

    if req.action == "approve":
        app.status = "Sanctioned"
        app.verification_status = "Verified by MoTA Official"
        app.current_stage = 5
        app.current_stage_name = "Sanction Approved"
        app.deficiency_remarks = None
        app.sanction_order_no = f"MOTA/SANCTION/2026/{app.id}"

        # Update stage 2 & 5 timelines
        stage2 = db.query(ApplicationTimeline).filter(
            ApplicationTimeline.application_id == app.id,
            ApplicationTimeline.stage_number == 2
        ).first()
        if stage2:
            stage2.status = "completed"
            stage2.description = f"Cleared in Manual Review: {req.remarks}"

        stage5 = db.query(ApplicationTimeline).filter(
            ApplicationTimeline.application_id == app.id,
            ApplicationTimeline.stage_number == 5
        ).first()
        if stage5:
            stage5.status = "completed"
            stage5.description = f"Administrative Sanction Order #{app.sanction_order_no} generated."

        if student_user:
            notif = Notification(
                user_id=student_user.id,
                title=f"Sanction Approved: {app.scheme.name}",
                title_hi=f"स्वीकृति स्वीकृत: {app.scheme.name_hi or app.scheme.name}",
                message=f"Your application {app.application_number} has been verified and sanctioned by MoTA Official. DBT processing initiated.",
                message_hi=f"आपका आवेदन {app.application_number} स्वीकृत कर दिया गया है।",
                type="sanction"
            )
            db.add(notif)

    elif req.action == "deficiency":
        app.status = "Deficiency"
        app.verification_status = "Mismatch"
        app.current_stage = 2
        app.current_stage_name = "Document Verification"
        app.deficiency_field = req.deficiency_field or "Income Certificate"
        app.deficiency_remarks = req.remarks

        stage2 = db.query(ApplicationTimeline).filter(
            ApplicationTimeline.application_id == app.id,
            ApplicationTimeline.stage_number == 2
        ).first()
        if stage2:
            stage2.status = "deficiency"
            stage2.description = f"Deficiency Raised: {req.remarks}"

        if student_user:
            notif = Notification(
                user_id=student_user.id,
                title=f"Deficiency Notice: {app.deficiency_field}",
                title_hi=f"दस्तावेज़ सुधार सूचना: {app.deficiency_field}",
                message=f"Deficiency reported on your application {app.application_number}: {req.remarks}",
                message_hi=f"आपके आवेदन {app.application_number} में सुधार की आवश्यकता है: {req.remarks}",
                type="deficiency"
            )
            db.add(notif)

    elif req.action == "reject":
        app.status = "Rejected"
        app.verification_status = "Ineligible"
        app.deficiency_remarks = req.remarks

        if student_user:
            notif = Notification(
                user_id=student_user.id,
                title=f"Application Ineligible: {app.scheme.name}",
                title_hi=f"आवेदन अमान्य: {app.scheme.name_hi or app.scheme.name}",
                message=f"Your application {app.application_number} could not be approved: {req.remarks}",
                message_hi=f"आपका आवेदन {app.application_number} स्वीकृत नहीं हो सका: {req.remarks}",
                type="general"
            )
            db.add(notif)

    db.commit()

    return {
        "success": True,
        "message": f"Action '{req.action}' applied successfully to Application {app.application_number}",
        "new_status": app.status
    }
