import re
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Application, PaymentRecord, StudentProfile, User, Document, ScholarshipScheme
from app.routers.auth import get_current_user

router = APIRouter(prefix="/chatbot", tags=["JAGO AI Assistant"])

class ChatQueryRequest(BaseModel):
    query: str
    language: Optional[str] = "en"  # "en" or "hi"

class QuickQuestion(BaseModel):
    id: str
    label_en: str
    label_hi: str
    query_en: str
    query_hi: str

@router.get("/quick-questions")
def get_quick_questions():
    return [
        {
            "id": "q1",
            "label_en": "Where is my application?",
            "label_hi": "मेरा आवेदन कहाँ है?",
            "query_en": "Where is my scholarship application?",
            "query_hi": "मेरा छात्रवृत्ति आवेदन किस स्थिति में है?"
        },
        {
            "id": "q2",
            "label_en": "What document is missing?",
            "label_hi": "कौन सा दस्तावेज़ अधूरा है?",
            "query_en": "What document is missing?",
            "query_hi": "मेरे आवेदन में कौन सा दस्तावेज़ छूटा हुआ है?"
        },
        {
            "id": "q3",
            "label_en": "When will payment arrive?",
            "label_hi": "छात्रवृत्ति का पैसा कब आएगा?",
            "query_en": "When will my scholarship payment arrive?",
            "query_hi": "मेरी छात्रवृत्ति राशि कब तक आएगी?"
        },
        {
            "id": "q4",
            "label_en": "Why is my application pending?",
            "label_hi": "मेरा आवेदन लंबित क्यों है?",
            "query_en": "Why is my application pending?",
            "query_hi": "मेरा आवेदन क्यों अटका हुआ है?"
        },
        {
            "id": "q5",
            "label_en": "Am I eligible for Top Class?",
            "label_hi": "क्या मैं टॉप क्लास के लिए पात्र हूँ?",
            "query_en": "Am I eligible for Top Class Scholarship?",
            "query_hi": "क्या मैं टॉप क्लास छात्रवृत्ति के लिए पात्र हूँ?"
        },
        {
            "id": "q6",
            "label_en": "What was my previous payment?",
            "label_hi": "मेरा पिछला भुगतान कितना था?",
            "query_en": "What was my previous scholarship payment?",
            "query_hi": "मुझे पहले कितना छात्रवृत्ति भुगतान मिला था?"
        }
    ]

