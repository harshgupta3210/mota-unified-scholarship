import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Document, StudentProfile, User
from app.routers.auth import get_current_user

router = APIRouter(prefix="/documents", tags=["Documents"])

class DigiLockerPullRequest(BaseModel):
    doc_type: str  # ST Certificate, Income Certificate, Marksheet, Domicile Certificate, etc.

class ManualUploadRequest(BaseModel):
    doc_type: str
    doc_name: str
    doc_number: Optional[str] = None
    remarks: Optional[str] = None

@router.get("")
def list_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.profile
    if not profile:
        return []

    docs = db.query(Document).filter(Document.student_id == profile.id).all()
    return [
        {
            "id": d.id,
            "doc_type": d.doc_type,
            "doc_name": d.doc_name,
            "doc_number": d.doc_number,
            "source": d.source,
            "digilocker_uri": d.digilocker_uri,
            "verification_status": d.verification_status,
            "verification_source": d.verification_source,
            "confidence_score": d.confidence_score,
            "remarks": d.remarks,
            "file_size_kb": d.file_size_kb,
            "issued_date": d.issued_date,
            "uploaded_at": d.uploaded_at.strftime("%d %b %Y, %I:%M %p")
        }
        for d in docs
    ]

@router.post("/digilocker-pull")
def pull_from_digilocker(
    req: DigiLockerPullRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Simulates pulling a digitally signed certificate from DigiLocker:
    DigiLocker -> Document Verification API -> Verified Document
    """
    profile = current_user.profile
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile not found")

    # Mapping of doc types to mock DigiLocker issuers
    doc_meta = {
        "ST Certificate": ("Scheduled Tribe Caste Certificate", "in.gov.edistrict.caste", "State e-District Authority", "Verified"),
        "PVTG Certificate": ("Particularly Vulnerable Tribal Group Certificate", "in.gov.mota.pvtg", "District Collector / MoTA", "Verified"),
        "Income Certificate": ("Annual Family Income Certificate", "in.gov.edistrict.revenue", "State Revenue Department", "Verified"),
        "Domicile Certificate": ("State Domicile / Residence Certificate", "in.gov.edistrict.domicile", "Sub-Divisional Magistrate", "Verified"),
        "Marksheets": ("Secondary / Degree Examination Marksheet", "in.gov.cbse.marksheet", "DigiLocker NAD / Academic Bank of Credits", "Verified"),
        "Disability Certificate": ("Unique Disability ID (UDID) Card", "in.gov.swavlamban.udid", "Department of Empowerment of Persons with Disabilities", "Verified"),
        "Institution Certificate": ("College Bonafide Certificate", "in.gov.aishe.bonafide", "AISHE / Nodal Institute Registry", "Verified"),
        "NET/JRF Certificate": ("UGC-NET / CSIR-NET Junior Research Fellowship Award Letter", "in.gov.nta.netjrf", "National Testing Agency (NTA)", "Verified"),
        "Identity Documents": ("Aadhaar Identity Card", "in.gov.uidai.aadhaar", "UIDAI Central Identity Repository", "Verified")
    }

    info = doc_meta.get(req.doc_type, (f"{req.doc_type} Document", f"in.gov.digilocker.{req.doc_type.lower()}", "DigiLocker Gateway", "Verified"))
    doc_name, uri_prefix, issuer, status = info

    # Check if this doc already exists in wallet
    existing = db.query(Document).filter(
        Document.student_id == profile.id,
        Document.doc_type == req.doc_type
    ).first()

    mock_doc_no = f"DL/{datetime.utcnow().year}/{random.randint(100000, 999999)}"
    digi_uri = f"{uri_prefix}:{random.randint(10000, 99999)}"

    if existing:
        existing.source = "DigiLocker"
        existing.digilocker_uri = digi_uri
        existing.verification_status = status
        existing.verification_source = issuer
        existing.doc_number = mock_doc_no
        existing.remarks = f"Digitally fetched & cryptographically verified via DigiLocker from {issuer}."
        existing.issued_date = datetime.utcnow().strftime("%d %b %Y")
        db.commit()
        db.refresh(existing)
        return {
            "success": True,
            "message": f"Successfully refreshed {req.doc_type} directly from DigiLocker!",
            "document": {
                "id": existing.id,
                "doc_name": existing.doc_name,
                "verification_status": existing.verification_status,
                "digilocker_uri": existing.digilocker_uri,
                "verification_source": existing.verification_source
            }
        }
    else:
        new_doc = Document(
            student_id=profile.id,
            doc_type=req.doc_type,
            doc_name=doc_name,
            doc_number=mock_doc_no,
            source="DigiLocker",
            digilocker_uri=digi_uri,
            verification_status=status,
            verification_source=issuer,
            confidence_score=1.0,
            remarks=f"Digitally fetched & cryptographically verified via DigiLocker from {issuer}.",
            issued_date=datetime.utcnow().strftime("%d %b %Y")
        )
        db.add(new_doc)
        db.commit()
        db.refresh(new_doc)
        return {
            "success": True,
            "message": f"Successfully pulled {req.doc_type} into your DigiLocker Wallet!",
            "document": {
                "id": new_doc.id,
                "doc_name": new_doc.doc_name,
                "verification_status": new_doc.verification_status,
                "digilocker_uri": new_doc.digilocker_uri,
                "verification_source": new_doc.verification_source
            }
        }

@router.post("/upload")
def upload_document(
    req: ManualUploadRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.profile
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile not found")

    new_doc = Document(
        student_id=profile.id,
        doc_type=req.doc_type,
        doc_name=req.doc_name,
        doc_number=req.doc_number or f"DOC-{random.randint(10000, 99999)}",
        source="Direct Upload",
        digilocker_uri=None,
        verification_status="Pending",
        verification_source="Awaiting Institutional/State Review",
        confidence_score=0.80,
        remarks=req.remarks or "Uploaded by student; forwarded for verification.",
        issued_date=datetime.utcnow().strftime("%d %b %Y")
    )
    db.add(new_doc)
    db.commit()
    return {"success": True, "message": "Document uploaded successfully to Digital Wallet"}
