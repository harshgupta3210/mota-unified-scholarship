from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.db.models import (
    User, StudentProfile, ScholarshipScheme, Application, 
    ApplicationTimeline, Document, PaymentRecord, Notification, 
    CoverageGapMetric, VerificationLog
)

def init_db(db: Session):
    # Check if already seeded
    if db.query(User).first():
        return

    # 1. Create Users (Demo Student and MoTA Official / Admin)
    student_user = User(
        email="demo.student@tribal.nic.in",
        phone="9876543210",
        hashed_password=hash_password("student123"),
        role="student",
        is_active=True
    )
    admin_user = User(
        email="admin@mota.gov.in",
        phone="9999900001",
        hashed_password=hash_password("admin123"),
        role="admin",
        is_active=True
    )
    db.add(student_user)
    db.add(admin_user)
    db.flush()

    # 2. Create Student Profile
    profile = StudentProfile(
        user_id=student_user.id,
        full_name="Demo ST Student",
        dob="2002-04-12",
        gender="Male",
        state="Uttar Pradesh",
        district="Sonbhadra",
        st_category="Scheduled Tribe (ST)",
        st_subcaste="Gond",
        is_pvtg=True,
        pvtg_community="Agariya",
        institution_name="Demo Government College",
        institution_state="Uttar Pradesh",
        aishe_code="C-48192",
        course_name="Master of Computer Applications (MCA)",
        course_level="Post Graduate",
        academic_year="2026-27",
        apaar_id="APAAR-2026-9812-4410",
        aadhaar_masked="XXXX-XXXX-8921",
        is_aadhaar_verified=True,
        is_st_verified=True,
        is_income_verified=True,
        annual_family_income=180000.0,
        bank_name="State Bank of India",
        bank_account_masked="XXXXXXXX4291",
        ifsc_code="SBIN0001245",
        is_dbt_enabled=True
    )
    db.add(profile)
    db.flush()

    # 3. Create the 5 MoTA Scholarship & Fellowship Schemes
    schemes = [
        ScholarshipScheme(
            code="PRE_MATRIC",
            name="Pre-Matric Scholarship for ST Students",
            name_hi="अनुसूचित जनजाति के छात्रों के लिए प्री-मैट्रिक छात्रवृत्ति",
            level="Secondary (Class IX - X)",
            description="Centrally sponsored scheme for ST students studying in classes IX and X to reduce dropout rates and support transitions to secondary school.",
            description_hi="कक्षा 9 और 10 में पढ़ने वाले एसटी छात्रों के लिए केंद्र प्रायोजित छात्रवृत्ति योजना।",
            max_amount=4000.0,
            max_amount_display="₹3,500 - ₹4,000 / year",
            income_limit=250000.0,
            income_limit_display="₹2.5 Lakh / year",
            eligibility_criteria="ST students studying in classes IX or X in Government or recognized schools. Annual family income <= ₹2.50 Lakhs.",
            required_documents="ST Certificate, Income Certificate, School Bonafide, Marksheet",
            important_dates="Closing: 31 Oct 2026"
        ),
        ScholarshipScheme(
            code="POST_MATRIC",
            name="Post-Matric Scholarship for ST Students",
            name_hi="अनुसूचित जनजाति के छात्रों के लिए पोस्ट-मैट्रिक छात्रवृत्ति",
            level="Higher Secondary to Post-Graduate",
            description="Supports Scheduled Tribe students pursuing recognized post-matriculation or post-secondary courses across Universities and Colleges in India.",
            description_hi="कक्षा 11 से लेकर स्नातकोत्तर तक की पढ़ाई के लिए वित्तीय सहायता।",
            max_amount=25000.0,
            max_amount_display="₹25,000 / year",
            income_limit=250000.0,
            income_limit_display="₹2.5 Lakh / year",
            eligibility_criteria="ST students enrolled in post-matric/higher education. Parents' total income does not exceed ₹2.50 Lakhs per annum.",
            required_documents="ST Certificate, Income Certificate, Previous Exam Marksheet, College Bonafide, Fee Receipt",
            important_dates="Disbursement Ongoing (Cycle 2026-27)"
        ),
        ScholarshipScheme(
            code="TOP_CLASS",
            name="Top Class Education Scheme for ST Students",
            name_hi="एसटी छात्रों के लिए शीर्ष श्रेणी शिक्षा छात्रवृत्ति",
            level="Degree/PG in Notified Premier Institutes",
            description="Full financial assistance to meritorious ST students pursuing graduate and post-graduate studies in 250+ notified premier institutes (IITs, IIMs, NITs, AIIMS, NLUs).",
            description_hi="आईआईटी, आईआईएम, एनआईटी जैसे शीर्ष राष्ट्रीय संस्थानों में पढ़ने वाले एसटी छात्रों के लिए पूर्ण वित्तीय सहायता।",
            max_amount=200000.0,
            max_amount_display="Full Tuition + ₹86,000 Allowances",
            income_limit=600000.0,
            income_limit_display="₹6.0 Lakh / year",
            eligibility_criteria="ST students admitted to notified premier institutes through competitive exams. Parental income <= ₹6.00 Lakhs per annum.",
            required_documents="Admission Letter/Rank Card, Premier Institute Fee Structure, ST Certificate, Updated Income Certificate",
            important_dates="Deficiency Rectification: 15 Oct 2026"
        ),
        ScholarshipScheme(
            code="NFST",
            name="National Fellowship for ST Students (NFST)",
            name_hi="एसटी छात्रों के लिए राष्ट्रीय फैलोशिप (NFST)",
            level="M.Phil / Ph.D Research",
            description="Fellowships for ST candidates qualifying UGC-NET / CSIR-NET to undertake higher research leading to M.Phil and Ph.D degrees.",
            description_hi="एम.फिल और पीएचडी शोध कार्य करने वाले योग्य एसटी शोधार्थियों के लिए मासिक फैलोशिप।",
            max_amount=420000.0,
            max_amount_display="₹35,000 - ₹39,000 / month + Contingency",
            income_limit=None,
            income_limit_display="No Income Ceiling (Merit Based)",
            eligibility_criteria="ST candidates who have passed Post Graduate exam and registered for regular M.Phil/Ph.D in recognized Indian universities.",
            required_documents="NET/JRF Scorecard, Ph.D Registration Certificate, Research Synopsis, Guide Recommendation",
            important_dates="Application Opens: Nov 2026"
        ),
        ScholarshipScheme(
            code="NOS",
            name="National Overseas Scholarship for ST Students",
            name_hi="एसटी छात्रों के लिए राष्ट्रीय प्रवासी छात्रवृत्ति (NOS)",
            level="Post-Graduate / Ph.D Abroad",
            description="Provides financial support to ST students for pursuing Master's and Doctoral studies in top-500 QS/Times Higher Education ranked foreign universities.",
            description_hi="शीर्ष 500 विदेशी विश्वविद्यालयों में मास्टर्स और पीएचडी की पढ़ाई के लिए पूर्ण छात्रवृत्ति।",
            max_amount=2500000.0,
            max_amount_display="Full Tuition + $15,400 / £9,900 Annual Allowance",
            income_limit=600000.0,
            income_limit_display="₹6.0 Lakh / year",
            eligibility_criteria="ST students with minimum 55% in qualifying degree, unconditional offer letter from top 500 QS ranked university abroad. Income <= ₹6.0 Lakhs.",
            required_documents="Passport, Unconditional Foreign University Offer Letter, GRE/IELTS Scorecard, ST Certificate, Income Tax Return",
            important_dates="Closing: 31 October 2026"
        )
    ]
    for s in schemes:
        db.add(s)
    db.flush()

    # Cache scheme ids
    post_matric = db.query(ScholarshipScheme).filter_by(code="POST_MATRIC").first()
    top_class = db.query(ScholarshipScheme).filter_by(code="TOP_CLASS").first()

    # 4. Create Demo Applications
    # Application 1: Post-Matric (Status: Payment Completed, Stage 7/7)
    app_post = Application(
        application_number="MOTA-PM-2026-78192",
        student_id=profile.id,
        scheme_id=post_matric.id,
        academic_year="2026-27",
        status="Payment Completed",
        eligibility_status="Eligible",
        verification_status="Verified",
        sanction_status="Sanctioned",
        disbursement_status="Payment Completed",
        current_stage=7,
        current_stage_name="Payment Completed",
        sanction_amount=25000.0,
        sanction_order_no="MOTA/ED/2026/PM/8912",
        applied_date=datetime.utcnow() - timedelta(days=45)
    )
    db.add(app_post)
    db.flush()

    # Timelines for Post-Matric
    stages = [
        (1, "Application Submitted", "आवेदन जमा किया गया", "completed", "Application submitted online via Unified Portal", datetime.utcnow() - timedelta(days=45)),
        (2, "Document Verification", "दस्तावेज़ सत्यापन", "completed", "Automated verification completed via DigiLocker & State e-District", datetime.utcnow() - timedelta(days=40)),
        (3, "Institute Verification", "संस्थान सत्यापन", "completed", "Verified by Demo Government College Nodal Officer", datetime.utcnow() - timedelta(days=32)),
        (4, "State/Authority Verification", "राज्य/प्राधिकरण सत्यापन", "completed", "Approved by State Tribal Welfare Directorate, UP", datetime.utcnow() - timedelta(days=22)),
        (5, "Sanction Approved", "स्वीकृति आदेश जारी", "completed", "Sanction Order #MOTA/ED/2026/PM/8912 issued for ₹25,000", datetime.utcnow() - timedelta(days=14)),
        (6, "DBT Processing", "डीबीटी प्रसंस्करण", "completed", "Payment file processed through PFMS & NPCI Aadhaar Bridge", datetime.utcnow() - timedelta(days=7)),
        (7, "Payment Completed", "भुगतान संपन्न", "completed", "₹25,000 credited to SBI A/C XXXXXXXX4291 via DBT", datetime.utcnow() - timedelta(days=3))
    ]
    for num, name, name_hi, st, desc, dt in stages:
        tl = ApplicationTimeline(
            application_id=app_post.id,
            stage_number=num,
            stage_name=name,
            stage_name_hi=name_hi,
            status=st,
            description=desc,
            completed_at=dt
        )
        db.add(tl)

    # Payment Record for Post-Matric
    pmt = PaymentRecord(
        application_id=app_post.id,
        student_id=profile.id,
        installment_no=1,
        amount=25000.0,
        payment_date="15 August 2026",
        dbt_status="Payment Completed",
        pfms_txn_id="PFMS-MOTA-2026-98124",
        utr_no="RBI20260815998124",
        bank_name="State Bank of India",
        bank_account_masked="XXXXXXXX4291",
        academic_year="2026-27"
    )
    db.add(pmt)

    # Application 2: Top Class Education (Status: Deficiency, Stage 2)
    app_top = Application(
        application_number="MOTA-TC-2026-90412",
        student_id=profile.id,
        scheme_id=top_class.id,
        academic_year="2026-27",
        status="Deficiency",
        eligibility_status="Eligible",
        verification_status="Mismatch",
        sanction_status="Pending",
        disbursement_status="Pending",
        current_stage=2,
        current_stage_name="Document Verification",
        deficiency_field="Income Certificate",
        deficiency_remarks="Income certificate issued date is older than 1 year (expired 31-March-2026). Please upload renewed certificate from Tehsildar.",
        applied_date=datetime.utcnow() - timedelta(days=12)
    )
    db.add(app_top)
    db.flush()

    tc_stages = [
        (1, "Application Submitted", "आवेदन जमा किया गया", "completed", "Application submitted online with admission ranking", datetime.utcnow() - timedelta(days=12)),
        (2, "Document Verification", "दस्तावेज़ सत्यापन", "deficiency", "Income certificate validity mismatch detected. Action required.", datetime.utcnow() - timedelta(days=8)),
        (3, "Institute Verification", "संस्थान सत्यापन", "pending", "Awaiting document deficiency resolution", None),
        (4, "State/Authority Verification", "राज्य/प्राधिकरण सत्यापन", "pending", "Pending Institute clearance", None),
        (5, "Sanction", "स्वीकृति", "pending", "Pending administrative approvals", None),
        (6, "DBT Processing", "डीबीटी प्रसंस्करण", "pending", "Pending sanction approval", None),
        (7, "Payment Completed", "भुगतान संपन्न", "pending", "Scheduled after DBT processing", None)
    ]
    for num, name, name_hi, st, desc, dt in tc_stages:
        tl = ApplicationTimeline(
            application_id=app_top.id,
            stage_number=num,
            stage_name=name,
            stage_name_hi=name_hi,
            status=st,
            description=desc,
            completed_at=dt
        )
        db.add(tl)

    # 5. Digital Document Wallet Seed Data
    docs = [
        Document(
            student_id=profile.id,
            doc_type="ST Certificate",
            doc_name="Scheduled Tribe Community Certificate",
            doc_number="UP/SBD/ST/2023/88910",
            source="DigiLocker",
            digilocker_uri="in.gov.edistrict.up.caste:88910",
            verification_status="Verified",
            verification_source="State e-District (Uttar Pradesh)",
            confidence_score=1.0,
            remarks="Legitimate ST certificate issued by Tehsildar Robertsganj, Sonbhadra.",
            issued_date="14 May 2023"
        ),
        Document(
            student_id=profile.id,
            doc_type="PVTG Certificate",
            doc_name="Particularly Vulnerable Tribal Group (PVTG) Certificate",
            doc_number="PVTG/UP/SBD/2024/041",
            source="DigiLocker",
            digilocker_uri="in.gov.mota.pvtg:041",
            verification_status="Verified",
            verification_source="District Tribal Welfare Officer",
            confidence_score=1.0,
            remarks="Verified PVTG Agariya community member.",
            issued_date="20 Jan 2024"
        ),
        Document(
            student_id=profile.id,
            doc_type="Income Certificate",
            doc_name="Annual Family Income Certificate",
            doc_number="INC/UP/2025/11928",
            source="Direct Upload",
            digilocker_uri=None,
            verification_status="Mismatch",
            verification_source="State Revenue Dept",
            confidence_score=0.45,
            remarks="Certificate validity expired on 31-March-2026. Renewal document required.",
            issued_date="15 Feb 2025"
        ),
        Document(
            student_id=profile.id,
            doc_type="Marksheets",
            doc_name="B.Sc Computer Science Final Degree Marksheet",
            doc_number="MARKS/AKTU/2025/99812",
            source="DigiLocker",
            digilocker_uri="in.gov.aktu.marksheet:99812",
            verification_status="Verified",
            verification_source="ABC / DigiLocker NAD",
            confidence_score=1.0,
            remarks="Grade: 78.4% First Class with Distinction.",
            issued_date="28 June 2025"
        ),
        Document(
            student_id=profile.id,
            doc_type="Institution Certificate",
            doc_name="College Bonafide & Fee Structure Certificate",
            doc_number="BONA/DGIT/2026/301",
            source="Direct Upload",
            digilocker_uri=None,
            verification_status="Verified",
            verification_source="AISHE Institution Registry",
            confidence_score=0.96,
            remarks="Enrolled in MCA Year 1 (Academic Year 2026-27).",
            issued_date="10 July 2026"
        ),
        Document(
            student_id=profile.id,
            doc_type="Identity Documents",
            doc_name="Aadhaar e-KYC Verification Certificate",
            doc_number="UIDAI-MOCK-8921",
            source="DigiLocker",
            digilocker_uri="in.gov.uidai:XXXX-XXXX-8921",
            verification_status="Verified",
            verification_source="UIDAI Central Mock e-KYC",
            confidence_score=1.0,
            remarks="Demographics matched 100% with registered student name.",
            issued_date="01 Aug 2026"
        )
    ]
    for d in docs:
        db.add(d)

    # 6. Verification Logs Seed
    vlogs = [
        VerificationLog(
            application_id=app_post.id,
            verification_type="identity",
            source_service="UIDAI Aadhaar e-KYC",
            input_identifier="XXXX-XXXX-8921",
            status="Verified",
            confidence=1.0,
            remarks="Aadhaar demographics match: Name, DOB, Gender, Mobile OTP validated."
        ),
        VerificationLog(
            application_id=app_post.id,
            verification_type="st-certificate",
            source_service="State e-District UP",
            input_identifier="UP/SBD/ST/2023/88910",
            status="Verified",
            confidence=1.0,
            remarks="Valid ST Caste Certificate for Gond subcaste found in State Revenue repository."
        ),
        VerificationLog(
            application_id=app_top.id,
            verification_type="income",
            source_service="State Revenue Portal",
            input_identifier="INC/UP/2025/11928",
            status="Mismatch",
            confidence=0.45,
            remarks="Certificate issue date (15-Feb-2025) exceeds 12-month validity window.",
            routed_to_manual_queue=True
        ),
        VerificationLog(
            application_id=app_post.id,
            verification_type="institution",
            source_service="AISHE Portal",
            input_identifier="C-48192",
            status="Verified",
            confidence=0.98,
            remarks="AISHE Code C-48192 is active and accredited for Post-Matric schemes."
        )
    ]
    for v in vlogs:
        db.add(v)

    # 7. Notifications Seed
    notifs = [
        Notification(
            user_id=student_user.id,
            title="Scholarship Disbursed: ₹25,000",
            title_hi="छात्रवृत्ति वितरित: ₹25,000",
            message="Your scholarship payment of ₹25,000 for Post-Matric Scholarship has been successfully credited to your SBI account via DBT.",
            message_hi="पोस्ट-मैट्रिक छात्रवृत्ति के ₹25,000 की राशि आपके एसबीआई खाते में डीबीटी द्वारा सफलतापूर्वक जमा कर दी गई है।",
            type="payment",
            is_read=False,
            created_at=datetime.utcnow() - timedelta(days=3)
        ),
        Notification(
            user_id=student_user.id,
            title="Action Required: Income Certificate Deficiency",
            title_hi="कार्रवाई आवश्यक: आय प्रमाण पत्र त्रुटि",
            message="Your Top Class Scholarship application requires a renewed Income Certificate. Please upload the latest document in your wallet.",
            message_hi="आपके टॉप क्लास छात्रवृत्ति आवेदन में नवीनीकृत आय प्रमाण पत्र की आवश्यकता है। कृपया इसे अपडेट करें।",
            type="deficiency",
            is_read=False,
            created_at=datetime.utcnow() - timedelta(days=8)
        ),
        Notification(
            user_id=student_user.id,
            title="DigiLocker Verification Successful",
            title_hi="डिजिलॉकर सत्यापन सफल",
            message="Your ST Community Certificate has been verified digitally with State e-District portal.",
            message_hi="आपका एसटी समुदाय प्रमाण पत्र राज्य ई-डिस्ट्रिक्ट पोर्टल के माध्यम से डिजिटल रूप से सत्यापित हो गया है।",
            type="verification",
            is_read=True,
            created_at=datetime.utcnow() - timedelta(days=20)
        ),
        Notification(
            user_id=student_user.id,
            title="Upcoming Deadline: NOS 2026-27",
            title_hi="आगामी समय सीमा: एनओएस 2026-27",
            message="National Overseas Scholarship (NOS) window for Fall 2027 admissions closes on 31 October 2026.",
            message_hi="राष्ट्रीय प्रवासी छात्रवृत्ति (एनओएस) के लिए आवेदन 31 अक्टूबर 2026 को बंद हो रहे हैं।",
            type="deadline",
            is_read=True,
            created_at=datetime.utcnow() - timedelta(days=25)
        )
    ]
    for n in notifs:
        db.add(n)

    # 8. Coverage Gap Analytics Seed Data (UDISE+, APAAR, OTR mock cross-referencing)
    gaps = [
        CoverageGapMetric(
            state="Uttar Pradesh",
            district="Sonbhadra",
            total_enrolled_st=10000,
            scholarship_beneficiaries=7800,
            potentially_eligible=2200,
            incomplete_applications=840,
            outreach_priority="High",
            synced_source="UDISE+ & APAAR Integration"
        ),
        CoverageGapMetric(
            state="Chhattisgarh",
            district="Bastar",
            total_enrolled_st=14500,
            scholarship_beneficiaries=11200,
            potentially_eligible=3300,
            incomplete_applications=1120,
            outreach_priority="High",
            synced_source="UDISE+ & APAAR Integration"
        ),
        CoverageGapMetric(
            state="Odisha",
            district="Mayurbhanj",
            total_enrolled_st=18200,
            scholarship_beneficiaries=15100,
            potentially_eligible=3100,
            incomplete_applications=950,
            outreach_priority="High",
            synced_source="UDISE+ & APAAR Integration"
        ),
        CoverageGapMetric(
            state="Jharkhand",
            district="Ranchi",
            total_enrolled_st=16800,
            scholarship_beneficiaries=13400,
            potentially_eligible=3400,
            incomplete_applications=1200,
            outreach_priority="High",
            synced_source="UDISE+ & APAAR Integration"
        ),
        CoverageGapMetric(
            state="Kerala",
            district="Wayanad",
            total_enrolled_st=6400,
            scholarship_beneficiaries=5600,
            potentially_eligible=800,
            incomplete_applications=210,
            outreach_priority="Medium",
            synced_source="UDISE+ & APAAR Integration"
        ),
        CoverageGapMetric(
            state="Gujarat",
            district="Dahod",
            total_enrolled_st=12000,
            scholarship_beneficiaries=9800,
            potentially_eligible=2200,
            incomplete_applications=680,
            outreach_priority="Medium",
            synced_source="UDISE+ & APAAR Integration"
        ),
        CoverageGapMetric(
            state="Madhya Pradesh",
            district="Khargone",
            total_enrolled_st=11500,
            scholarship_beneficiaries=9200,
            potentially_eligible=2300,
            incomplete_applications=710,
            outreach_priority="Medium",
            synced_source="UDISE+ & APAAR Integration"
        ),
        CoverageGapMetric(
            state="Maharashtra",
            district="Gadchiroli",
            total_enrolled_st=8900,
            scholarship_beneficiaries=7100,
            potentially_eligible=1800,
            incomplete_applications=490,
            outreach_priority="Medium",
            synced_source="UDISE+ & APAAR Integration"
        )
    ]
    for g in gaps:
        db.add(g)

    db.commit()
