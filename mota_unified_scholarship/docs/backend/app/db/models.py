import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, Float, DateTime, Text, ForeignKey, Enum
)
from sqlalchemy.orm import relationship
from app.db.session import Base

class UserRole(str, enum.Enum):
    STUDENT = "student"
    OFFICER = "officer"
    ADMIN = "admin"

class ApplicationStatus(str, enum.Enum):
    DRAFT = "Draft"
    SUBMITTED = "Submitted"
    UNDER_VERIFICATION = "Under Verification"
    DEFICIENCY = "Deficiency"
    VERIFIED = "Verified"
    SANCTIONED = "Sanctioned"
    PAYMENT_PROCESSING = "Payment Processing"
    PAYMENT_COMPLETED = "Payment Completed"
    REJECTED = "Rejected"

class VerificationStatus(str, enum.Enum):
    VERIFIED = "Verified"
    INVALID = "Invalid"
    MISMATCH = "Mismatch"
    PENDING = "Pending"
    MANUAL_REVIEW = "Manual Review"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=True)
    phone = Column(String(20), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="student")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    full_name = Column(String(255), nullable=False)
    dob = Column(String(50), nullable=False)
    gender = Column(String(20), nullable=False)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    st_category = Column(String(100), default="Scheduled Tribe (ST)")
    st_subcaste = Column(String(100), nullable=True)
    is_pvtg = Column(Boolean, default=False)
    pvtg_community = Column(String(100), nullable=True)
    
    institution_name = Column(String(255), nullable=False)
    institution_state = Column(String(100), nullable=True)
    aishe_code = Column(String(50), nullable=True)
    course_name = Column(String(150), nullable=False)
    course_level = Column(String(50), default="Post Graduate")
    academic_year = Column(String(20), default="2026-27")
    
    apaar_id = Column(String(50), nullable=True)
    aadhaar_masked = Column(String(20), default="XXXX-XXXX-8921")
    is_aadhaar_verified = Column(Boolean, default=True)
    is_st_verified = Column(Boolean, default=True)
    is_income_verified = Column(Boolean, default=True)
    annual_family_income = Column(Float, default=180000.0)
    
    # Direct Benefit Transfer Bank Details (Masked)
    bank_name = Column(String(100), default="State Bank of India")
    bank_account_masked = Column(String(30), default="XXXXXXXX4291")
    ifsc_code = Column(String(20), default="SBIN0001245")
    is_dbt_enabled = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="profile")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="student", cascade="all, delete-orphan")

