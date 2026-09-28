export const INITIAL_STUDENT_PROFILE = {
  id: 1,
  full_name: "Demo ST Student",
  dob: "2002-04-12",
  gender: "Male",
  state: "Uttar Pradesh",
  district: "Sonbhadra",
  st_category: "Scheduled Tribe (ST)",
  st_subcaste: "Gond",
  is_pvtg: true,
  pvtg_community: "Agariya",
  institution_name: "Demo Government College",
  institution_state: "Uttar Pradesh",
  aishe_code: "C-48192",
  course_name: "Master of Computer Applications (MCA)",
  course_level: "Post Graduate",
  academic_year: "2026-27",
  apaar_id: "APAAR-2026-9812-4410",
  aadhaar_masked: "XXXX-XXXX-8921",
  is_aadhaar_verified: true,
  is_st_verified: true,
  is_income_verified: true,
  annual_family_income: 180000.0,
  bank_name: "State Bank of India",
  bank_account_masked: "XXXXXXXX4291",
  ifsc_code: "SBIN0001245",
  is_dbt_enabled: true
};

export const INITIAL_SCHEMES = [
  {
    id: 1,
    code: "PRE_MATRIC",
    name: "Pre-Matric Scholarship for ST Students",
    name_hi: "अनुसूचित जनजाति के छात्रों के लिए प्री-मैट्रिक छात्रवृत्ति",
    level: "Secondary (Class IX - X)",
    description: "Centrally sponsored scheme for ST students in classes IX and X to reduce dropouts.",
    description_hi: "कक्षा 9 और 10 में पढ़ने वाले एसटी छात्रों के लिए छात्रवृत्ति।",
    max_amount_display: "₹3,500 - ₹4,000 / year",
    income_limit_display: "₹2.5 Lakh / year",
    eligibility_criteria: "ST students studying in classes IX or X in Government schools. Parental income <= ₹2.50 Lakhs.",
    required_documents: ["ST Certificate", "Income Certificate", "School Bonafide", "Marksheet"],
    important_dates: "Closing: 31 Oct 2026"
  },
  {
    id: 2,
    code: "POST_MATRIC",
    name: "Post-Matric Scholarship for ST Students",
    name_hi: "अनुसूचित जनजाति के छात्रों के लिए पोस्ट-मैट्रिक छात्रवृत्ति",
    level: "Higher Secondary to Post-Graduate",
    description: "Comprehensive financial support for ST students pursuing recognized post-matriculation or university courses.",
    description_hi: "कक्षा 11 से लेकर स्नातकोत्तर तक की पढ़ाई के लिए वित्तीय सहायता।",
    max_amount_display: "₹25,000 / year",
    income_limit_display: "₹2.5 Lakh / year",
    eligibility_criteria: "ST students enrolled in higher education with parental income <= ₹2.50 Lakhs.",
    required_documents: ["ST Certificate", "Income Certificate", "Previous Exam Marksheet", "College Bonafide", "Fee Receipt"],
    important_dates: "Disbursement Ongoing (Cycle 2026-27)"
  },
  {
    id: 3,
    code: "TOP_CLASS",
    name: "Top Class Education Scheme for ST Students",
    name_hi: "एसटी छात्रों के लिए शीर्ष श्रेणी शिक्षा छात्रवृत्ति",
    level: "Degree/PG in Notified Premier Institutes",
    description: "Full tuition assistance + living allowances for ST students in 250+ notified premier institutes (IITs, IIMs, NITs, AIIMS).",
    description_hi: "शीर्ष राष्ट्रीय संस्थानों में अध्ययनरत एसटी छात्रों के लिए पूर्ण वित्तीय सहायता।",
    max_amount_display: "Full Tuition + ₹86,000 Allowances",
    income_limit_display: "₹6.0 Lakh / year",
    eligibility_criteria: "ST students admitted to notified premier institutes through competitive exams. Income <= ₹6.00 Lakhs.",
    required_documents: ["Admission Letter/Rank Card", "Premier Institute Fee Structure", "ST Certificate", "Renewed Income Certificate"],
    important_dates: "Deficiency Rectification: 15 Oct 2026"
  },
  {
    id: 4,
    code: "NFST",
    name: "National Fellowship for ST Students (NFST)",
    name_hi: "एसटी छात्रों के लिए राष्ट्रीय फैलोशिप (NFST)",
    level: "M.Phil / Ph.D Research",
    description: "Monthly fellowship for ST researchers qualifying UGC-NET / CSIR-NET to undertake higher research degrees.",
    description_hi: "एम.फिल और पीएचडी शोधार्थियों के लिए मासिक फैलोशिप।",
    max_amount_display: "₹35,000 - ₹39,000 / month + Contingency",
    income_limit_display: "No Income Ceiling (Merit Based)",
    eligibility_criteria: "ST candidates registered for regular M.Phil/Ph.D with UGC/CSIR-NET JRF.",
    required_documents: ["NET/JRF Scorecard", "Ph.D Registration Certificate", "Research Synopsis", "Guide Recommendation"],
    important_dates: "Application Opens: Nov 2026"
  },
  {
    id: 5,
    code: "NOS",
    name: "National Overseas Scholarship for ST Students",
    name_hi: "एसटी छात्रों के लिए राष्ट्रीय प्रवासी छात्रवृत्ति (NOS)",
    level: "Post-Graduate / Ph.D Abroad",
    description: "Financial coverage for Master's and Doctoral studies in top 500 QS-ranked universities abroad.",
    description_hi: "शीर्ष 500 विदेशी विश्वविद्यालयों में मास्टर्स और पीएचडी की पढ़ाई के लिए छात्रवृत्ति।",
    max_amount_display: "Full Tuition + $15,400 / £9,900 Annual Allowance",
    income_limit_display: "₹6.0 Lakh / year",
    eligibility_criteria: "ST students with >= 55% in qualifying degree, unconditional offer from top 500 QS university abroad. Income <= ₹6.0L.",
    required_documents: ["Passport", "Unconditional Foreign Offer Letter", "GRE/IELTS Scorecard", "ST Certificate", "ITR"],
    important_dates: "Closing: 31 October 2026"
  }
];

