from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.db.session import engine, SessionLocal, Base
from app.db.seed_data import init_db

# Import routers
from app.routers import (
    auth, students, scholarships, applications, 
    documents, verification, payments, chatbot, 
    notifications, analytics, admin
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create database tables and seed realistic demo records
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
    yield
    # Shutdown logic if any

app = FastAPI(
    title="MoTA Unified ST Scholarship & Fellowship Platform",
    description="Unified API Gateway for Scheduled Tribe Student Scholarships, Fellowships, DigiLocker Wallet, and Verification Layer (Ministry of Tribal Affairs, GoI)",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware for mobile-first web frontend and clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(students.router, prefix=settings.API_V1_STR)
app.include_router(scholarships.router, prefix=settings.API_V1_STR)
app.include_router(applications.router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(verification.router, prefix=settings.API_V1_STR)
app.include_router(payments.router, prefix=settings.API_V1_STR)
app.include_router(chatbot.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "platform": "Ministry of Tribal Affairs (MoTA) Unified ST Scholarship & Fellowship Platform",
        "ministry": "Government of India",
        "status": "Operational",
        "docs_url": "/docs",
        "schemes_covered": [
            "Pre-Matric Scholarship",
            "Post-Matric Scholarship",
            "Top Class Scholarship",
            "National Fellowship for ST Students (NFST)",
            "National Overseas Scholarship (NOS)"
        ],
        "verification_layer": "Operational (UIDAI, DigiLocker, UDISE+, APAAR, AISHE, State e-District, UGC)",
        "ai_assistant": "JAGO (English / Hindi Active)"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "database": "connected", "mode": "Mock/Simulated Active"}
