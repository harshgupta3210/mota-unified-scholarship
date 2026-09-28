from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import VerificationLog, Application, StudentProfile

router = APIRouter(prefix="/verify", tags=["Unified Verification Layer"])

class VerificationRequest(BaseModel):
    application_id: Optional[int] = None
    identifier: str
    student_name: Optional[str] = "Demo ST Student"
    metadata: Optional[dict] = {}

class VerificationResponse(BaseModel):
    status: str  # Verified, Invalid, Mismatch, Pending, Manual Review
    confidence: float
    source: str
    remarks: str
    routed_to_manual_queue: bool
    verified_at: str

def log_verification(
    db: Session,
    app_id: Optional[int],
    vtype: str,
    source: str,
    identifier: str,
    status: str,
    confidence: float,
    remarks: str,
    routed_manual: bool
):
    log = VerificationLog(
        application_id=app_id,
        verification_type=vtype,
        source_service=source,
        input_identifier=identifier,
        status=status,
        confidence=confidence,
        remarks=remarks,
        routed_to_manual_queue=routed_manual,
        created_at=datetime.utcnow()
    )
    db.add(log)
    db.commit()

@router.post("/identity")
def verify_identity(req: VerificationRequest, db: Session = Depends(get_db)):
    """
    Mock UIDAI Aadhaar Verification Service.
    Cross-checks demographic info (Name, DOB, Gender, Mobile OTP link).
    """
    is_valid = not ("invalid" in req.identifier.lower() or "0000" in req.identifier)
    is_mismatch = "mismatch" in req.identifier.lower()

    if is_valid and not is_mismatch:
        status = "Verified"
        confidence = 1.0
        remarks = "UIDAI Central ID Repository: 100% demographic and OTP match. Aadhaar successfully authenticated."
        routed_manual = False
    elif is_mismatch:
        status = "Mismatch"
        confidence = 0.52
        remarks = "UIDAI Data Mismatch: Name spelling in Aadhaar database does not match matriculation certificate. Routed for human officer review."
        routed_manual = True
    else:
        status = "Invalid"
        confidence = 0.0
        remarks = "UIDAI Error: Aadhaar number not found in registry."
        routed_manual = True

    log_verification(db, req.application_id, "identity", "UIDAI (Aadhaar Mock API)", req.identifier, status, confidence, remarks, routed_manual)

    return {
        "status": status,
        "confidence": confidence,
        "source": "UIDAI Aadhaar e-KYC Service (MOCK / SIMULATED)",
        "remarks": remarks,
        "routed_to_manual_queue": routed_manual,
        "verified_at": datetime.utcnow().strftime("%d %b %Y, %I:%M %p")
    }

@router.post("/st-certificate")
def verify_st_certificate(req: VerificationRequest, db: Session = Depends(get_db)):
    """
    Mock State e-District Caste Verification Service.
    Queries State Revenue Database for genuine Scheduled Tribe community certificates.
    """
    is_mismatch = "mismatch" in req.identifier.lower()
    is_invalid = "invalid" in req.identifier.lower()

    if not is_invalid and not is_mismatch:
        status = "Verified"
        confidence = 0.99
        remarks = "State e-District Portal: Caste Certificate verified. Category: Scheduled Tribe (Gond / Agariya PVTG). Signed by Competent Tehsildar."
        routed_manual = False
    elif is_mismatch:
        status = "Mismatch"
        confidence = 0.45
        remarks = "State Portal: Subcaste listed in application differs from e-District database record. Case diverted to manual review."
        routed_manual = True
    else:
        status = "Invalid"
        confidence = 0.1
        remarks = "State Portal: Certificate number not found or record archived. Diverted to manual review."
        routed_manual = True

    log_verification(db, req.application_id, "st-certificate", "State e-District Portal (Mock)", req.identifier, status, confidence, remarks, routed_manual)

    return {
        "status": status,
        "confidence": confidence,
        "source": "State e-District Caste Registry (MOCK / SIMULATED)",
        "remarks": remarks,
        "routed_to_manual_queue": routed_manual,
        "verified_at": datetime.utcnow().strftime("%d %b %Y, %I:%M %p")
    }

@router.post("/income")
def verify_income(req: VerificationRequest, db: Session = Depends(get_db)):
    """
    Mock State Revenue Income Verification API.
    Verifies income ceiling (<= ₹2.5 Lakhs or ₹6.0 Lakhs) and certificate validity period.
    """
    is_expired = "expired" in req.identifier.lower() or "11928" in req.identifier
    is_invalid = "invalid" in req.identifier.lower()

    if is_expired:
        status = "Mismatch"
        confidence = 0.48
        remarks = "Income certificate validity expired on 31-March-2026. Routed to Manual Review with deficiency notice."
        routed_manual = True
    elif is_invalid:
        status = "Invalid"
        confidence = 0.05
        remarks = "Income certificate unreadable or unauthenticated. Routed to Manual Review."
        routed_manual = True
    else:
        status = "Verified"
        confidence = 0.97
        remarks = "Annual family income verified at ₹1,80,000 / year (Within permissible limits). Certificate valid."
        routed_manual = False

    log_verification(db, req.application_id, "income", "State Revenue Department (Mock)", req.identifier, status, confidence, remarks, routed_manual)

    return {
        "status": status,
        "confidence": confidence,
        "source": "State Revenue Department API (MOCK / SIMULATED)",
        "remarks": remarks,
        "routed_to_manual_queue": routed_manual,
        "verified_at": datetime.utcnow().strftime("%d %b %Y, %I:%M %p")
    }