export const INITIAL_APPLICATIONS = [
  {
    id: 1,
    scheme_id: 2,
    scheme_code: "POST_MATRIC",
    scheme_name: "Post-Matric Scholarship for ST Students",
    scheme_name_hi: "अनुसूचित जनजाति के छात्रों के लिए पोस्ट-मैट्रिक छात्रवृत्ति",
    application_number: "MOTA-PM-2026-78192",
    eligibility_status: "Eligible",
    application_status: "Payment Completed",
    verification_status: "Verified",
    sanction_status: "Sanctioned",
    disbursement_status: "Payment Completed",
    current_stage: 7,
    current_stage_name: "Payment Completed",
    deficiency_remarks: null,
    deficiency_field: null,
    sanction_amount: 25000.0,
    important_dates: "Disbursement Ongoing (Cycle 2026-27)",
    has_active_application: true,
    stages: [
      { stage_number: 1, stage_name: "Application Submitted", stage_name_hi: "आवेदन जमा किया गया", status: "completed", description: "Application submitted online via Unified Portal", completed_at: "15 Jul 2026, 11:30 AM" },
      { stage_number: 2, stage_name: "Document Verification", stage_name_hi: "दस्तावेज़ सत्यापन", status: "completed", description: "Automated verification completed via DigiLocker & State e-District", completed_at: "20 Jul 2026, 04:15 PM" },
      { stage_number: 3, stage_name: "Institute Verification", stage_name_hi: "संस्थान सत्यापन", status: "completed", description: "Verified by Demo Government College Nodal Officer", completed_at: "28 Jul 2026, 02:40 PM" },
      { stage_number: 4, stage_name: "State/Authority Verification", stage_name_hi: "राज्य/प्राधिकरण सत्यापन", status: "completed", description: "Approved by State Tribal Welfare Directorate, UP", completed_at: "06 Aug 2026, 05:10 PM" },
      { stage_number: 5, stage_name: "Sanction", stage_name_hi: "स्वीकृति", status: "completed", description: "Sanction Order #MOTA/ED/2026/PM/8912 issued for ₹25,000", completed_at: "10 Aug 2026, 10:20 AM" },
      { stage_number: 6, stage_name: "DBT Processing", stage_name_hi: "डीबीटी प्रसंस्करण", status: "completed", description: "Payment file processed through PFMS & NPCI Aadhaar Bridge", completed_at: "13 Aug 2026, 03:00 PM" },
      { stage_number: 7, stage_name: "Payment Completed", stage_name_hi: "भुगतान संपन्न", status: "completed", description: "₹25,000 credited to SBI A/C XXXXXXXX4291 via DBT", completed_at: "15 Aug 2026, 09:45 AM" }
    ]
  },
  {
    id: 2,
    scheme_id: 3,
    scheme_code: "TOP_CLASS",
    scheme_name: "Top Class Education Scheme for ST Students",
    scheme_name_hi: "एसटी छात्रों के लिए शीर्ष श्रेणी शिक्षा छात्रवृत्ति",
    application_number: "MOTA-TC-2026-90412",
    eligibility_status: "Eligible",
    application_status: "Deficiency",
    verification_status: "Mismatch",
    sanction_status: "Pending",
    disbursement_status: "Pending",
    current_stage: 2,
    current_stage_name: "Document Verification",
    deficiency_field: "Income Certificate",
    deficiency_remarks: "Income certificate submitted expired on 31-March-2026. Please upload renewal certificate.",
    sanction_amount: 0.0,
    important_dates: "Deficiency Rectification: 15 Oct 2026",
    has_active_application: true,
    stages: [
      { stage_number: 1, stage_name: "Application Submitted", stage_name_hi: "आवेदन जमा किया गया", status: "completed", description: "Application submitted online with admission ranking", completed_at: "15 Sep 2026, 09:12 AM" },
      { stage_number: 2, stage_name: "Document Verification", stage_name_hi: "दस्तावेज़ सत्यापन", status: "deficiency", description: "Income certificate validity mismatch detected. Action required.", completed_at: null },
      { stage_number: 3, stage_name: "Institute Verification", stage_name_hi: "संस्थान सत्यापन", status: "pending", description: "Awaiting document deficiency resolution", completed_at: null },
      { stage_number: 4, stage_name: "State/Authority Verification", stage_name_hi: "राज्य/प्राधिकरण सत्यापन", status: "pending", description: "Pending Institute clearance", completed_at: null },
      { stage_number: 5, stage_name: "Sanction", stage_name_hi: "स्वीकृति", status: "pending", description: "Pending administrative approvals", completed_at: null },
      { stage_number: 6, stage_name: "DBT Processing", stage_name_hi: "डीबीटी प्रसंस्करण", status: "pending", description: "Pending sanction approval", completed_at: null },
      { stage_number: 7, stage_name: "Payment Completed", stage_name_hi: "भुगतान संपन्न", status: "pending", description: "Scheduled after DBT processing", completed_at: null }
    ]
  },
  {
    id: null,
    scheme_id: 1,
    scheme_code: "PRE_MATRIC",
    scheme_name: "Pre-Matric Scholarship for ST Students",
    scheme_name_hi: "अनुसूचित जनजाति के छात्रों के लिए प्री-मैट्रिक छात्रवृत्ति",
    application_number: null,
    eligibility_status: "Not Applicable",
    application_status: "Not Applicable",
    verification_status: "Not Started",
    sanction_status: "N/A",
    disbursement_status: "N/A",
    current_stage: 0,
    current_stage_name: "Not Applicable",
    deficiency_remarks: null,
    deficiency_field: null,
    sanction_amount: 0.0,
    important_dates: "Closing: 31 Oct 2026",
    has_active_application: false
  },
  {
    id: null,
    scheme_id: 4,
    scheme_code: "NFST",
    scheme_name: "National Fellowship for ST Students (NFST)",
    scheme_name_hi: "एसटी छात्रों के लिए राष्ट्रीय फैलोशिप (NFST)",
    application_number: null,
    eligibility_status: "Not Applicable",
    application_status: "Not Applicable",
    verification_status: "Not Started",
    sanction_status: "N/A",
    disbursement_status: "N/A",
    current_stage: 0,
    current_stage_name: "Not Applicable",
    deficiency_remarks: null,
    deficiency_field: null,
    sanction_amount: 0.0,
    important_dates: "Application Opens: Nov 2026",
    has_active_application: false
  },
  {
    id: null,
    scheme_id: 5,
    scheme_code: "NOS",
    scheme_name: "National Overseas Scholarship for ST Students",
    scheme_name_hi: "एसटी छात्रों के लिए राष्ट्रीय प्रवासी छात्रवृत्ति (NOS)",
    application_number: null,
    eligibility_status: "Eligible",
    application_status: "Not Applied",
    verification_status: "Not Started",
    sanction_status: "N/A",
    disbursement_status: "N/A",
    current_stage: 0,
    current_stage_name: "Not Applied",
    deficiency_remarks: null,
    deficiency_field: null,
    sanction_amount: 0.0,
    important_dates: "Closing: 31 October 2026",
    has_active_application: false
  }
];

