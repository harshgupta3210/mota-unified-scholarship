import os
import math
from PIL import Image, ImageDraw, ImageFont

def get_font(size, bold=False):
    font_paths = [
        "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/calibri.ttf"
    ]
    bold_paths = [
        "C:/Windows/Fonts/segoeuib.ttf",
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/calibrib.ttf"
    ]
    paths = bold_paths if bold else font_paths
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()

def draw_phone_frame(draw, width, height, current_screen_title, active_tab_idx=0):
    # Outer background
    draw.rectangle([0, 0, width, height], fill=(15, 23, 42)) # Slate 900
    
    # Phone chassis
    px, py, pw, ph = 160, 20, 480, 840
    draw.rounded_rectangle([px-6, py-6, px+pw+6, py+ph+6], radius=44, fill=(30, 41, 59))
    draw.rounded_rectangle([px, py, px+pw, py+ph], radius=38, fill=(248, 250, 252))
    
    # Top notch / dynamic island
    draw.rounded_rectangle([px + pw//2 - 55, py + 10, px + pw//2 + 55, py + 28], radius=10, fill=(15, 23, 42))
    draw.ellipse([px + pw//2 + 35, py + 15, px + pw//2 + 43, py + 23], fill=(30, 41, 59))
    
    # Status bar texts
    f_time = get_font(12, bold=True)
    f_stat = get_font(10, bold=False)
    draw.text((px + 32, py + 12), "09:41", font=f_time, fill=(15, 23, 42))
    draw.text((px + pw - 65, py + 13), "5G  100%", font=f_stat, fill=(15, 23, 42))
    
    # Tiranga strip
    ty = py + 38
    tw = pw
    draw.rectangle([px, ty, px + tw//3, ty + 4], fill=(255, 153, 51))      # Saffron
    draw.rectangle([px + tw//3, ty, px + 2*tw//3, ty + 4], fill=(255, 255, 255)) # White
    draw.rectangle([px + 2*tw//3, ty, px + tw, ty + 4], fill=(19, 136, 8))     # Green

    # Top App Bar
    ay = ty + 4
    draw.rectangle([px, ay, px + pw, ay + 48], fill=(255, 255, 255))
    
    # Ministry logo badge
    draw.rounded_rectangle([px + 14, ay + 7, px + 48, ay + 41], radius=8, fill=(245, 158, 11))
    draw.text((px + 18, ay + 14), "MoTA", font=get_font(10, bold=True), fill=(255, 255, 255))
    
    # Header title
    draw.text((px + 56, ay + 8), "Ministry of Tribal Affairs", font=get_font(9, bold=True), fill=(217, 119, 6))
    draw.text((px + 56, ay + 21), "Unified ST Scholarship Platform", font=get_font(12, bold=True), fill=(10, 37, 64))
    
    # Bell icon / active title badge
    draw.rounded_rectangle([px + pw - 82, ay + 12, px + pw - 14, ay + 36], radius=6, fill=(241, 245, 249))
    draw.text((px + pw - 74, ay + 17), "Govt. of India", font=get_font(9, bold=True), fill=(15, 118, 110))

    # Bottom navigation bar
    by = py + ph - 58
    draw.rectangle([px, by, px + pw, py + ph], fill=(255, 255, 255))
    draw.line([px, by, px + pw, by], fill=(226, 232, 240), width=1)
    
    # Navigation items
    nav_labels = ["Home", "Schemes", "Timeline", "Wallet", "JAGO AI"]
    tab_w = pw // len(nav_labels)
    for i, label in enumerate(nav_labels):
        tx = px + i * tab_w + tab_w // 2
        is_active = (i == active_tab_idx)
        color = (10, 37, 64) if is_active else (148, 163, 184)
        if is_active:
            draw.rounded_rectangle([tx - 24, by + 6, tx + 24, by + 26], radius=10, fill=(238, 242, 255))
        draw.text((tx - 12, by + 10), label[:2], font=get_font(11, bold=is_active), fill=color)
        draw.text((tx - 16, by + 32), label, font=get_font(9, bold=is_active), fill=color)

    # Home gesture indicator bar
    draw.rounded_rectangle([px + pw//2 - 45, py + ph - 10, px + pw//2 + 45, py + ph - 6], radius=2, fill=(148, 163, 184))

    return px, ay + 48, pw, by - (ay + 48)

def make_frame_1_dashboard():
    img = Image.new("RGB", (800, 880), (15, 23, 42))
    d = ImageDraw.Draw(img)
    px, cy, pw, ch = draw_phone_frame(d, 800, 880, "Dashboard", active_tab_idx=0)
    
    # Content area
    y = cy + 12
    # Student Profile Banner Card
    d.rounded_rectangle([px + 14, y, px + pw - 14, y + 110], radius=16, fill=(10, 37, 64))
    d.text((px + 28, y + 12), "SCHEDULED TRIBE · GOND (PVTG: AGARIYA)", font=get_font(9, bold=True), fill=(251, 191, 36))
    d.text((px + 28, y + 28), "Demo ST Student", font=get_font(18, bold=True), fill=(255, 255, 255))
    d.text((px + 28, y + 54), "MCA · Demo Government College, Sonbhadra UP", font=get_font(10, bold=False), fill=(203, 213, 225))
    d.text((px + 28, y + 80), "APAAR: APAAR-2026-9812-4410", font=get_font(10, bold=True), fill=(254, 240, 138))
    d.text((px + pw - 150, y + 80), "Aadhaar: XXXX-8921", font=get_font(10, bold=True), fill=(52, 211, 153))

    y += 122
    # Quick Action Buttons
    bw = (pw - 28 - 16) // 3
    actions = [("Ask JAGO AI", (255, 247, 237), (194, 65, 12)), ("DigiLocker", (239, 246, 255), (29, 78, 216)), ("DBT ₹25k", (236, 253, 245), (4, 120, 87))]
    for i, (act, bg, tc) in enumerate(actions):
        bx = px + 14 + i * (bw + 8)
        d.rounded_rectangle([bx, y, bx + bw, y + 44], radius=12, fill=bg, outline=(226, 232, 240))
        d.text((bx + 12, y + 14), act, font=get_font(10, bold=True), fill=tc)

    y += 56
    # Active Deficiency Alert
    d.rounded_rectangle([px + 14, y, px + pw - 14, y + 48], radius=12, fill=(255, 241, 242), outline=(244, 63, 94))
    d.text((px + 24, y + 8), "! Top Class Scholarship: Action Required", font=get_font(10, bold=True), fill=(159, 18, 57))
    d.text((px + 24, y + 26), "Income Certificate expired. Upload renewal in wallet.", font=get_font(9, bold=False), fill=(190, 18, 60))
    d.rounded_rectangle([px + pw - 78, y + 10, px + pw - 22, y + 36], radius=6, fill=(225, 29, 72))
    d.text((px + pw - 68, y + 17), "Resolve", font=get_font(9, bold=True), fill=(255, 255, 255))

    y += 58
    # 5 Schemes Section
    d.text((px + 16, y), "Unified 5 Schemes Directory", font=get_font(12, bold=True), fill=(15, 23, 42))
    d.text((px + pw - 70, y + 2), "5 Schemes", font=get_font(9, bold=True), fill=(100, 116, 139))
    y += 20

    schemes_data = [
        ("Post-Matric Scholarship", "MOTA-PM-2026-78192", "Payment Completed (₹25,000)", (220, 252, 231), (21, 128, 61)),
        ("Top Class Education", "MOTA-TC-2026-90412", "Deficiency (Action Required)", (255, 228, 230), (190, 18, 60)),
        ("Pre-Matric Scholarship", "Classes IX-X ST", "Not Applicable", (241, 245, 249), (100, 116, 139)),
        ("National Fellowship (NFST)", "Ph.D Research JRF", "Not Applicable", (241, 245, 249), (100, 116, 139)),
        ("National Overseas (NOS)", "Masters / Ph.D Abroad", "Eligible (Closing Oct 31)", (224, 231, 255), (67, 56, 202)),
    ]

    for title, sub, badge, bgb, tc in schemes_data:
        d.rounded_rectangle([px + 14, y, px + pw - 14, y + 54], radius=12, fill=(255, 255, 255), outline=(226, 232, 240))
        d.rounded_rectangle([px + 22, y + 10, px + 52, y + 42], radius=8, fill=(238, 242, 255))
        d.text((px + 28, y + 18), "ST", font=get_font(10, bold=True), fill=(10, 37, 64))
        d.text((px + 60, y + 10), title, font=get_font(11, bold=True), fill=(15, 23, 42))
        d.text((px + 60, y + 28), sub, font=get_font(9, bold=False), fill=(100, 116, 139))
        
        # Badge
        bw = len(badge) * 5 + 16
        d.rounded_rectangle([px + pw - 18 - bw, y + 16, px + pw - 18, y + 36], radius=10, fill=bgb)
        d.text((px + pw - 10 - bw, y + 21), badge, font=get_font(8, bold=True), fill=tc)
        y += 60

    return img

def make_frame_2_conflict():
    img = make_frame_1_dashboard()
    d = ImageDraw.Draw(img)
    px, pw = 160, 480
    
    # Dim overlay
    overlay = Image.new("RGBA", (800, 880), (0, 0, 0, 150))
    img.paste(overlay, (0, 0), overlay)
    
    # Conflict Modal Box
    mx, my, mw, mh = px + 24, 280, pw - 48, 300
    d.rounded_rectangle([mx, my, mx + mw, my + mh], radius=20, fill=(255, 255, 255), outline=(251, 191, 36), width=2)
    
    # Modal Header
    d.rounded_rectangle([mx, my, mx + mw, my + 54], radius=18, fill=(245, 158, 11))
    d.text((mx + 18, my + 14), "! Scheme Conflict Detected", font=get_font(14, bold=True), fill=(255, 255, 255))
    d.text((mx + 18, my + 34), "MoTA Dual Beneficiary Restriction Policy", font=get_font(9, bold=False), fill=(254, 243, 199))
    
    # Warning text
    d.rounded_rectangle([mx + 14, my + 68, mx + mw - 14, my + 150], radius=10, fill=(255, 251, 235), outline=(253, 230, 138))
    d.text((mx + 22, my + 78), '"You are currently receiving Post-Matric Scholarship.', font=get_font(10, bold=True), fill=(146, 64, 14))
    d.text((mx + 22, my + 96), 'Please check the eligibility rules before applying', font=get_font(10, bold=True), fill=(146, 64, 14))
    d.text((mx + 22, my + 114), 'for another scholarship."', font=get_font(10, bold=True), fill=(146, 64, 14))
    d.text((mx + 22, my + 132), "- MoTA Central Guideline (One Scheme at a Time)", font=get_font(9, bold=False), fill=(180, 83, 9))

    d.text((mx + 16, my + 164), "• An ST student may avail only ONE centrally sponsored", font=get_font(9, bold=False), fill=(71, 85, 105))
    d.text((mx + 16, my + 180), "  scholarship or fellowship scheme concurrently.", font=get_font(9, bold=False), fill=(71, 85, 105))
    d.text((mx + 16, my + 198), "• Prior benefits will be safely transitioned upon selection.", font=get_font(9, bold=False), fill=(71, 85, 105))

    # Buttons
    d.rounded_rectangle([mx + 16, my + 236, mx + mw//2 - 8, my + 276], radius=10, fill=(241, 245, 249))
    d.text((mx + 36, my + 250), "Understand", font=get_font(11, bold=True), fill=(71, 85, 105))

    d.rounded_rectangle([mx + mw//2 + 4, my + 236, mx + mw - 16, my + 276], radius=10, fill=(217, 119, 6))
    d.text((mx + mw//2 + 28, my + 250), "Scheme Rules", font=get_font(11, bold=True), fill=(255, 255, 255))
    
    return img

def make_frame_3_timeline():
    img = Image.new("RGB", (800, 880), (15, 23, 42))
    d = ImageDraw.Draw(img)
    px, cy, pw, ch = draw_phone_frame(d, 800, 880, "Timeline", active_tab_idx=2)
    
    y = cy + 12
    # App Banner
    d.rounded_rectangle([px + 14, y, px + pw - 14, y + 68], radius=14, fill=(255, 255, 255), outline=(226, 232, 240))
    d.text((px + 24, y + 10), "MOTA-PM-2026-78192", font=get_font(12, bold=True), fill=(10, 37, 64))
    d.text((px + 24, y + 28), "Post-Matric Scholarship for ST Students", font=get_font(10, bold=False), fill=(100, 116, 139))
    d.text((px + 24, y + 46), "Direct Benefit Transfer: ₹25,000", font=get_font(10, bold=True), fill=(4, 120, 87))
    d.rounded_rectangle([px + pw - 140, y + 20, px + pw - 24, y + 46], radius=12, fill=(220, 252, 231))
    d.text((px + pw - 128, y + 27), "✓ Completed (7/7)", font=get_font(9, bold=True), fill=(21, 128, 61))

    y += 82
    d.text((px + 16, y), "7-Stage Visual Application Timeline", font=get_font(13, bold=True), fill=(15, 23, 42))
    y += 24

    stages = [
        ("1", "Application Submitted", "Submitted online with APAAR & Caste", "completed", (22, 163, 74)),
        ("2", "Document Verification", "Verified via DigiLocker & State e-District", "completed", (22, 163, 74)),
        ("3", "Institute Verification", "Approved by Demo Govt College Nodal Officer", "completed", (22, 163, 74)),
        ("4", "State/Authority Verification", "Approved by State Tribal Welfare Directorate", "completed", (22, 163, 74)),
        ("5", "Sanction Approved", "Sanction Order #MOTA/ED/2026/PM/8912 generated", "completed", (22, 163, 74)),
        ("6", "DBT Processing", "Processed via PFMS & NPCI APBS Bridge", "completed", (22, 163, 74)),
        ("7", "Payment Completed", "₹25,000 credited to SBI A/C XXXXXXXX4291", "completed", (22, 163, 74)),
    ]

    # Draw vertical connecting line
    d.line([px + 36, y + 10, px + 36, y + len(stages)*62 - 30], fill=(187, 247, 208), width=3)

    for num, st_title, st_desc, status, col in stages:
        # Circle badge
        d.ellipse([px + 24, y + 4, px + 48, y + 28], fill=col)
        d.text((px + 32, y + 9), "✓", font=get_font(10, bold=True), fill=(255, 255, 255))
        
        # Details card
        d.rounded_rectangle([px + 58, y, px + pw - 16, y + 50], radius=10, fill=(255, 255, 255), outline=(226, 232, 240))
        d.text((px + 68, y + 8), f"Stage {num}: {st_title}", font=get_font(10, bold=True), fill=(15, 23, 42))
        d.text((px + 68, y + 26), st_desc, font=get_font(9, bold=False), fill=(100, 116, 139))
        y += 58

    return img

def make_frame_4_wallet():
    img = Image.new("RGB", (800, 880), (15, 23, 42))
    d = ImageDraw.Draw(img)
    px, cy, pw, ch = draw_phone_frame(d, 800, 880, "Wallet", active_tab_idx=3)

    y = cy + 12
    # DigiLocker Hero Card
    d.rounded_rectangle([px + 14, y, px + pw - 14, y + 94], radius=16, fill=(10, 37, 64))
    d.text((px + 28, y + 12), "DIGILOCKER VERIFIED WALLET", font=get_font(9, bold=True), fill=(251, 191, 36))
    d.text((px + 28, y + 28), "Digital Document Vault", font=get_font(16, bold=True), fill=(255, 255, 255))
    d.text((px + 28, y + 52), "Tamper-proof certificates linked directly to State Registries", font=get_font(9, bold=False), fill=(203, 213, 225))
    
    # Fetch from DigiLocker CTA
    d.rounded_rectangle([px + 28, y + 68, px + pw - 28, y + 86], radius=6, fill=(245, 158, 11))
    d.text((px + 85, y + 71), "⚡ Click to Fetch Certificate from DigiLocker", font=get_font(9, bold=True), fill=(10, 37, 64))

    y += 106
    d.text((px + 16, y), "Verified Documents (Reusable across 5 Schemes)", font=get_font(11, bold=True), fill=(15, 23, 42))
    y += 20

    docs = [
        ("ST Caste Certificate", "UP/SBD/ST/2023/88910", "State e-District (Tehsildar)", "Verified", (22, 163, 74)),
        ("PVTG Certificate", "PVTG/UP/SBD/2024/041", "Tribal Welfare Office (Agariya)", "Verified", (22, 163, 74)),
        ("Marksheet (B.Sc CS)", "MARKS/AKTU/2025/99812", "DigiLocker NAD / ABC Registry", "Verified", (22, 163, 74)),
        ("Income Certificate", "INC/UP/2026/90214", "Renewed Tehsildar Certificate", "Verified (Renewed)", (22, 163, 74)),
        ("College Bonafide", "BONA/DGIT/2026/301", "AISHE Code C-48192 Registry", "Verified", (22, 163, 74)),
        ("Aadhaar Identity", "XXXX-XXXX-8921", "UIDAI Central Demographics", "Verified", (22, 163, 74)),
    ]

    for dname, dno, diss, dstat, col in docs:
        d.rounded_rectangle([px + 14, y, px + pw - 14, y + 58], radius=12, fill=(255, 255, 255), outline=(226, 232, 240))
        d.text((px + 26, y + 10), dname, font=get_font(11, bold=True), fill=(15, 23, 42))
        d.text((px + 26, y + 26), f"ID: {dno}", font=get_font(9, bold=False), fill=(71, 85, 105))
        d.text((px + 26, y + 40), f"Issuer: {diss}", font=get_font(8, bold=False), fill=(148, 163, 184))

        # Badge
        d.rounded_rectangle([px + pw - 110, y + 14, px + pw - 22, y + 36], radius=10, fill=(220, 252, 231))
        d.text((px + pw - 102, y + 20), dstat, font=get_font(8, bold=True), fill=col)
        y += 66

    return img

def make_frame_5_jago():
    img = Image.new("RGB", (800, 880), (15, 23, 42))
    d = ImageDraw.Draw(img)
    px, cy, pw, ch = draw_phone_frame(d, 800, 880, "JAGO AI", active_tab_idx=4)

    y = cy + 12
    # JAGO Top Header
    d.rounded_rectangle([px + 14, y, px + pw - 14, y + 54], radius=14, fill=(217, 119, 6))
    d.text((px + 26, y + 10), "JAGO AI Chatbot · जागो सहायक", font=get_font(13, bold=True), fill=(255, 255, 255))
    d.text((px + 26, y + 30), "• Live Context-Aware · English & हिन्दी Active", font=get_font(9, bold=False), fill=(254, 243, 199))

    y += 66
    # Chat Feed
    # User message
    d.rounded_rectangle([px + pw - 240, y, px + pw - 16, y + 42], radius=12, fill=(10, 37, 64))
    d.text((px + pw - 228, y + 13), "When will my payment arrive?", font=get_font(10, bold=True), fill=(255, 255, 255))

    y += 52
    # JAGO Bot Reply
    d.rounded_rectangle([px + 16, y, px + pw - 50, y + 110], radius=14, fill=(255, 255, 255), outline=(226, 232, 240))
    d.text((px + 26, y + 10), "JAGO AI Assistant (MoTA):", font=get_font(9, bold=True), fill=(217, 119, 6))
    d.text((px + 26, y + 26), "Your scholarship payment of ₹25,000 for", font=get_font(9, bold=False), fill=(15, 23, 42))
    d.text((px + 26, y + 42), "Post-Matric Scholarship was completed on", font=get_font(9, bold=False), fill=(15, 23, 42))
    d.text((px + 26, y + 58), "15 August 2026 into SBI (A/C XXXXXXXX4291).", font=get_font(9, bold=True), fill=(4, 120, 87))
    d.text((px + 26, y + 76), "Bank UTR: RBI20260815998124 · PFMS Verified", font=get_font(8, bold=True), fill=(100, 116, 139))
    d.rounded_rectangle([px + 26, y + 90, px + 150, y + 104], radius=6, fill=(254, 243, 199))
    d.text((px + 32, y + 92), "✓ Track in DBT Tab", font=get_font(8, bold=True), fill=(180, 83, 9))

    y += 122
    # Hindi query from user
    d.rounded_rectangle([px + pw - 260, y, px + pw - 16, y + 42], radius=12, fill=(10, 37, 64))
    d.text((px + pw - 248, y + 13), "क्या मैं टॉप क्लास छात्रवृत्ति के पात्र हूँ?", font=get_font(10, bold=True), fill=(255, 255, 255))

    y += 52
    # JAGO Hindi Response
    d.rounded_rectangle([px + 16, y, px + pw - 50, y + 98], radius=14, fill=(255, 255, 255), outline=(226, 232, 240))
    d.text((px + 26, y + 10), "जागो AI सहायक:", font=get_font(9, bold=True), fill=(217, 119, 6))
    d.text((px + 26, y + 26), "हाँ Demo ST Student, आप पात्र हैं!", font=get_font(9, bold=True), fill=(4, 120, 87))
    d.text((px + 26, y + 42), "पारिवारिक आय ₹1.80L (सीमा ₹6.0L से कम है)।", font=get_font(9, bold=False), fill=(15, 23, 42))
    d.text((px + 26, y + 58), "लाभ: पूर्ण शिक्षण शुल्क + ₹86,000 वार्षिक भत्ता।", font=get_font(9, bold=True), fill=(10, 37, 64))
    d.text((px + 26, y + 78), "आय प्रमाण पत्र नवीनीकरण सुधार पूर्ण हो चुका है।", font=get_font(8, bold=False), fill=(100, 116, 139))

    y += 110
    # Quick Questions Chips
    d.text((px + 18, y), "Suggested Questions:", font=get_font(9, bold=True), fill=(100, 116, 139))
    y += 16
    chips = ["Where is my application?", "What document is missing?", "Am I eligible?"]
    for c in chips:
        cw = len(c) * 6 + 18
        d.rounded_rectangle([px + 16, y, px + 16 + cw, y + 24], radius=12, fill=(254, 243, 199))
        d.text((px + 24, y + 6), c, font=get_font(8, bold=True), fill=(180, 83, 9))
        px += cw + 6
    px = 160 # Reset

    y += 38
    # Input simulation bar
    d.rounded_rectangle([px + 14, y, px + pw - 14, y + 44], radius=22, fill=(241, 245, 249), outline=(203, 213, 225))
    d.text((px + 30, y + 14), "Ask any question in English or हिन्दी...", font=get_font(9, bold=False), fill=(148, 163, 184))
    d.ellipse([px + pw - 52, y + 6, px + pw - 20, y + 38], fill=(217, 119, 6))
    d.text((px + pw - 42, y + 14), "🎤", font=get_font(10, bold=False), fill=(255, 255, 255))

    return img

def make_frame_6_dbt():
    img = Image.new("RGB", (800, 880), (15, 23, 42))
    d = ImageDraw.Draw(img)
    px, cy, pw, ch = draw_phone_frame(d, 800, 880, "DBT Tracker", active_tab_idx=0)

    y = cy + 12
    # DBT Hero Green Card
    d.rounded_rectangle([px + 14, y, px + pw - 14, y + 115], radius=16, fill=(4, 120, 87))
    d.text((px + 28, y + 14), "DIRECT BENEFIT TRANSFER (DBT BHARAT)", font=get_font(9, bold=True), fill=(167, 243, 208))
    d.text((px + 28, y + 32), "₹25,000", font=get_font(28, bold=True), fill=(255, 255, 255))
    d.text((px + 155, y + 44), "/ Academic Year 2026-27", font=get_font(10, bold=False), fill=(209, 250, 229))
    d.text((px + 28, y + 74), "Status: Payment Completed · PFMS Cleared", font=get_font(10, bold=True), fill=(255, 255, 255))
    d.text((px + 28, y + 92), "Disbursed on: 15 August 2026 via NPCI APBS", font=get_font(9, bold=False), fill=(209, 250, 229))

    y += 128
    # Bank Account Mapping Card
    d.rounded_rectangle([px + 14, y, px + pw - 14, y + 104], radius=14, fill=(255, 255, 255), outline=(226, 232, 240))
    d.text((px + 26, y + 12), "Aadhaar Seeded Bank Account (APBS Linked)", font=get_font(11, bold=True), fill=(10, 37, 64))
    
    bank_fields = [
        ("Bank Name:", "State Bank of India"),
        ("Account No:", "XXXXXXXX4291 (Masked)"),
        ("IFSC Code:", "SBIN0001245"),
        ("NPCI Status:", "Active & Mapped to UIDAI XXXX-8921")
    ]
    by = y + 34
    for k, v in bank_fields:
        d.text((px + 26, by), k, font=get_font(9, bold=False), fill=(100, 116, 139))
        d.text((px + 110, by), v, font=get_font(9, bold=True), fill=(15, 23, 42))
        by += 16

    y += 118
    d.text((px + 16, y), "Transaction Passbook Record", font=get_font(11, bold=True), fill=(15, 23, 42))
    y += 18

    # Passbook Item
    d.rounded_rectangle([px + 14, y, px + pw - 14, y + 68], radius=12, fill=(255, 255, 255), outline=(226, 232, 240))
    d.text((px + 26, y + 10), "Post-Matric Scholarship (Installment 1)", font=get_font(11, bold=True), fill=(15, 23, 42))
    d.text((px + 26, y + 28), "PFMS ID: PFMS-MOTA-2026-98124", font=get_font(9, bold=False), fill=(100, 116, 139))
    d.text((px + 26, y + 46), "UTR: RBI20260815998124", font=get_font(9, bold=True), fill=(217, 119, 6))
    d.text((px + pw - 90, y + 18), "+₹25,000", font=get_font(14, bold=True), fill=(4, 120, 87))
    d.text((px + pw - 85, y + 42), "Completed", font=get_font(8, bold=True), fill=(22, 163, 74))

    return img

def make_frame_7_admin():
    img = Image.new("RGB", (800, 880), (15, 23, 42))
    d = ImageDraw.Draw(img)
    
    # Desktop Admin Dashboard Screen
    d.rectangle([0, 0, 800, 880], fill=(248, 250, 252))
    
    # Top Admin Bar
    d.rectangle([0, 0, 800, 56], fill=(10, 37, 64))
    d.text((24, 18), "Ministry of Tribal Affairs · National Officer Portal", font=get_font(14, bold=True), fill=(255, 255, 255))
    d.rounded_rectangle([640, 12, 776, 44], radius=8, fill=(245, 158, 11))
    d.text((654, 20), "MoTA Official: Admin", font=get_font(10, bold=True), fill=(10, 37, 64))

    # Tiranga strip
    d.rectangle([0, 56, 266, 60], fill=(255, 153, 51))
    d.rectangle([266, 56, 533, 60], fill=(255, 255, 255))
    d.rectangle([533, 56, 800, 60], fill=(19, 136, 8))

    y = 74
    # KPI row
    kpis = [
        ("Total Applications", "43,102", "+12.4% vs 2025", (10, 37, 64)),
        ("Total DBT Disbursed", "₹85.4 Cr", "100% PFMS APBS", (4, 120, 87)),
        ("Manual Review Cases", "381 Flagged", "Mismatches Safe", (217, 119, 6)),
        ("Coverage Rate", "78.0%", "Target: 95%", (67, 56, 202))
    ]
    kw = (800 - 48 - 36) // 4
    for i, (ktitle, kval, ksub, col) in enumerate(kpis):
        kx = 24 + i * (kw + 12)
        d.rounded_rectangle([kx, y, kx + kw, y + 68], radius=12, fill=(255, 255, 255), outline=(226, 232, 240))
        d.text((kx + 14, y + 10), ktitle, font=get_font(9, bold=True), fill=(100, 116, 139))
        d.text((kx + 14, y + 26), kval, font=get_font(16, bold=True), fill=col)
        d.text((kx + 14, y + 50), ksub, font=get_font(8, bold=False), fill=(148, 163, 184))

    y += 82
    # Coverage Gap Detection Callout Box
    d.rounded_rectangle([24, y, 776, y + 124], radius=14, fill=(255, 251, 235), outline=(253, 230, 138), width=2)
    d.text((40, y + 12), "Scholarship Coverage Gap Detection (UDISE+ · APAAR · AISHE)", font=get_font(13, bold=True), fill=(146, 64, 14))
    d.text((40, y + 32), "MoTA cross-references student enrollment records to detect uncovered ST students requiring proactive outreach:", font=get_font(9, bold=False), fill=(120, 53, 15))
    
    # 4 Gap Stats
    gw = (776 - 48) // 4
    gstats = [
        ("Total Enrolled ST", "10,000", "UDISE+ Registry"),
        ("Scholarship Beneficiaries", "7,800", "78% Covered"),
        ("Potentially Eligible", "2,200", "Coverage Gap!"),
        ("Incomplete Apps", "840", "Missing Docs")
    ]
    for i, (gtitle, gval, gsub) in enumerate(gstats):
        gx = 40 + i * gw
        d.text((gx, y + 56), gtitle, font=get_font(9, bold=True), fill=(180, 83, 9))
        d.text((gx, y + 74), gval, font=get_font(16, bold=True), fill=(146, 64, 14))
        d.text((gx, y + 98), gsub, font=get_font(8, bold=False), fill=(217, 119, 6))

    y += 138
    # District Table Section
    d.text((24, y), "District Coverage Gap Heatmap & Manual Review Queue", font=get_font(13, bold=True), fill=(15, 23, 42))
    y += 20

    # Table Header
    d.rounded_rectangle([24, y, 776, y + 32], radius=8, fill=(241, 245, 249))
    d.text((36, y + 10), "District / State", font=get_font(9, bold=True), fill=(71, 85, 105))
    d.text((220, y + 10), "Enrolled ST", font=get_font(9, bold=True), fill=(71, 85, 105))
    d.text((330, y + 10), "Beneficiaries", font=get_font(9, bold=True), fill=(71, 85, 105))
    d.text((450, y + 10), "Gap (Eligible)", font=get_font(9, bold=True), fill=(71, 85, 105))
    d.text((570, y + 10), "Coverage %", font=get_font(9, bold=True), fill=(71, 85, 105))
    d.text((670, y + 10), "Priority Action", font=get_font(9, bold=True), fill=(71, 85, 105))
    y += 36

    districts = [
        ("Sonbhadra, Uttar Pradesh", "10,000", "7,800", "2,200", "78.0%", "HIGH (CSC Camps)", (225, 29, 72)),
        ("Bastar, Chhattisgarh", "14,500", "11,200", "3,300", "77.2%", "HIGH (Ashram Camps)", (225, 29, 72)),
        ("Mayurbhanj, Odisha", "18,200", "15,100", "3,100", "83.0%", "HIGH (Tribal Drive)", (225, 29, 72)),
        ("Ranchi, Jharkhand", "16,800", "13,400", "3,400", "79.8%", "HIGH (ITI/Polytechnic)", (225, 29, 72)),
        ("Wayanad, Kerala", "6,400", "5,600", "800", "87.5%", "MEDIUM", (217, 119, 6)),
        ("Dahod, Gujarat", "12,000", "9,800", "2,200", "81.7%", "MEDIUM", (217, 119, 6)),
    ]

    for dname, denr, dben, dgap, dcov, dact, dcol in districts:
        d.rounded_rectangle([24, y, 776, y + 36], radius=6, fill=(255, 255, 255), outline=(241, 245, 249))
        d.text((36, y + 10), dname, font=get_font(9, bold=True), fill=(15, 23, 42))
        d.text((220, y + 10), denr, font=get_font(9, bold=False), fill=(71, 85, 105))
        d.text((330, y + 10), dben, font=get_font(9, bold=True), fill=(4, 120, 87))
        d.text((450, y + 10), dgap, font=get_font(9, bold=True), fill=(180, 83, 9))
        d.text((570, y + 10), dcov, font=get_font(9, bold=True), fill=(10, 37, 64))
        
        # Badge
        d.rounded_rectangle([666, y + 6, 766, y + 28], radius=6, fill=(255, 241, 242) if "HIGH" in dact else (254, 243, 199))
        d.text((674, y + 10), dact[:12], font=get_font(8, bold=True), fill=dcol)
        y += 40

    return img

def main():
    print("Generating animated GIF walkthrough frames...")
    f1 = make_frame_1_dashboard()
    f2 = make_frame_2_conflict()
    f3 = make_frame_3_timeline()
    f4 = make_frame_4_wallet()
    f5 = make_frame_5_jago()
    f6 = make_frame_6_dbt()
    f7 = make_frame_7_admin()

    frames = [f1, f2, f3, f4, f5, f6, f7]
    durations = [2800, 2600, 2600, 2600, 2800, 2600, 3200]

    out_path = "demo_walkthrough.gif"
    frames[0].save(
        out_path,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        optimize=True
    )
    print(f"Animated GIF created successfully at: {os.path.abspath(out_path)}")

    # Also save to artifact directory
    artifact_dir = "C:/Users/dell/.gemini/antigravity/brain/65772e73-9f38-4a02-968c-bbc2db3cd4d7"
    if os.path.exists(artifact_dir):
        art_path = os.path.join(artifact_dir, "demo_walkthrough.gif")
        frames[0].save(
            art_path,
            save_all=True,
            append_images=frames[1:],
            duration=durations,
            loop=0,
            optimize=True
        )
        print(f"Also saved to artifact directory: {art_path}")

if __name__ == "__main__":
    main()
