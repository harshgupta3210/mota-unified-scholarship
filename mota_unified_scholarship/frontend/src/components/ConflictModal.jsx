import React from "react";
import { AlertTriangle, ShieldAlert, X, ExternalLink } from "lucide-react";

export default function ConflictModal({ isOpen, onClose, targetSchemeName, language }) {
  if (!isOpen) return null;
  const isHi = language === "hi";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-amber-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Warning Banner Header */}
        <div className="bg-amber-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">
                {isHi ? "योजना टकराव चेतावनी (Scheme Conflict)" : "Scheme Conflict Detected"}
              </h3>
              <p className="text-[11px] text-amber-100">
                MoTA Dual Beneficiary Restriction Rule
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-amber-100 hover:text-white hover:bg-black/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 leading-relaxed font-medium">
              {isHi ? (
                <span>
                  "आप वर्तमान में <strong>पोस्ट-मैट्रिक छात्रवृत्ति</strong> प्राप्त कर रहे हैं। <strong>{targetSchemeName}</strong> के लिए आवेदन करने से पहले कृपया पात्रता नियमों की जांच करें।"
                </span>
              ) : (
                <span>
                  "You are currently receiving <strong>Post-Matric Scholarship</strong>. Please check the eligibility rules before applying for another scholarship."
                </span>
              )}
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-800">
              {isHi ? "जनजातीय कार्य मंत्रालय (MoTA) दिशानिर्देश:" : "Ministry of Tribal Affairs Guidelines:"}
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-500">
              <li>
                {isHi 
                  ? "एक विद्यार्थी एक ही शैक्षणिक वर्ष में केवल एक केंद्र प्रायोजित छात्रवृत्ति योजना का लाभ प्राप्त कर सकता है।"
                  : "A Scheduled Tribe student can avail only ONE centrally sponsored scholarship/fellowship scheme concurrently."}
              </li>
              <li>
                {isHi 
                  ? "यदि आप उच्च मूल्य वाली योजना (जैसे टॉप क्लास या एनओएस) में चयनित होते हैं, तो पूर्व छात्रवृत्ति स्वतः समाप्त की जाएगी।"
                  : "If selected for a higher-tier scheme (e.g., Top Class or NOS), your prior scholarship benefit will transition automatically."}
              </li>
            </ul>
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition"
            >
              {isHi ? "वापस जाएं" : "Understand & Return"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition"
            >
              <span>{isHi ? "दिशानिर्देश पढ़ें" : "Scheme Rules"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
