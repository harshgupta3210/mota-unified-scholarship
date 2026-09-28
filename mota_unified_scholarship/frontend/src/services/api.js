import { 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_SCHEMES, 
  INITIAL_APPLICATIONS, 
  INITIAL_DOCUMENTS, 
  INITIAL_PAYMENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_COVERAGE_GAP 
} from "./mockData";

const API_BASE_URL = "http://localhost:8000/api";

function getAuthHeader() {
  const token = localStorage.getItem("mota_token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Backend fetch failed for ${endpoint}: ${err.message}. Using client-side state/mock fallback.`);
    throw err;
  }
}

export const apiService = {
  // Auth
  async sendOtp(mobileOrEmail) {
    try {
      return await request("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ mobile_or_email: mobileOrEmail }),
      });
    } catch {
      return { success: true, demo_otp: "123456", message: "Demo OTP: 123456" };
    }
  },

  async verifyOtp(mobileOrEmail, otp) {
    try {
      const data = await request("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ mobile_or_email: mobileOrEmail, otp }),
      });
      if (data.access_token) {
        localStorage.setItem("mota_token", data.access_token);
      }
      return data;
    } catch {
      localStorage.setItem("mota_token", "mock_demo_jwt_token_2026");
      return {
        access_token: "mock_demo_jwt_token_2026",
        user: {
          id: 1,
          full_name: "Demo ST Student",
          role: "student",
          institution: "Demo Government College",
          is_pvtg: true,
        },
      };
    }
  },

  async getProfile() {
    try {
      return await request("/students/profile");
    } catch {
      return INITIAL_STUDENT_PROFILE;
    }
  },

  // Scholarships
  async getSchemes() {
    try {
      return await request("/scholarships");
    } catch {
      return INITIAL_SCHEMES;
    }
  },

  async checkEligibility(params) {
    try {
      return await request("/scholarships/check-eligibility", {
        method: "POST",
        body: JSON.stringify(params),
      });
    } catch {
      const isEligible = params.annual_income <= (params.scheme_code === "TOP_CLASS" ? 600000 : 250000);
      return {
        scheme_code: params.scheme_code,
        is_eligible: isEligible,
        status: isEligible ? "Eligible" : "Not Eligible",
        reasons: isEligible ? ["All criteria satisfied."] : ["Income or educational criteria not met."],
      };
    }
  },

  // Applications
  async getApplications() {
    try {
      return await request("/applications");
    } catch {
      return INITIAL_APPLICATIONS;
    }
  },

  async checkConflict(schemeCode) {
    try {
      return await request("/applications/check-conflict", {
        method: "POST",
        body: JSON.stringify({ scheme_code: schemeCode }),
      });
    } catch {
      if (schemeCode !== "POST_MATRIC") {
        return {
          has_conflict: true,
          warning_message: "You are currently receiving Post-Matric Scholarship. Please check the eligibility rules before applying for another scholarship.",
        };
      }
      return { has_conflict: false };
    }
  },

  async submitApplication(data) {
    try {
      return await request("/applications/submit", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch {
      return {
        success: true,
        application_id: Date.now(),
        application_number: `MOTA-${data.scheme_code.slice(0, 2)}-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        message: "Application submitted successfully!",
      };
    }
  },

  async resolveDeficiency(appId, payload) {
    try {
      return await request(`/applications/${appId}/resolve-deficiency`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      return { success: true, message: "Deficiency rectified and resubmitted for verification!" };
    }
  },

  // Documents Wallet & DigiLocker
  async getDocuments() {
    try {
      return await request("/documents");
    } catch {
      return INITIAL_DOCUMENTS;
    }
  },

  async pullFromDigiLocker(docType) {
    try {
      return await request("/documents/digilocker-pull", {
        method: "POST",
        body: JSON.stringify({ doc_type: docType }),
      });
    } catch {
      return {
        success: true,
        message: `Successfully fetched ${docType} from DigiLocker!`,
        document: {
          id: Date.now(),
          doc_name: `${docType} (DigiLocker Verified)`,
          verification_status: "Verified",
          digilocker_uri: `in.gov.edistrict:${Math.floor(10000 + Math.random() * 90000)}`,
        },
      };
    }
  },

  // Payments & DBT
  async getPayments() {
    try {
      return await request("/payments");
    } catch {
      return INITIAL_PAYMENTS;
    }
  },

  async getDbtStatus() {
    try {
      return await request("/payments/dbt-status");
    } catch {
      return {
        is_dbt_enabled: true,
        aadhaar_seeded: true,
        aadhaar_masked: "XXXX-XXXX-8921",
        bank_name: "State Bank of India",
        bank_account_masked: "XXXXXXXX4291",
        ifsc_code: "SBIN0001245",
        npci_mapping_status: "Active & Linked (Direct Benefit Transfer Ready)",
      };
    }
  },

  // JAGO AI Chatbot
  async queryJago(query, language = "en") {
    try {
      return await request("/chatbot/query", {
        method: "POST",
        body: JSON.stringify({ query, language }),
      });
    } catch {
      const isHi = language === "hi";
      return {
        query,
        language,
        response: isHi
          ? "नमस्ते! आपका पोस्ट-मैट्रिक छात्रवृत्ति का ₹25,000 का भुगतान 15 अगस्त 2026 को सफलतापूर्वक पूरा हो चुका है। टॉप क्लास आवेदन में आय प्रमाण पत्र नवीनीकरण की आवश्यकता है।"
          : "Hello! Your Post-Matric Scholarship payment of ₹25,000 was disbursed on 15 August 2026. Your Top Class Scholarship requires a renewed Income Certificate.",
        suggested_actions: ["Check Application Timeline", "Resolve Deficiency in Wallet"],
        timestamp: "04:15 PM",
      };
    }
  },

  // Notifications
  async getNotifications() {
    try {
      return await request("/notifications");
    } catch {
      return { unread_count: 2, notifications: INITIAL_NOTIFICATIONS };
    }
  },

  // Coverage Gap Analytics & Admin
  async getCoverageGap() {
    try {
      return await request("/analytics/coverage-gap");
    } catch {
      return INITIAL_COVERAGE_GAP;
    }
  },

  async getAdminStats() {
    try {
      return await request("/admin/stats");
    } catch {
      return {
        overview: {
          total_applications: 43102,
          pending_verification: 1422,
          manual_review_cases: 381,
          deficiencies: 891,
          approved_applications: 38201,
          rejected_applications: 2210,
          total_disbursed_cr: "₹85.4 Cr",
          active_academic_year: "2026-27",
        },
      };
    }
  },

  async performAdminAction(appId, action, remarks) {
    try {
      return await request(`/admin/applications/${appId}/action`, {
        method: "POST",
        body: JSON.stringify({ action, remarks }),
      });
    } catch {
      return { success: true, message: `Application updated to ${action}!` };
    }
  },
};
