# Smart India Hackathon (SIH) 5-Minute Live Demo Script

Use this structured walkthrough to present the **Unified ST Scholarship & Fellowship Platform** to judges and evaluators.

---

## ⏱️ Minute 0:00 - 1:00: Problem & Unified Vision
1. **The Problem**: Currently, Scheduled Tribe (ST) students must navigate separate, disconnected portals for Pre-Matric, Post-Matric, Top Class, NFST, and National Overseas Scholarship (NOS). Incomplete applications and document loss lead to high dropouts and coverage gaps.
2. **The Solution**: MoTA's Unified Platform brings all 5 schemes into a **single, mobile-first experience** with automated verification, a DigiLocker wallet, DBT tracking, and JAGO AI.
3. **Show Mobile Viewport**: Point out the **Mobile Phone Frame** toggle in the top navbar simulating an iPhone/Android app shell.

---

## ⏱️ Minute 1:00 - 2:00: 5 Schemes Dashboard & Conflict Engine
1. **Open Dashboard**:
   - Show Demo Student profile: "Demo ST Student", MCA at Demo Government College, UP, Gond community, Particularly Vulnerable Tribal Group (PVTG: Agariya), APAAR ID `APAAR-2026-9812-4410`, Masked Aadhaar `XXXX-XXXX-8921`.
   - Point out all 5 MoTA schemes listed in one place:
     * Pre-Matric $\rightarrow$ Not Applicable
     * Post-Matric $\rightarrow$ Payment Completed (₹25,000)
     * Top Class $\rightarrow$ Deficiency Action Required
     * NFST $\rightarrow$ Not Applicable
     * NOS $\rightarrow$ Eligible
2. **Demonstrate Conflict Prevention**:
   - Go to **Schemes** tab.
   - Click **Apply Now** on *Top Class Scholarship* or *NOS*.
   - **Show the Conflict Warning Modal**:
     > *"You are currently receiving Post-Matric Scholarship. Please check the eligibility rules before applying for another scholarship."*
   - Explain how this enforces MoTA's policy preventing duplicate benefits while enabling smooth transitions.

---

## ⏱️ Minute 2:00 - 3:00: DigiLocker Wallet & 7-Stage Stepper
1. **Open Document Wallet**:
   - Show verified ST Certificate, PVTG Certificate, Marksheet, and Bonafide.
   - Click **"Fetch via DigiLocker"** $\rightarrow$ select *Income Certificate* $\rightarrow$ show live simulated OAuth connection, signature verification, and instant verified badge.
2. **Open Applications Tab**:
   - View the **7-Stage Timeline**:
     *Stage 1: Application Submitted* $\rightarrow$ *Stage 2: Document Verification* $\rightarrow$ *Stage 3: Institute* $\rightarrow$ *Stage 4: State* $\rightarrow$ *Stage 5: Sanction* $\rightarrow$ *Stage 6: DBT Processing* $\rightarrow$ *Stage 7: Payment Completed*.
   - Click **"Resolve Deficiency"** on Top Class application: upload renewed certificate $\rightarrow$ show status advance from *Deficiency* back to *Under Verification*.

---

## ⏱️ Minute 3:00 - 4:00: JAGO AI Assistant & DBT Tracking
1. **Switch to JAGO AI Tab**:
   - Click the quick prompts or type:
     - *"Where is my scholarship application?"*
     - *"What document is missing?"*
     - *"When will my scholarship payment arrive?"*
     - *"Am I eligible for Top Class Scholarship?"*
   - Switch language to **हिन्दी**:
     - Tap *"छात्रवृत्ति का पैसा कब आएगा?"* $\rightarrow$ JAGO speaks in Hindi with real DBT disbursement dates and UTR references!
   - Tap the **Microphone** icon to demonstrate simulated voice-to-text input.
2. **Switch to DBT Tab**:
   - Show ₹25,000 disbursement record, PFMS Txn ID `PFMS-MOTA-2026-98124`, Bank UTR `RBI20260815998124`, and masked State Bank of India account `XXXXXXXX4291`.

---

## ⏱️ Minute 4:00 - 5:00: MoTA Official Admin & Coverage Gap Detection
1. **Toggle Role**: Click **"Student View"** in the top bar to switch to **"MoTA Officer"** mode.
2. **Coverage Gap Analytics**:
   - Walk through the problem statement example:
     - **Total ST Students Enrolled (UDISE+ / AISHE):** 10,000
     - **Scholarship Beneficiaries:** 7,800
     - **Potentially Eligible (Coverage Gap):** 2,200
     - **Incomplete Applications:** 840
   - Show the district-wise table (Sonbhadra, Bastar, Mayurbhanj, Wayanad) and targeted outreach camp recommendations.
3. **Manual Review Queue**:
   - Show the queue of flagged applications.
   - Explain the core principle: *"If automated verification fails or data mismatches, route the case to manual review rather than automatically rejecting the student."*
   - Click **"Clear & Sanction"** or **"Request Deficiency"** with 1 click to show administrative workflow.

---

## 💡 Quick Q&A Answers for Evaluators
- **Q: How does this work without real Aadhaar or DigiLocker APIs?**
  *A: The system implements a dedicated Unified Verification Layer with 7 mock endpoints that mirror production JSON/XML responses. Flipping environment configuration flags allows instant binding to production CDAC and MeitY gateways.*
- **Q: How does it preserve privacy?**
  *A: All sensitive data (Aadhaar `XXXX-XXXX-8921` and Bank accounts `XXXXXXXX4291`) are masked at the API serialization level, complying with DPDP Act standards.*
