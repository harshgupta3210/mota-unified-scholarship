# Database Entity-Relationship Diagram (ERD)

The database schema is designed for relational consistency and auditability, supporting PostgreSQL and SQLite.

## 1. Mermaid Entity-Relationship Diagram

```mermaid
erDiagram
    USERS ||--|| STUDENT_PROFILES : has
    USERS ||--o{ NOTIFICATIONS : receives
    STUDENT_PROFILES ||--o{ APPLICATIONS : submits
    STUDENT_PROFILES ||--o{ DOCUMENTS : stores
    STUDENT_PROFILES ||--o{ PAYMENT_RECORDS : receives
    SCHOLARSHIP_SCHEMES ||--o{ APPLICATIONS : categorizes
    APPLICATIONS ||--o{ APPLICATION_TIMELINES : tracks
    APPLICATIONS ||--o{ PAYMENT_RECORDS : generates
    APPLICATIONS ||--o{ VERIFICATION_LOGS : records

    USERS {
        int id PK
        string email UK
        string phone UK
        string hashed_password
        string role
        boolean is_active
        datetime created_at
    }

    STUDENT_PROFILES {
        int id PK
        int user_id FK
        string full_name
        string dob
        string gender
        string state
        string district
        string st_category
        string st_subcaste
        boolean is_pvtg
        string pvtg_community
        string institution_name
        string aishe_code
        string course_name
        string course_level
        string academic_year
        string apaar_id
        string aadhaar_masked
        boolean is_aadhaar_verified
        boolean is_st_verified
        boolean is_income_verified
        float annual_family_income
        string bank_name
        string bank_account_masked
        string ifsc_code
        boolean is_dbt_enabled
    }

    SCHOLARSHIP_SCHEMES {
        int id PK
        string code UK
        string name
        string name_hi
        string level
        text description
        float max_amount
        string max_amount_display
        float income_limit
        string income_limit_display
        text eligibility_criteria
        text required_documents
        string important_dates
        boolean is_active
    }

    APPLICATIONS {
        int id PK
        string application_number UK
        int student_id FK
        int scheme_id FK
        string academic_year
        string status
        string eligibility_status
        string verification_status
        string sanction_status
        string disbursement_status
        int current_stage
        string current_stage_name
        text deficiency_remarks
        string deficiency_field
        float sanction_amount
        string sanction_order_no
        datetime applied_date
        datetime updated_at
    }

    APPLICATION_TIMELINES {
        int id PK
        int application_id FK
        int stage_number
        string stage_name
        string stage_name_hi
        string status
        string description
        datetime completed_at
    }

    DOCUMENTS {
        int id PK
        int student_id FK
        string doc_type
        string doc_name
        string doc_number
        string source
        string digilocker_uri
        string verification_status
        string verification_source
        float confidence_score
        string remarks
        string issued_date
        datetime uploaded_at
    }

    VERIFICATION_LOGS {
        int id PK
        int application_id FK
        string verification_type
        string source_service
        string input_identifier
        string status
        float confidence
        text remarks
        boolean routed_to_manual_queue
        datetime created_at
    }

    PAYMENT_RECORDS {
        int id PK
        int application_id FK
        int student_id FK
        int installment_no
        float amount
        string payment_date
        string dbt_status
        string pfms_txn_id
        string utr_no
        string bank_name
        string bank_account_masked
        string academic_year
        datetime created_at
    }

    COVERAGE_GAP_METRICS {
        int id PK
        string state
        string district
        int total_enrolled_st
        int scholarship_beneficiaries
        int potentially_eligible
        int incomplete_applications
        string outreach_priority
        string synced_source
        datetime updated_at
    }
```

---

## 2. Security & Masking Standards
- **Aadhaar Storage**: In compliance with UIDAI and DPDP Act guidelines, no raw 12-digit Aadhaar number is stored in the database. Only masked representations (`XXXX-XXXX-8921`) and encrypted verification tokens are stored.
- **Bank Account Details**: Displayed masked as `XXXXXXXX4291` in client payloads to preserve student privacy during public demonstrations.