export const INITIAL_DOCUMENTS = [
  {
    id: 1,
    doc_type: "ST Certificate",
    doc_name: "Scheduled Tribe Community Certificate",
    doc_number: "UP/SBD/ST/2023/88910",
    source: "DigiLocker",
    digilocker_uri: "in.gov.edistrict.up.caste:88910",
    verification_status: "Verified",
    verification_source: "State e-District (Uttar Pradesh)",
    remarks: "Legitimate ST certificate issued by Tehsildar Robertsganj, Sonbhadra.",
    issued_date: "14 May 2023"
  },
  {
    id: 2,
    doc_type: "PVTG Certificate",
    doc_name: "Particularly Vulnerable Tribal Group (PVTG) Certificate",
    doc_number: "PVTG/UP/SBD/2024/041",
    source: "DigiLocker",
    digilocker_uri: "in.gov.mota.pvtg:041",
    verification_status: "Verified",
    verification_source: "District Tribal Welfare Officer",
    remarks: "Verified PVTG Agariya community member.",
    issued_date: "20 Jan 2024"
  },
  {
    id: 3,
    doc_type: "Income Certificate",
    doc_name: "Annual Family Income Certificate",
    doc_number: "INC/UP/2025/11928",
    source: "Direct Upload",
    digilocker_uri: null,
    verification_status: "Mismatch",
    verification_source: "State Revenue Dept",
    remarks: "Certificate validity expired on 31-March-2026. Renewal document required.",
    issued_date: "15 Feb 2025"
  },
  {
    id: 4,
    doc_type: "Marksheets",
    doc_name: "B.Sc Computer Science Final Degree Marksheet",
    doc_number: "MARKS/AKTU/2025/99812",
    source: "DigiLocker",
    digilocker_uri: "in.gov.aktu.marksheet:99812",
    verification_status: "Verified",
    verification_source: "ABC / DigiLocker NAD",
    remarks: "Grade: 78.4% First Class with Distinction.",
    issued_date: "28 June 2025"
  },
  {
    id: 5,
    doc_type: "Institution Certificate",
    doc_name: "College Bonafide & Fee Structure Certificate",
    doc_number: "BONA/DGIT/2026/301",
    source: "Direct Upload",
    digilocker_uri: null,
    verification_status: "Verified",
    verification_source: "AISHE Institution Registry",
    remarks: "Enrolled in MCA Year 1 (Academic Year 2026-27).",
    issued_date: "10 July 2026"
  },
  {
    id: 6,
    doc_type: "Identity Documents",
    doc_name: "Aadhaar e-KYC Verification Certificate",
    doc_number: "UIDAI-MOCK-8921",
    source: "DigiLocker",
    digilocker_uri: "in.gov.uidai:XXXX-XXXX-8921",
    verification_status: "Verified",
    verification_source: "UIDAI Central Mock e-KYC",
    remarks: "Demographics matched 100% with registered student name.",
    issued_date: "01 Aug 2026"
  }
];

