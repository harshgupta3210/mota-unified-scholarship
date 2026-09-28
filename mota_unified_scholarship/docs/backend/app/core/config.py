import os

class Settings:
    PROJECT_NAME: str = "MoTA Unified ST Scholarship & Fellowship Platform"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "mota_super_secret_jwt_key_sih_2026_tribal_affairs")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # SQLite default for zero-config run, seamlessly supports PostgreSQL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./mota_scholarships.db")
    
    # Mock Government Services Flags
    MOCK_UIDAI_ENABLED: bool = True
    MOCK_DIGILOCKER_ENABLED: bool = True
    MOCK_UDISE_ENABLED: bool = True
    MOCK_APAAR_ENABLED: bool = True
    MOCK_AISHE_ENABLED: bool = True
    MOCK_EDISTRICT_ENABLED: bool = True
    MOCK_UGC_ENABLED: bool = True
    MOCK_PFMS_ENABLED: bool = True

settings = Settings()