class ScholarshipScheme(Base):
    __tablename__ = "scholarship_schemes"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True)  # PRE_MATRIC, POST_MATRIC, TOP_CLASS, NFST, NOS
    name = Column(String(255), nullable=False)
    name_hi = Column(String(255), nullable=True)
    level = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    description_hi = Column(Text, nullable=True)
    max_amount = Column(Float, nullable=False)
    max_amount_display = Column(String(50), nullable=False)
    income_limit = Column(Float, nullable=True)
    income_limit_display = Column(String(100), nullable=True)
    eligibility_criteria = Column(Text, nullable=False)
    required_documents = Column(Text, nullable=False)
    important_dates = Column(String(150), default="31 October 2026")
    is_active = Column(Boolean, default=True)
    
    applications = relationship("Application", back_populates="scheme")

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    application_number = Column(String(50), unique=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"))
    scheme_id = Column(Integer, ForeignKey("scholarship_schemes.id"))
    academic_year = Column(String(20), default="2026-27")
    
    status = Column(String(50), default="Submitted")
    eligibility_status = Column(String(50), default="Eligible")
    verification_status = Column(String(50), default="Under Verification")
    sanction_status = Column(String(50), default="Pending")
    disbursement_status = Column(String(50), default="Pending")
    
    current_stage = Column(Integer, default=1)  # 1 to 7
    current_stage_name = Column(String(100), default="Application Submitted")
    deficiency_remarks = Column(Text, nullable=True)
    deficiency_field = Column(String(100), nullable=True)
    
    sanction_amount = Column(Float, default=0.0)
    sanction_order_no = Column(String(100), nullable=True)
    
    applied_date = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    student = relationship("StudentProfile", back_populates="applications")
    scheme = relationship("ScholarshipScheme", back_populates="applications")
    timelines = relationship("ApplicationTimeline", back_populates="application", cascade="all, delete-orphan", order_by="ApplicationTimeline.stage_number")
    payments = relationship("PaymentRecord", back_populates="application", cascade="all, delete-orphan")
    verification_logs = relationship("VerificationLog", back_populates="application", cascade="all, delete-orphan")

class ApplicationTimeline(Base):
    __tablename__ = "application_timelines"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    stage_number = Column(Integer, nullable=False)
    stage_name = Column(String(100), nullable=False)
    stage_name_hi = Column(String(100), nullable=True)
    status = Column(String(50), default="pending")  # completed, in_progress, pending, deficiency
    description = Column(String(255), nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    application = relationship("Application", back_populates="timelines")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"))
    doc_type = Column(String(100), nullable=False)  # ST Certificate, PVTG, Income, Domicile, Marksheet, Disability, Institution, NET/JRF, Identity
    doc_name = Column(String(255), nullable=False)
    doc_number = Column(String(100), nullable=True)
    source = Column(String(50), default="DigiLocker")  # DigiLocker / Direct Upload
    digilocker_uri = Column(String(255), nullable=True)
    
    verification_status = Column(String(50), default="Verified")  # Verified, Invalid, Mismatch, Pending, Manual Review
    verification_source = Column(String(100), default="DigiLocker API")
    confidence_score = Column(Float, default=1.0)
    remarks = Column(String(255), nullable=True)
    file_size_kb = Column(Integer, default=450)
    issued_date = Column(String(50), default="10 Jan 2026")
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("StudentProfile", back_populates="documents")

class VerificationLog(Base):
    __tablename__ = "verification_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=True)
    verification_type = Column(String(100), nullable=False)  # identity, st-certificate, income, education, institution, net-jrf, disability
    source_service = Column(String(100), nullable=False)  # UIDAI, State e-District, UDISE+, AISHE, UGC/NTA, UDID
    input_identifier = Column(String(100), nullable=True)
    status = Column(String(50), default="Verified")  # Verified, Invalid, Mismatch, Pending, Manual Review
    confidence = Column(Float, default=0.98)
    remarks = Column(Text, nullable=True)
    routed_to_manual_queue = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    application = relationship("Application", back_populates="verification_logs")

class PaymentRecord(Base):
    __tablename__ = "payment_records"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    student_id = Column(Integer, ForeignKey("student_profiles.id"))
    installment_no = Column(Integer, default=1)
    amount = Column(Float, nullable=False)
    payment_date = Column(String(50), default="15 August 2026")
    dbt_status = Column(String(50), default="Payment Completed")  # Payment Completed, Payment Processing, Failed
    pfms_txn_id = Column(String(100), default="PFMS-MOTA-2026-98124")
    utr_no = Column(String(100), default="RBI20260815998124")
    bank_name = Column(String(100), default="State Bank of India")
    bank_account_masked = Column(String(50), default="XXXXXXXX4291")
    academic_year = Column(String(20), default="2026-27")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    application = relationship("Application", back_populates="payments")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(255), nullable=False)
    title_hi = Column(String(255), nullable=True)
    message = Column(Text, nullable=False)
    message_hi = Column(Text, nullable=True)
    type = Column(String(50), default="general")  # submission, deficiency, verification, sanction, payment, deadline
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="notifications")

class CoverageGapMetric(Base):
    __tablename__ = "coverage_gap_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    total_enrolled_st = Column(Integer, nullable=False)
    scholarship_beneficiaries = Column(Integer, nullable=False)
    potentially_eligible = Column(Integer, nullable=False)
    incomplete_applications = Column(Integer, default=0)
    outreach_priority = Column(String(50), default="Medium")
    synced_source = Column(String(100), default="UDISE+ & APAAR Integration")
    updated_at = Column(DateTime, default=datetime.utcnow)