export const INITIAL_PAYMENTS = [
  {
    id: 1,
    scheme_name: "Post-Matric Scholarship for ST Students",
    installment_no: 1,
    amount: 25000.0,
    amount_formatted: "₹25,000",
    payment_date: "15 August 2026",
    dbt_status: "Payment Completed",
    pfms_txn_id: "PFMS-MOTA-2026-98124",
    utr_no: "RBI20260815998124",
    bank_name: "State Bank of India",
    bank_account_masked: "XXXXXXXX4291",
    academic_year: "2026-27"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "Scholarship Disbursed: ₹25,000",
    title_hi: "छात्रवृत्ति वितरित: ₹25,000",
    message: "Your scholarship payment of ₹25,000 for Post-Matric Scholarship has been successfully credited to your SBI account via DBT.",
    message_hi: "पोस्ट-मैट्रिक छात्रवृत्ति के ₹25,000 की राशि आपके एसबीआई खाते में डीबीटी द्वारा जमा कर दी गई है।",
    type: "payment",
    is_read: false,
    created_at: "24 Sep 2026, 10:15 AM"
  },
  {
    id: 2,
    title: "Action Required: Income Certificate Deficiency",
    title_hi: "कार्रवाई आवश्यक: आय प्रमाण पत्र त्रुटि",
    message: "Your Top Class Scholarship application requires a renewed Income Certificate. Please upload the latest document in your wallet.",
    message_hi: "आपके टॉप क्लास छात्रवृत्ति आवेदन में नवीनीकृत आय प्रमाण पत्र की आवश्यकता है। कृपया इसे अपडेट करें।",
    type: "deficiency",
    is_read: false,
    created_at: "19 Sep 2026, 03:40 PM"
  },
  {
    id: 3,
    title: "DigiLocker Verification Successful",
    title_hi: "डिजिलॉकर सत्यापन सफल",
    message: "Your ST Community Certificate has been verified digitally with State e-District portal.",
    message_hi: "आपका एसटी समुदाय प्रमाण पत्र राज्य ई-डिस्ट्रिक्ट पोर्टल के माध्यम से डिजिटल रूप से सत्यापित हो गया है।",
    type: "verification",
    is_read: true,
    created_at: "07 Sep 2026, 11:20 AM"
  },
  {
    id: 4,
    title: "Upcoming Deadline: NOS 2026-27",
    title_hi: "आगामी समय सीमा: एनओएस 2026-27",
    message: "National Overseas Scholarship (NOS) window for Fall 2027 admissions closes on 31 October 2026.",
    message_hi: "राष्ट्रीय प्रवासी छात्रवृत्ति (एनओएस) के लिए आवेदन 31 अक्टूबर 2026 को बंद हो रहे हैं।",
    type: "deadline",
    is_read: true,
    created_at: "02 Sep 2026, 09:00 AM"
  }
];

