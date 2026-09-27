# Ministry of Tribal Affairs (MoTA) — Unified ST Scholarship & Fellowship Platform

**Government of India | Smart India Hackathon (SIH) Prototype**

A unified, mobile-first digital platform for Scheduled Tribe (ST) students to discover, apply for, and track all five MoTA scholarship and fellowship schemes through a single student-centric interface, backed by an automated verification layer, DigiLocker wallet, JAGO AI chatbot, DBT payment tracking, and coverage-gap analytics.

---

## 🏛️ 5 MoTA Scholarship & Fellowship Schemes Covered

1. **Pre-Matric Scholarship for ST Students**: Centrally sponsored assistance for Class IX and X students.
2. **Post-Matric Scholarship for ST Students**: Comprehensive support for Class XI to Post-Graduate higher education.
3. **Top Class Education Scheme for ST Students**: Full tuition and allowances for ST students in 250+ notified premier institutes (IITs, IIMs, NITs, AIIMS).
4. **National Fellowship for ST Students (NFST)**: Monthly fellowship for regular M.Phil and Ph.D research candidates qualifying UGC/CSIR-NET JRF.
5. **National Overseas Scholarship (NOS)**: Financial coverage for Master's and Doctoral studies in top 500 QS-ranked foreign universities.

---

## 🚀 Key Features Implemented

- **Unified Dashboard**: All 5 schemes in one pane of glass showing Eligibility, Application Status, Verification Status, Sanctions, and DBT Disbursements.
- **Scheme Conflict Prevention Engine**: Strictly enforces the Ministry's rule preventing concurrent benefits across schemes, alerting students with actionable policy guidance.
- **7-Stage Transparent Timeline**: Visual stepper tracking *Submitted $\rightarrow$ Document Verification $\rightarrow$ Institute $\rightarrow$ State $\rightarrow$ Sanction $\rightarrow$ DBT Processing $\rightarrow$ Payment Completed*.
- **DigiLocker Document Wallet**: Stores verified caste certificates, PVTG certifications, marksheets, and income declarations with tamper-evident digital URIs.
- **Unified Verification Layer (7 Core Services)**: Simulated government gateways (`/verify/identity`, `/verify/st-certificate`, `/verify/income`, `/verify/education`, `/verify/institution`, `/verify/net-jrf`, `/verify/disability`) with **fail-safe routing to Manual Review Queue** on data mismatches.
- **JAGO AI Assistant**: Context-aware bilingual chatbot (English & हिन्दी) answering application progress, missing documents, and DBT dates, with simulated voice input.
- **DBT & PFMS Payment Tracker**: Displays ₹25,000 disbursement record, PFMS Txn ID, Bank UTR, and masked SBI bank account (`XXXXXXXX4291`).
- **Coverage Gap Detection Analytics**: Identifies ST students enrolled in educational institutes (UDISE+, APAAR, AISHE) not receiving scholarships, marking them as *"Potentially Eligible"* and scheduling targeted outreach camps.
- **MoTA Official Admin Portal**: Complete officer dashboard with review queues, gap analytics, and 1-click administrative actions.
- **Mobile Phone Frame Toggle**: Includes an interactive smartphone viewport switcher directly in the web UI for realistic hackathon presentations!

---

## 💻 Tech Stack

- **Backend**: Python 3.11 + FastAPI + SQLAlchemy ORM (SQLite zero-configuration default, drop-in PostgreSQL support).
- **Frontend**: React 18 + Vite + Tailwind CSS + Lucide Icons (PWA / Mobile-First with Phone Frame Toggle).
- **Mobile App Codebase**: Structured Flutter codebase in `flutter_mobile/`.
- **Authentication**: JWT token issuance + simulated OTP (`123456`).

---

## 🏃 Quick Start / How to Run Locally

### Option 1: One-Click Launcher (Windows)
Double-click:
```bat
run_all.bat
```
*(This starts both the FastAPI backend on port 8000 and the Vite frontend on port 5173).*

### Option 2: Manual Terminal Execution

#### 1. Start the Backend:
```bash
cd backend
python -m uvicorn app.main:app --port 8000 --reload
```
- API Base: `http://localhost:8000/api`
- Interactive OpenAPI Swagger Docs: `http://localhost:8000/docs`

#### 2. Run Backend Automated Test Suite:
```bash
cd backend
python test_api.py
```
*(Runs all 11 test suites covering Auth, 5 Schemes, Conflict Rules, 7 Verification APIs, JAGO AI, DBT Tracker, and Admin Portal).*

#### 3. Start the Frontend:
```bash
cd frontend
npm run dev
```
- Open browser at: `http://localhost:5173`

---

## 🔑 Demo Credentials

- **Demo Student (Default)**:
  - Phone: `9876543210`
  - Demo OTP: `123456`
  - Profile: Demo ST Student, MCA at Demo Government College, UP (Gond / Agariya PVTG)
  - Masked Aadhaar: `XXXX-XXXX-8921`
  - APAAR ID: `APAAR-2026-9812-4410`
- **MoTA Official / Admin**:
  - Email: `admin@mota.gov.in`
  - Password: `admin123`
  - Toggle directly using the **"Student View / MoTA Officer"** button in the top navbar.

---

## 📂 Project Directory Structure

```
mota_unified_scholarship/
├── backend/
│   ├── app/
│   │   ├── core/         # Config & JWT security
│   │   ├── db/           # Models, Session, and Rich Seed Data
│   │   ├── routers/      # Auth, Schemes, Applications, Wallet, Verify, DBT, JAGO, Gap Analytics, Admin
│   │   └── main.py       # FastAPI application gateway & CORS
│   ├── test_api.py       # Comprehensive 11-suite automated test suite
│   └── requirements.txt
│
├── frontend/             # Mobile-First Web Application (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/   # Navbar, BottomNav, DeviceFrame, DigiLockerModal, ConflictModal, DeficiencyModal
│   │   ├── pages/        # Dashboard, Schemes, Applications, Wallet, DBT, JAGO AI, Profile, Admin
│   │   └── services/     # API client with offline fallback resilience
│   └── package.json
│
├── flutter_mobile/       # Complete Flutter Mobile Codebase
│   ├── lib/              # Dart models, services, screens, main.dart
│   └── pubspec.yaml
│
├── docs/
│   ├── ARCHITECTURE.md       # High-level architecture with Mermaid diagrams
│   ├── DATABASE_ERD.md       # Entity-Relationship diagram & data dictionary
│   ├── API_DOCUMENTATION.md  # Detailed REST API specifications
│   ├── MOCK_GOV_SERVICES.md  # Mapping mock gateways to production MeitY/UIDAI/PFMS
│   └── SIH_DEMO_GUIDE.md     # 5-minute hackathon pitch & presentation script
│
├── run_backend.bat       # Windows launcher for backend
├── run_frontend.bat      # Windows launcher for frontend
├── run_all.bat           # Master one-click launcher
└── README.md
```

---

## 📖 Presentation Walkthrough Guide
Please see [`docs/SIH_DEMO_GUIDE.md`](./docs/SIH_DEMO_GUIDE.md) for the complete 5-minute stage presentation script with talking points for each feature!
