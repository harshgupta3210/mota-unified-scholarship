import React, { useState } from "react";
import { 
  GraduationCap, 
  CheckCircle2, 
  HelpCircle, 
  Calendar, 
  FileText, 
  IndianRupee, 
  ArrowRight, 
  ShieldAlert 
} from "lucide-react";

export default function SchemesList({ 
  schemes, 
  onApplyScheme, 
  language 
}) {
  const isHi = language === "hi";
  const [selectedScheme, setSelectedScheme] = useState(null);
  
  // Eligibility Wizard State
  const [calcIncome, setCalcIncome] = useState(180000);
  const [hasPremierAdmit, setHasPremierAdmit] = useState(true);
  const [hasNetJrf, setHasNetJrf] = useState(false);
  const [hasForeignOffer, setHasForeignOffer] = useState(false);

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          {isHi ? "जनजातीय कार्य मंत्रालय (MoTA) की 5 छात्रवृत्ति योजनाएं" : "Ministry of Tribal Affairs Schemes"}
        </h2>
        <p className="text-xs text-slate-500">
          {isHi 
            ? "अनुसूचित जनजाति (एसटी) छात्रों के लिए स्कूल से लेकर विदेशी उच्च शिक्षा तक के 5 राष्ट्रीय कार्यक्रम" 
            : "5 flagship national scholarship and fellowship schemes from secondary to overseas doctorate"}
        </p>
      </div>

      {/* Interactive Eligibility Wizard Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-4 shadow-sm border border-blue-800">
        <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>{isHi ? "पात्रता चेकर कैलकुलेटर" : "Instant Eligibility Checker"}</span>
        </div>
        <p className="text-xs text-blue-100 mb-3">
          {isHi ? "अपनी पारिवारिक वार्षिक आय दर्ज करें और तुरंत देखें कि आप किन योजनाओं के लिए पात्र हैं:" : "Enter your family annual income to check real-time eligibility across schemes:"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-xs">
          <div>
            <label className="text-[11px] text-blue-200 block mb-1">
              {isHi ? "वार्षिक पारिवारिक आय (Annual Income):" : "Annual Family Income:"}
            </label>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-bold text-amber-300">
                ₹{Number(calcIncome).toLocaleString("en-IN")}
              </span>
              <input
                type="range"
                min="50000"
                max="800000"
                step="25000"
                value={calcIncome}
                onChange={(e) => setCalcIncome(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center text-[11px]">
            <label className="flex items-center space-x-1.5 cursor-pointer bg-white/10 px-2 py-1 rounded-md">
              <input 
                type="checkbox" 
                checked={hasPremierAdmit} 
                onChange={(e) => setHasPremierAdmit(e.target.checked)} 
                className="text-amber-500 rounded" 
              />
              <span>{isHi ? "IIT/IIM/NIT प्रवेश" : "Premier Institute (IIT/NIT)"}</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer bg-white/10 px-2 py-1 rounded-md">
              <input 
                type="checkbox" 
                checked={hasNetJrf} 
                onChange={(e) => setHasNetJrf(e.target.checked)} 
                className="text-amber-500 rounded" 
              />
              <span>{isHi ? "UGC NET-JRF योग्य" : "NET / JRF Qualified"}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Schemes Cards List */}
      <div className="space-y-3.5">
        {schemes.map((s) => {
          // Dynamic calculation based on rules
          let isEligible = false;
          let reason = "";

          if (s.code === "PRE_MATRIC") {
            isEligible = calcIncome <= 250000;
            reason = isEligible ? "Class IX-X ST students with Income <= ₹2.5L" : "Income exceeds ₹2.5L limit";
          } else if (s.code === "POST_MATRIC") {
            isEligible = calcIncome <= 250000;
            reason = isEligible ? "Higher education ST students with Income <= ₹2.5L" : "Income exceeds ₹2.5L limit";
          } else if (s.code === "TOP_CLASS") {
            isEligible = calcIncome <= 600000 && hasPremierAdmit;
            reason = isEligible ? "Premier institute admission verified & Income <= ₹6.0L" : "Requires premier admit & income <= ₹6.0L";
          } else if (s.code === "NFST") {
            isEligible = hasNetJrf;
            reason = isEligible ? "Qualified UGC/CSIR-NET JRF for regular Ph.D" : "Requires UGC/CSIR NET-JRF scorecard";
          } else if (s.code === "NOS") {
            isEligible = calcIncome <= 600000 && hasForeignOffer;
            reason = isEligible ? "Top 500 QS foreign university offer & Income <= ₹6.0L" : "Requires top-500 foreign offer letter";
          }

          return (
            <div
              key={s.code}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {isHi ? (s.name_hi || s.name) : s.name}
                      </h3>
                    </div>
                    <span className="inline-block text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md mt-1">
                      {s.level}
                    </span>
                  </div>
                </div>

                {/* Eligibility Pill */}
                <div className="self-end sm:self-auto">
                  {isEligible ? (
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isHi ? "पात्र (Eligible)" : "Eligible"}</span>
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full">
                      {isHi ? "शर्तें अधूरी" : "Check Criteria"}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                {isHi ? (s.description_hi || s.description) : s.description}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    {isHi ? "अधिकतम सहायता" : "Max Assistance"}
                  </span>
                  <span className="font-bold text-slate-800 text-[11px] sm:text-xs">
                    {s.max_amount_display}
                  </span>
                </div>

                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    {isHi ? "आय सीमा" : "Income Ceiling"}
                  </span>
                  <span className="font-bold text-slate-800 text-[11px] sm:text-xs">
                    {s.income_limit_display}
                  </span>
                </div>

                <div className="bg-slate-50 p-2 rounded-lg col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    {isHi ? "महत्वपूर्ण तिथि" : "Key Date"}
                  </span>
                  <span className="font-bold text-slate-800 text-[11px] sm:text-xs flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{s.important_dates}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-3 pt-2">
                <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.required_documents.length} {isHi ? "दस्तावेज़ आवश्यक" : "Documents Required"}</span>
                </div>

                <button
                  onClick={() => onApplyScheme(s)}
                  className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-xs transition"
                >
                  <span>{isHi ? "आवेदन करें" : "Apply Now"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