export const INITIAL_COVERAGE_GAP = {
  summary: {
    total_enrolled_st: 10000,
    scholarship_beneficiaries: 7800,
    potentially_eligible: 2200,
    incomplete_applications: 840,
    coverage_percentage: 78.0,
    compliance_note: "Students are marked as 'Potentially Eligible' pending verification of family income and institution enrollment."
  },
  districts: [
    { id: 1, state: "Uttar Pradesh", district: "Sonbhadra", total_enrolled_st: 10000, scholarship_beneficiaries: 7800, potentially_eligible: 2200, incomplete_applications: 840, coverage_percentage: 78.0, outreach_priority: "High" },
    { id: 2, state: "Chhattisgarh", district: "Bastar", total_enrolled_st: 14500, scholarship_beneficiaries: 11200, potentially_eligible: 3300, incomplete_applications: 1120, coverage_percentage: 77.2, outreach_priority: "High" },
    { id: 3, state: "Odisha", district: "Mayurbhanj", total_enrolled_st: 18200, scholarship_beneficiaries: 15100, potentially_eligible: 3100, incomplete_applications: 950, coverage_percentage: 83.0, outreach_priority: "High" },
    { id: 4, state: "Jharkhand", district: "Ranchi", total_enrolled_st: 16800, scholarship_beneficiaries: 13400, potentially_eligible: 3400, incomplete_applications: 1200, coverage_percentage: 79.8, outreach_priority: "High" },
    { id: 5, state: "Kerala", district: "Wayanad", total_enrolled_st: 6400, scholarship_beneficiaries: 5600, potentially_eligible: 800, incomplete_applications: 210, coverage_percentage: 87.5, outreach_priority: "Medium" },
    { id: 6, state: "Gujarat", district: "Dahod", total_enrolled_st: 12000, scholarship_beneficiaries: 9800, potentially_eligible: 2200, incomplete_applications: 680, coverage_percentage: 81.7, outreach_priority: "Medium" },
    { id: 7, state: "Madhya Pradesh", district: "Khargone", total_enrolled_st: 11500, scholarship_beneficiaries: 9200, potentially_eligible: 2300, incomplete_applications: 710, coverage_percentage: 80.0, outreach_priority: "Medium" },
    { id: 8, state: "Maharashtra", district: "Gadchiroli", total_enrolled_st: 8900, scholarship_beneficiaries: 7100, potentially_eligible: 1800, incomplete_applications: 490, coverage_percentage: 79.8, outreach_priority: "Medium" }
  ]
};
