from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.db.models import CoverageGapMetric

router = APIRouter(prefix="/analytics", tags=["Coverage Gap Analytics"])

@router.get("/coverage-gap")
def get_coverage_gap_analytics(db: Session = Depends(get_db)):
    """
    Analyzes student enrollment records from UDISE+, APAAR, and AISHE against
    actual MoTA scholarship beneficiary databases to detect coverage gaps.
    Identifies potentially eligible ST students not currently receiving support.
    """
    metrics = db.query(CoverageGapMetric).all()

    total_enrolled = sum(m.total_enrolled_st for m in metrics)
    total_beneficiaries = sum(m.scholarship_beneficiaries for m in metrics)
    total_potentially_eligible = sum(m.potentially_eligible for m in metrics)
    total_incomplete = sum(m.incomplete_applications for m in metrics)
    
    # Calculate coverage percentage
    coverage_rate = round((total_beneficiaries / total_enrolled) * 100, 1) if total_enrolled else 0

    # District Breakdown
    districts_data = [
        {
            "id": m.id,
            "state": m.state,
            "district": m.district,
            "total_enrolled_st": m.total_enrolled_st,
            "scholarship_beneficiaries": m.scholarship_beneficiaries,
            "potentially_eligible": m.potentially_eligible,
            "incomplete_applications": m.incomplete_applications,
            "coverage_percentage": round((m.scholarship_beneficiaries / m.total_enrolled_st) * 100, 1),
            "outreach_priority": m.outreach_priority,
            "synced_source": m.synced_source
        }
        for m in metrics
    ]

    # Scheme-wise distribution estimation
    scheme_distribution = [
        {"scheme": "Pre-Matric", "beneficiaries": int(total_beneficiaries * 0.42), "target": int(total_enrolled * 0.45)},
        {"scheme": "Post-Matric", "beneficiaries": int(total_beneficiaries * 0.45), "target": int(total_enrolled * 0.42)},
        {"scheme": "Top Class Education", "beneficiaries": int(total_beneficiaries * 0.08), "target": int(total_enrolled * 0.08)},
        {"scheme": "NFST (National Fellowship)", "beneficiaries": int(total_beneficiaries * 0.04), "target": int(total_enrolled * 0.04)},
        {"scheme": "NOS (Overseas)", "beneficiaries": int(total_beneficiaries * 0.01), "target": int(total_enrolled * 0.01)}
    ]

    # Outreach Campaign recommendations
    outreach_camps = [
        {
            "district": "Sonbhadra, Uttar Pradesh",
            "uncovered_target": 2200,
            "suggested_action": "Mobile Common Service Center (CSC) Camp at Block Tehsils for APAAR and Income renewals.",
            "recommended_date": "15-20 October 2026",
            "priority": "High"
        },
        {
            "district": "Bastar, Chhattisgarh",
            "uncovered_target": 3300,
            "suggested_action": "Ashram School Special Enrollment Drive with Tribal Welfare Inspector verification.",
            "recommended_date": "10-18 October 2026",
            "priority": "High"
        },
        {
            "district": "Ranchi, Jharkhand",
            "uncovered_target": 3400,
            "suggested_action": "Polytechnic and ITI on-campus DigiLocker verification camps.",
            "recommended_date": "22-28 October 2026",
            "priority": "High"
        }
    ]

    return {
        "summary": {
            "total_enrolled_st": total_enrolled,
            "scholarship_beneficiaries": total_beneficiaries,
            "potentially_eligible": total_potentially_eligible,
            "incomplete_applications": total_incomplete,
            "coverage_percentage": coverage_rate,
            "compliance_note": "Students are classified as 'Potentially Eligible' pending verification of family income and institution enrollment."
        },
        "districts": districts_data,
        "scheme_distribution": scheme_distribution,
        "outreach_camps": outreach_camps
    }