@router.post("/education")
def verify_education(req: VerificationRequest, db: Session = Depends(get_db)):
    """
    Mock UDISE+ and State Board / University Marksheet Verification.
    """
    status = "Verified"
    confidence = 0.98
    remarks = "UDISE+ / Academic Bank of Credits: Qualifying marksheet verified. 78.4% recorded in Central Database."
    routed_manual = False

    log_verification(db, req.application_id, "education", "UDISE+ / ABC NAD (Mock)", req.identifier, status, confidence, remarks, routed_manual)

    return {
        "status": status,
        "confidence": confidence,
        "source": "UDISE+ & Academic Bank of Credits (MOCK / SIMULATED)",
        "remarks": remarks,
        "routed_to_manual_queue": routed_manual,
        "verified_at": datetime.utcnow().strftime("%d %b %Y, %I:%M %p")
    }

@router.post("/institution")
def verify_institution(req: VerificationRequest, db: Session = Depends(get_db)):
    """
    Mock AISHE (All India Survey on Higher Education) Code Verification API.
    """
    status = "Verified"
    confidence = 1.0
    remarks = "AISHE Registry: AISHE Code C-48192 is recognized and accredited for Tribal Affairs scholarship disbursement."
    routed_manual = False

    log_verification(db, req.application_id, "institution", "AISHE Ministry of Education (Mock)", req.identifier, status, confidence, remarks, routed_manual)

    return {
        "status": status,
        "confidence": confidence,
        "source": "AISHE Portal, Ministry of Education (MOCK / SIMULATED)",
        "remarks": remarks,
        "routed_to_manual_queue": routed_manual,
        "verified_at": datetime.utcnow().strftime("%d %b %Y, %I:%M %p")
    }

@router.post("/net-jrf")
def verify_net_jrf(req: VerificationRequest, db: Session = Depends(get_db)):
    """
    Mock UGC / NTA NET-JRF Examination Registry for NFST applicants.
    """
    status = "Verified"
    confidence = 0.99
    remarks = "National Testing Agency (NTA): Candidate qualified for Junior Research Fellowship (JRF). Roll number verified."
    routed_manual = False

    log_verification(db, req.application_id, "net-jrf", "UGC / NTA Portal (Mock)", req.identifier, status, confidence, remarks, routed_manual)

    return {
        "status": status,
        "confidence": confidence,
        "source": "UGC / NTA National Registry (MOCK / SIMULATED)",
        "remarks": remarks,
        "routed_to_manual_queue": routed_manual,
        "verified_at": datetime.utcnow().strftime("%d %b %Y, %I:%M %p")
    }

@router.post("/disability")
def verify_disability(req: VerificationRequest, db: Session = Depends(get_db)):
    """
    Mock UDID (Unique Disability ID) Portal Verification for Divyangjan ST students.
    """
    status = "Verified"
    confidence = 0.96
    remarks = "UDID Central Portal: Disability certificate authenticated. 40%+ locomotor benchmark satisfied."
    routed_manual = False

    log_verification(db, req.application_id, "disability", "UDID Portal (Mock)", req.identifier, status, confidence, remarks, routed_manual)

    return {
        "status": status,
        "confidence": confidence,
        "source": "Department of Empowerment of Persons with Disabilities (MOCK / SIMULATED)",
        "remarks": remarks,
        "routed_to_manual_queue": routed_manual,
        "verified_at": datetime.utcnow().strftime("%d %b %Y, %I:%M %p")
    }

@router.get("/manual-queue")
def get_manual_review_queue(db: Session = Depends(get_db)):
    """
    Returns all verification logs or applications routed to the Manual Review Queue
    due to automated verification mismatches or discrepancies.
    """
    logs = db.query(VerificationLog).filter(VerificationLog.routed_to_manual_queue == True).all()
    results = []
    for l in logs:
        results.append({
            "id": l.id,
            "application_id": l.application_id,
            "verification_type": l.verification_type,
            "source_service": l.source_service,
            "input_identifier": l.input_identifier,
            "status": l.status,
            "confidence": l.confidence,
            "remarks": l.remarks,
            "created_at": l.created_at.strftime("%d %b %Y, %I:%M %p")
        })
    return results