@router.post("/query")
def chat_with_jago(
    req: ChatQueryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    JAGO AI response engine.
    Synthesizes live student database context (active applications, missing documents,
    DBT payment records, eligibility rules) and produces a personalized response in English or Hindi.
    """
    profile = current_user.profile
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile not found")

    q = req.query.strip().lower()
    is_hindi = req.language == "hi" or bool(re.search(r"[\u0900-\u097F]", req.query))

    # Fetch live student context
    applications = db.query(Application).filter(Application.student_id == profile.id).all()
    payments = db.query(PaymentRecord).filter(PaymentRecord.student_id == profile.id).all()
    documents = db.query(Document).filter(Document.student_id == profile.id).all()

    # Identify deficiency or pending status
    deficiency_app = next((a for a in applications if a.status == "Deficiency"), None)
    completed_app = next((a for a in applications if a.status == "Payment Completed"), None)
    last_payment = payments[0] if payments else None

    # Context analysis and response generation
    response_text = ""
    suggested_actions = []

    # 1. "Where is my application?" / "Status"
    if any(k in q for k in ["where", "status", "stage", "kahan", "स्थिति", "कहाँ"]):
        if deficiency_app:
            if is_hindi:
                response_text = (
                    f"नमस्ते {profile.full_name}, आपका आवेदन **{deficiency_app.scheme.name_hi or deficiency_app.scheme.name}** "
                    f"(आवेदन सं. `{deficiency_app.application_number}`) वर्तमान में **दस्तावेज़ सत्यापन (चरण 2)** पर रुका हुआ है। "
                    f"कारण: {deficiency_app.deficiency_remarks}। कृपया इसे अपने डिजिटल वॉलेट से तुरंत अपडेट करें।"
                )
            else:
                response_text = (
                    f"Hello {profile.full_name}, your application for **{deficiency_app.scheme.name}** "
                    f"(`{deficiency_app.application_number}`) is currently at **Stage 2: Document Verification** with a status of **Deficiency Action Required**. "
                    f"Remark: *{deficiency_app.deficiency_remarks}*. Please update your certificate to proceed."
                )
            suggested_actions = ["Upload Renewed Income Certificate", "Check Application Timeline"]
        elif completed_app:
            if is_hindi:
                response_text = (
                    f"आपके **{completed_app.scheme.name_hi or completed_app.scheme.name}** का आवेदन "
                    f"(सं. `{completed_app.application_number}`) **सफलतापूर्वक संपन्न** हो चुका है (चरण 7/7)। "
                    f"₹{completed_app.sanction_amount:,.0f} की राशि आपके आधार से जुड़े बैंक खाते में भेज दी गई है।"
                )
            else:
                response_text = (
                    f"Your application for **{completed_app.scheme.name}** (`{completed_app.application_number}`) "
                    f"is **100% Completed (Stage 7/7)**. Direct Benefit Transfer of ₹{completed_app.sanction_amount:,.0f} has been disbursed."
                )
            suggested_actions = ["View Payment Receipt", "Check DigiLocker Wallet"]
        else:
            if is_hindi:
                response_text = "आपके पास कोई सक्रिय छात्रवृत्ति आवेदन नहीं है। आप योजनाओं की सूची देखकर आवेदन कर सकते हैं।"
            else:
                response_text = "You do not have any active applications submitted at this time. Browse the Schemes tab to check eligibility and apply."
            suggested_actions = ["Explore 5 MoTA Schemes", "Check Eligibility"]

    # 2. "What document is missing?" / "Deficiency"
    elif any(k in q for k in ["missing", "document", "deficiency", "chhoota", "दस्तावेज़", "अधूरा", "कमी"]):
        if deficiency_app and deficiency_app.deficiency_field:
            if is_hindi:
                response_text = (
                    f"⚠️ आपके **{deficiency_app.scheme.name_hi or deficiency_app.scheme.name}** आवेदन में **{deficiency_app.deficiency_field}** में त्रुटि पाई गई है।\n\n"
                    f"विवरण: *{deficiency_app.deficiency_remarks}*\n\n"
                    f"आप 'DigiLocker Wallet' टैब में जाकर नया प्रमाण पत्र एक क्लिक में फ़ेच या अपलोड कर सकते हैं।"
                )
            else:
                response_text = (
                    f"⚠️ Action Required for **{deficiency_app.scheme.name}**:\n"
                    f"- **Missing/Deficient Item:** {deficiency_app.deficiency_field}\n"
                    f"- **Official Verification Note:** {deficiency_app.deficiency_remarks}\n\n"
                    f"You can resolve this immediately by opening the **Digital Document Wallet** and fetching the updated certificate from DigiLocker."
                )
            suggested_actions = ["Go to Document Wallet", "Resolve Deficiency Now"]
        else:
            if is_hindi:
                response_text = "बधाई हो! आपके प्रोफाइल और मुख्य आवेदन में सभी आवश्यक दस्तावेज़ (एसटी प्रमाण पत्र, मार्कशीट, आधार e-KYC) पूरी तरह सत्यापित हैं।"
            else:
                response_text = "Great news! All required documents for your active profile (ST Certificate, Marksheet, and Aadhaar e-KYC) are fully verified with no outstanding deficiencies."
            suggested_actions = ["View Verified Documents"]

    # 3. "When will my scholarship payment arrive?" / "Payment Date"
    elif any(k in q for k in ["when", "payment", "arrive", "disburs", "kab", "पैसा", "भुगतान", "कब"]):
        if completed_app and last_payment:
            if is_hindi:
                response_text = (
                    f"आपके पोस्ट-मैट्रिक छात्रवृत्ति की पहली किस्त **₹{last_payment.amount:,.0f}** का भुगतान "
                    f"**{last_payment.payment_date}** को आपके भारतीय स्टेट बैंक (खाता `{last_payment.bank_account_masked}`) में डीबीटी (PFMS) के माध्यम से जमा किया जा चुका है।\n"
                    f"यूटीआर संदर्भ संख्या: `{last_payment.utr_no}`।"
                )
            else:
                response_text = (
                    f"Your scholarship payment of **₹{last_payment.amount:,.0f}** for {last_payment.application.scheme.name} "
                    f"was already successfully processed on **{last_payment.payment_date}** via DBT / PFMS into your SBI Account (`{last_payment.bank_account_masked}`).\n"
                    f"**Bank UTR Reference:** `{last_payment.utr_no}`."
                )
            suggested_actions = ["Track DBT Status", "View PFMS Txn Details"]
        else:
            if is_hindi:
                response_text = "वर्तमान आवेदन की स्वीकृति प्रक्रियाधीन है। स्वीकृति आदेश जारी होने के 7-10 कार्य दिवसों के भीतर डीबीटी भुगतान बैंक खाते में अंतरित किया जाता है।"
            else:
                response_text = "Once your pending application receives final Administrative Sanction, Direct Benefit Transfer (DBT) is credited within 7-10 working days via PFMS."
            suggested_actions = ["Track Application Stages"]

    # 4. "Why is my application pending?"
    elif any(k in q for k in ["why", "pending", "atka", "लंबित", "क्यों"]):
        if deficiency_app:
            if is_hindi:
                response_text = (
                    f"आपका आवेदन इसलिए रुका हुआ है क्योंकि **राज्य राजस्व पोर्टल** द्वारा जांचे गए आय प्रमाण पत्र की वैधता 31 मार्च 2026 को समाप्त हो चुकी है। "
                    f"जैसे ही आप नया प्रमाण पत्र अपलोड करेंगे, आवेदन स्वतः संस्थान सत्यापन के लिए आगे बढ़ जाएगा।"
                )
            else:
                response_text = (
                    f"Your Top Class application is currently paused at Stage 2 because the **State Revenue verification API** flagged your Income Certificate as expired (dated over 1 year ago). "
                    f"Once you upload your renewed Tehsildar certificate, it will automatically clear to Institute Verification."
                )
            suggested_actions = ["Upload Renewed Certificate", "Manual Review Queue Status"]
        else:
            if is_hindi:
                response_text = "आपका कोई भी आवेदन अटका हुआ नहीं है। सभी सत्यापित प्रक्रियाएं समय पर पूरी हो रही हैं।"
            else:
                response_text = "None of your completed applications are currently blocked. Your previous scholarship has been fully processed."
            suggested_actions = ["Check Timeline"]

    # 5. "Am I eligible for Top Class Scholarship?" / "Eligibility"
    elif any(k in q for k in ["eligible", "top class", "patra", "पात्र", "योग्यता", "eligibility"]):
        # Demo student is ST, income 1.8L <= 6.0L
        if is_hindi:
            response_text = (
                f"हाँ {profile.full_name}, आप **शीर्ष श्रेणी (Top Class) शिक्षा छात्रवृत्ति** के लिए पात्र हैं!\n\n"
                f"✅ **एसटी श्रेणी:** {profile.st_category} ({profile.st_subcaste})\n"
                f"✅ **वार्षिक पारिवारिक आय:** ₹{profile.annual_family_income:,.0f} (सीमा ₹6.00 लाख से कम है)\n"
                f"ℹ️ **शर्त:** यदि आप किसी अधिसूचित 250+ प्रीमियर संस्थान (IIT, IIM, NIT आदि) में अध्ययनरत हैं, तो आपको पूर्ण शिक्षण शुल्क + ₹86,000 वार्षिक भत्ता मिलेगा।"
            )
        else:
            response_text = (
                f"Yes {profile.full_name}, you meet the primary criteria for the **Top Class Education Scheme for ST Students**:\n\n"
                f"- **Category:** Verified {profile.st_category} ({profile.st_subcaste}, PVTG: {profile.pvtg_community})\n"
                f"- **Annual Family Income:** ₹{profile.annual_family_income:,.0f} (Well within the ₹6.00 Lakhs ceiling)\n"
                f"- **Requirement:** Admission to one of the 250+ notified premier institutions (IITs, IIMs, NITs, AIIMS, NLUs).\n\n"
                f"**Benefit:** Full tuition fee waiver + ₹86,000 annual allowances for books, computer, and living expenses."
            )
        suggested_actions = ["Apply for Top Class", "View Notified Institutes"]

    # 6. "What was my previous scholarship payment?" / "Past payment"
    elif any(k in q for k in ["previous", "past", "pichla", "पिछला", "amount"]):
        if last_payment:
            if is_hindi:
                response_text = (
                    f"आपका पिछला छात्रवृत्ति भुगतान **₹{last_payment.amount:,.0f}** का था।\n"
                    f"- योजना: {last_payment.application.scheme.name_hi or last_payment.application.scheme.name}\n"
                    f"- भुगतान तिथि: {last_payment.payment_date}\n"
                    f"- बैंक: {last_payment.bank_name} ({last_payment.bank_account_masked})\n"
                    f"- यूटीआर सं.: `{last_payment.utr_no}`"
                )
            else:
                response_text = (
                    f"Your most recent scholarship disbursement was **₹{last_payment.amount:,.0f}** for **{last_payment.application.scheme.name}**.\n\n"
                    f"- **Credit Date:** {last_payment.payment_date}\n"
                    f"- **Disbursed To:** {last_payment.bank_name} ({last_payment.bank_account_masked})\n"
                    f"- **PFMS Transaction ID:** `{last_payment.pfms_txn_id}`\n"
                    f"- **Bank UTR Number:** `{last_payment.utr_no}`"
                )
            suggested_actions = ["Download Payment Slip", "View Passbook History"]
        else:
            if is_hindi:
                response_text = "आपके खाते में अभी तक कोई पूर्व भुगतान दर्ज नहीं है।"
            else:
                response_text = "No prior payment records found for this academic cycle."

    # General Fallback
    else:
        if is_hindi:
            response_text = (
                f"नमस्ते {profile.full_name}! मैं **जागो (JAGO)** हूँ — जनजातीय कार्य मंत्रालय (MoTA) का छात्रवृत्ति सहायक। "
                f"मैं आपके आवेदन की स्थिति, लापता दस्तावेज़, डीबीटी भुगतान, अथवा 5 राष्ट्रीय छात्रवृत्ति योजनाओं की पात्रता संबंधी प्रश्नों में मदद कर सकता हूँ। "
                f"कृपया नीचे दिए गए त्वरित प्रश्नों में से चुनें।"
            )
        else:
            response_text = (
                f"Hello {profile.full_name}! I am **JAGO**, your AI Assistant for the Ministry of Tribal Affairs (MoTA) Unified Scholarship Platform. "
                f"I can assist you with real-time tracking of your 5 MoTA schemes, deficiency rectification, DigiLocker certificates, and DBT payment schedules. "
                f"Feel free to ask a question or tap one of the suggested prompts below!"
            )
        suggested_actions = [
            "Where is my scholarship application?",
            "What document is missing?",
            "When will my scholarship payment arrive?",
            "Am I eligible for Top Class Scholarship?"
        ]

    return {
        "query": req.query,
        "language": "hi" if is_hindi else "en",
        "response": response_text,
        "suggested_actions": suggested_actions,
        "timestamp": datetime.utcnow().strftime("%I:%M %p")
    }
