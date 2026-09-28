# Mock Government Services & Production Replacement Guide

During the prototype phase, real government API credentials (UIDAI, DigiLocker, UDISE+, APAAR, AISHE, State e-District, UGC/NTA, and PFMS) are simulated. This document details how each mock service is designed and how it can be plugged into real production government gateways.

---

## 1. Gateway Mapping Matrix

| National Service | Mock Endpoint | Production Integration Target | Authentication Method |
| :--- | :--- | :--- | :--- |
| **UIDAI** | `/api/verify/identity` | UIDAI Aadhaar e-KYC 2.5 XML API via CDAC ASA/KUA gateway | Signed XML + Aadhaar OTP / Biometric Auth |
| **DigiLocker** | `/api/documents/digilocker-pull` | DigiLocker National API Gateway (MeitY) | OAuth 2.0 PKCE + Student Consent Token |
| **State e-District** | `/api/verify/st-certificate` | State e-District Land & Revenue Services (e.g. edistrict.up.gov.in) | REST / SOAP with State Digital Signatures |
| **State Revenue** | `/api/verify/income` | Tehsildar Income Certificate Registry | State Gateway JSON API with HMAC Auth |
| **UDISE+** | `/api/verify/education` | Department of School Education, MoE | MoE API Gateway with API Key + Institute Code |
| **APAAR** | Embedded Identity | One Nation One Student ID Central Registry (ABC / Digilocker) | Academic Bank of Credits REST API |
| **AISHE** | `/api/verify/institution` | AISHE Portal, Ministry of Education | AISHE Institution Registry Query API |
| **UGC / NTA** | `/api/verify/net-jrf` | National Testing Agency Examination Portal | NTA Candidate Verification Endpoint |
| **PFMS / APBS** | `/api/payments/dbt-status` | Public Financial Management System & NPCI APBS Bridge | ISO 20022 XML / SFTP Batch Dispatch |

---

## 2. Production Transition Architecture

To transition from the current simulated layer to production:
1. **Config Toggle**: Set `MOCK_UIDAI_ENABLED=False` and supply `UIDAI_KUA_CLIENT_ID` and `PRIVATE_KEY_PEM`.
2. **Standard Interfaces**: The internal verification contract `VerificationResponse` (`status`, `confidence`, `source`, `remarks`, `routed_to_manual_queue`) remains identical, guaranteeing zero breaking changes to frontend clients when upstream government gateways are connected.
3. **Manual Review Safety Valve**: If real-world government APIs encounter server downtime or demographic mismatches (e.g. spelling variation between Aadhaar and Matriculation certificate), the application routes to the MoTA Officer Manual Review Queue rather than rejecting genuine tribal students.
