import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, Loader2, X, FileText, ArrowRight } from "lucide-react";

export default function DigiLockerModal({ isOpen, onClose, onDocumentFetched, language }) {
  const [selectedType, setSelectedType] = useState("Income Certificate");
  const [step, setStep] = useState(1); // 1: Select, 2: Fetching/Verifying, 3: Success
  const [progressMsg, setProgressMsg] = useState("");

  if (!isOpen) return null;
  const isHi = language === "hi";

  const docOptions = [
    { type: "Income Certificate", issuer: "State Revenue Department (UP e-District)", code: "INC/2026/RENEWED" },
    { type: "ST Certificate", issuer: "Tehsildar Robertsganj, Sonbhadra", code: "UP/SBD/ST/2023" },
    { type: "Marksheets", issuer: "Academic Bank of Credits / AKTU", code: "ABC/NAD/2025" },
    { type: "PVTG Certificate", issuer: "District Tribal Welfare Office", code: "PVTG/MOTA/041" },
    { type: "Domicile Certificate", issuer: "Sub-Divisional Magistrate", code: "DOM/2024/771" }
  ];

  const handleStartFetch = () => {
    setStep(2);
    setProgressMsg(isHi ? "डिजिलॉकर सुरक्षित गेटवे से कनेक्ट हो रहा है..." : "Connecting to DigiLocker OAuth Gateway...");

    setTimeout(() => {
      setProgressMsg(isHi ? "डिजिटल हस्ताक्षर एवं राज्य ई-डिस्ट्रिक्ट सत्यापन प्रगति पर..." : "Verifying Digital Signature via State e-District API...");
    }, 1200);

    setTimeout(() => {
      setProgressMsg(isHi ? "प्रमाण पत्र सफलतापूर्वक सत्यापित एवं एन्क्रिप्टेड!" : "Document Authenticated & Cryptographically Sealed!");
    }, 2400);

    setTimeout(() => {
      setStep(3);
    }, 3200);
  };

  const handleFinish = () => {
    onDocumentFetched(selectedType);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* DigiLocker Brand Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-xs tracking-wider border border-white/20">
              DL
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm tracking-wide">DigiLocker</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded font-medium">
                  Govt. Verified
                </span>
              </div>
              <p className="text-[11px] text-blue-200">
                {isHi ? "डिजिटल दस्तावेज़ वॉलेट एकीकरण" : "Simulated National Document Verification"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-blue-200 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="p-5">
          {step === 1 && (
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-800">
                  {isHi ? "डिजिलॉकर से जारी प्रमाण पत्र चुनें:" : "Select Official Certificate to Fetch:"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isHi ? "सीधे सरकारी डेटाबेस से डिजिटल रूप से हस्ताक्षरित दस्तावेज़ प्राप्त करें" : "Pull authentic, tamper-proof certificates directly from issuing authorities."}
                </p>
              </div>

              <div className="space-y-2 mb-5">
                {docOptions.map((opt) => (
                  <label
                    key={opt.type}
                    onClick={() => setSelectedType(opt.type)}
                    className={`flex items-start p-3 rounded-xl border cursor-pointer transition ${
                      selectedType === opt.type
                        ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-500"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="doc_type"
                      checked={selectedType === opt.type}
                      onChange={() => setSelectedType(opt.type)}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{opt.type}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{opt.code}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{opt.issuer}</p>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={handleStartFetch}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-sm transition"
              >
                <span>{isHi ? "डिजिलॉकर से दस्तावेज़ लाएँ" : "Fetch via DigiLocker API"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="py-8 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <Loader2 className="w-14 h-14 text-blue-600 animate-spin" />
                <ShieldCheck className="w-6 h-6 text-blue-900 absolute" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  {isHi ? "सत्यापन प्रक्रियाधीन है..." : "Automated Verification in Progress..."}
                </h4>
                <p className="text-xs text-blue-700 font-medium mt-1 animate-pulse">
                  {progressMsg}
                </p>
              </div>
              <div className="w-48 mx-auto bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-600 h-full animate-[marquee_2s_infinite]" style={{ width: "70%" }} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Verified & Synced
                </span>
                <h4 className="text-base font-bold text-slate-800 mt-2">
                  {selectedType}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  {isHi 
                    ? "दस्तावेज़ को डिजिटल हस्ताक्षर के साथ आपके वॉलेट में सुरक्षित रूप से जोड़ दिया गया है।" 
                    : "Certificate successfully pulled and cryptographically validated via DigiLocker Mock Service."}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Digital URI:</span>
                  <span className="font-mono text-slate-800 font-medium">in.gov.edistrict:99812</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Verification Status:</span>
                  <span className="text-emerald-700 font-bold">100% Genuine Match</span>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition"
              >
                {isHi ? "वॉलेट में देखें" : "View in Wallet"}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
