from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import PaymentRecord, StudentProfile, User
from app.routers.auth import get_current_user

router = APIRouter(prefix="/payments", tags=["Payments & DBT Tracking"])

@router.get("")
def list_payments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.profile
    if not profile:
        return []

    records = db.query(PaymentRecord).filter(PaymentRecord.student_id == profile.id).all()
    results = []
    for r in records:
        scheme_name = r.application.scheme.name if r.application and r.application.scheme else "MoTA Scholarship"
        results.append({
            "id": r.id,
            "application_id": r.application_id,
            "scheme_name": scheme_name,
            "installment_no": r.installment_no,
            "amount": r.amount,
            "amount_formatted": f"₹{r.amount:,.0f}",
            "payment_date": r.payment_date,
            "dbt_status": r.dbt_status,
            "pfms_txn_id": r.pfms_txn_id,
            "utr_no": r.utr_no,
            "bank_name": r.bank_name,
            "bank_account_masked": r.bank_account_masked,
            "academic_year": r.academic_year
        })
    return results

@router.get("/dbt-status")
def get_dbt_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.profile
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile not found")

    return {
        "is_dbt_enabled": profile.is_dbt_enabled,
        "aadhaar_seeded": True,
        "aadhaar_masked": profile.aadhaar_masked,
        "bank_name": profile.bank_name,
        "bank_account_masked": profile.bank_account_masked,
        "ifsc_code": profile.ifsc_code,
        "npci_mapping_status": "Active & Linked (Direct Benefit Transfer Ready)",
        "last_dbt_verified": "01 August 2026",
        "dbt_gateway": "PFMS - Public Financial Management System (MoTA / NPCI APBS)"
    }
