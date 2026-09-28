# REST API Documentation: MoTA Unified ST Scholarship Platform

Base URL: `http://localhost:8000/api`  
Interactive OpenAPI Swagger Docs: `http://localhost:8000/docs`

---

## 1. Authentication (`/auth`)

### `POST /auth/send-otp`
Generates and simulates dispatch of SMS OTP.
- **Request Body**:
  ```json
  { "mobile_or_email": "9876543210" }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Demo OTP sent to 9876543210. For evaluation use: 123456",
    "demo_otp": "123456",
    "expires_in_seconds": 300
  }
  ```

### `POST /auth/verify-otp`
Validates OTP and issues a signed JWT access token.
- **Request Body**:
  ```json
  { "mobile_or_email": "9876543210", "otp": "123456" }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "email": "demo.student@tribal.nic.in",
      "full_name": "Demo ST Student",
      "role": "student",
      "is_pvtg": true
    }
  }
  ```

---

## 2. Unified Schemes & Eligibility (`/scholarships`)

### `GET /scholarships`
Returns directory of all 5 MoTA schemes.

### `POST /scholarships/check-eligibility`
Evaluates candidate eligibility based on income, level, and premier institute admissions.
- **Request Body**:
  ```json
  {
    "scheme_code": "TOP_CLASS",
    "annual_income": 180000,
    "course_level": "Post Graduate",
    "has_premier_admission": true
  }
  ```
- **Response**:
  ```json
  {
    "scheme_code": "TOP_CLASS",
    "is_eligible": true,
    "status": "Eligible",
    "reasons": ["Student satisfies caste, income, and educational requirements."]
  }
  ```

---

## 3. Applications & Conflict Prevention (`/applications`)

### `POST /applications/check-conflict`
Intercepts dual-beneficiary violations under MoTA guidelines.
- **Request Body**:
  ```json
  { "scheme_code": "TOP_CLASS" }
  ```
- **Response**:
  ```json
  {
    "has_conflict": true,
    "conflict_scheme_name": "Post-Matric Scholarship for ST Students",
    "conflict_status": "Payment Completed",
    "warning_message": "You are currently receiving Post-Matric Scholarship. Please check eligibility rules before applying for another scholarship."
  }
  ```

### `GET /applications/{id}/timeline`
Fetches the complete 7-stage visual progress timeline.

### `POST /applications/{id}/resolve-deficiency`
Submits renewed certificate to advance from `Deficiency` $\rightarrow$ `Under Verification`.

---

## 4. Unified Verification Layer (`/verify`)

The 7 core verification endpoints simulating live government portals:
1. `POST /verify/identity` $\rightarrow$ UIDAI Aadhaar demographic verification
2. `POST /verify/st-certificate` $\rightarrow$ State e-District caste registry check
3. `POST /verify/income` $\rightarrow$ State Revenue department income & validity check
4. `POST /verify/education` $\rightarrow$ UDISE+ and Academic Bank of Credits check
5. `POST /verify/institution` $\rightarrow$ AISHE portal accreditation check
6. `POST /verify/net-jrf` $\rightarrow$ UGC / NTA examination score validation
7. `POST /verify/disability` $\rightarrow$ UDID central portal check

- **Standard Response**:
  ```json
  {
    "status": "Verified | Invalid | Mismatch | Pending | Manual Review",
    "confidence": 0.98,
    "source": "State e-District Portal (MOCK / SIMULATED)",
    "remarks": "Valid ST Certificate found in State Revenue repository.",
    "routed_to_manual_queue": false,
    "verified_at": "27 Sep 2026, 04:15 PM"
  }
  ```

---

## 5. JAGO AI Chatbot (`/chatbot`)

### `POST /chatbot/query`
- **Request Body**:
  ```json
  {
    "query": "Where is my scholarship application?",
    "language": "en"
  }
  ```
- **Response**:
  ```json
  {
    "query": "Where is my scholarship application?",
    "language": "en",
    "response": "Hello Demo ST Student, your application for Top Class Scholarship (MOTA-TC-2026-90412) is currently at Stage 2: Document Verification with a status of Deficiency Action Required...",
    "suggested_actions": ["Upload Renewed Income Certificate", "Check Application Timeline"],
    "timestamp": "04:15 PM"
  }
  ```

---

## 6. Coverage Gap Analytics (`/analytics`)

### `GET /analytics/coverage-gap`
Cross-references UDISE+, APAAR and MoTA beneficiary databases.
- **Response**:
  ```json
  {
    "summary": {
      "total_enrolled_st": 10000,
      "scholarship_beneficiaries": 7800,
      "potentially_eligible": 2200,
      "incomplete_applications": 840,
      "coverage_percentage": 78.0
    },
    "districts": [ ... ]
  }
  ```
