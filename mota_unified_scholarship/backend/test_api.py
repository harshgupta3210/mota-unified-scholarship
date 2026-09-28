from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"
    print("[PASS] Health check passed")

def test_auth_otp():
    # 1. Send OTP
    send_res = client.post("/api/auth/send-otp", json={"mobile_or_email": "9876543210"})
    assert send_res.status_code == 200
    assert send_res.json()["demo_otp"] == "123456"

    # 2. Verify OTP
    verify_res = client.post("/api/auth/verify-otp", json={"mobile_or_email": "9876543210", "otp": "123456"})
    assert verify_res.status_code == 200
    token = verify_res.json()["access_token"]
    assert token is not None
    print("[PASS] Auth OTP flow passed")
    return token

def test_schemes():
    res = client.get("/api/scholarships")
    assert res.status_code == 200
    schemes = res.json()
    assert len(schemes) == 5
    codes = [s["code"] for s in schemes]
    assert "PRE_MATRIC" in codes
    assert "POST_MATRIC" in codes
    assert "TOP_CLASS" in codes
    assert "NFST" in codes
    assert "NOS" in codes
    print("[PASS] All 5 MoTA schemes listed properly")

def test_eligibility_checker():
    # Check Top Class eligibility with high vs low income
    res1 = client.post("/api/scholarships/check-eligibility", json={
        "scheme_code": "TOP_CLASS",
        "annual_income": 180000,
        "course_level": "Post Graduate",
        "has_premier_admission": True
    })
    assert res1.status_code == 200
    assert res1.json()["is_eligible"] == True

    res2 = client.post("/api/scholarships/check-eligibility", json={
        "scheme_code": "TOP_CLASS",
        "annual_income": 800000,
        "course_level": "Post Graduate",
        "has_premier_admission": True
    })
    assert res2.status_code == 200
    assert res2.json()["is_eligible"] == False
    print("[PASS] Dynamic eligibility rules engine passed")

def test_conflict_detection(token: str):
    headers = {"Authorization": f"Bearer {token}"}
    # Demo student already has active Post-Matric & Top Class applications
    res = client.post("/api/applications/check-conflict", json={"scheme_code": "PRE_MATRIC"}, headers=headers)
    assert res.status_code == 200
    assert res.json()["has_conflict"] == True
    assert "Post-Matric Scholarship" in res.json()["warning_message"]
    print("[PASS] Conflict prevention engine passed")

def test_document_wallet_and_digilocker(token: str):
    headers = {"Authorization": f"Bearer {token}"}
    res = client.get("/api/documents", headers=headers)
    assert res.status_code == 200
    docs = res.json()
    assert len(docs) >= 5

    # Test DigiLocker Pull
    pull_res = client.post("/api/documents/digilocker-pull", json={"doc_type": "ST Certificate"}, headers=headers)
    assert pull_res.status_code == 200
    assert pull_res.json()["success"] == True
    print("[PASS] DigiLocker Wallet integration passed")

def test_seven_mock_verification_services():
    endpoints = [
        ("/api/verify/identity", {"identifier": "XXXX-XXXX-8921"}, "Verified"),
        ("/api/verify/st-certificate", {"identifier": "UP/SBD/ST/2023/88910"}, "Verified"),
        ("/api/verify/income", {"identifier": "INC/UP/2025/11928_expired"}, "Mismatch"),
        ("/api/verify/education", {"identifier": "MARKS/AKTU/99812"}, "Verified"),
        ("/api/verify/institution", {"identifier": "C-48192"}, "Verified"),
        ("/api/verify/net-jrf", {"identifier": "UGC-NET-JRF-2025"}, "Verified"),
        ("/api/verify/disability", {"identifier": "UDID-98124"}, "Verified"),
    ]
    for url, payload, expected_status in endpoints:
        res = client.post(url, json=payload)
        assert res.status_code == 200
        assert res.json()["status"] == expected_status
        if expected_status == "Mismatch":
            assert res.json()["routed_to_manual_queue"] == True
    print("[PASS] All 7 Mock Verification Layer endpoints passed with manual-review routing")

def test_jago_chatbot(token: str):
    headers = {"Authorization": f"Bearer {token}"}
    queries = [
        ("Where is my scholarship application?", "en"),
        ("मेरा छात्रवृत्ति आवेदन किस स्थिति में है?", "hi"),
        ("What document is missing?", "en"),
        ("When will my scholarship payment arrive?", "en"),
        ("Am I eligible for Top Class Scholarship?", "en"),
        ("What was my previous scholarship payment?", "en")
    ]
    for q, lang in queries:
        res = client.post("/api/chatbot/query", json={"query": q, "language": lang}, headers=headers)
        assert res.status_code == 200
        data = res.json()
        assert len(data["response"]) > 20
        assert len(data["suggested_actions"]) > 0
    print("[PASS] JAGO AI Chatbot contextual responses (EN and HI) passed")

def test_payments(token: str):
    headers = {"Authorization": f"Bearer {token}"}
    res = client.get("/api/payments", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) >= 1
    assert res.json()[0]["amount"] == 25000.0
    assert res.json()[0]["dbt_status"] == "Payment Completed"
    print("[PASS] DBT payment tracker passed")

def test_coverage_gap_analytics():
    res = client.get("/api/analytics/coverage-gap")
    assert res.status_code == 200
    summary = res.json()["summary"]
    assert summary["total_enrolled_st"] > 0
    assert summary["scholarship_beneficiaries"] > 0
    assert summary["potentially_eligible"] > 0
    print("[PASS] Coverage Gap Detection Analytics passed")

def test_admin_portal():
    res = client.get("/api/admin/stats")
    assert res.status_code == 200
    assert res.json()["overview"]["total_applications"] > 0
    print("[PASS] MoTA Official Admin Dashboard stats passed")

if __name__ == "__main__":
    test_health()
    token = test_auth_otp()
    test_schemes()
    test_eligibility_checker()
    test_conflict_detection(token)
    test_document_wallet_and_digilocker(token)
    test_seven_mock_verification_services()
    test_jago_chatbot(token)
    test_payments(token)
    test_coverage_gap_analytics()
    test_admin_portal()
    print("\n>>> ALL 11 BACKEND TEST SUITES PASSED FLAWLESSLY! <<<")
