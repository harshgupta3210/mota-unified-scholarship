import React from "react";
import { 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  CreditCard, 
  Wallet, 
  MessageSquareCode, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  ArrowUpRight 
} from "lucide-react";

export default function Dashboard({ 
  profile, 
  applications, 
  onSelectScheme, 
  onResolveDeficiency, 
  onOpenWallet, 
  onOpenJago, 
  setActiveTab,
  language 
}) {
  const isHi = language === "hi";

  const getStatusBadge = (status) => {
    switch (status) {
      case "Payment Completed":
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {isHi ? "भुगतान संपन्न" : "Payment Completed"}</span>;
      case "Deficiency":
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse"><AlertCircle className="w-3 h-3" /> {isHi ? "त्रुटि सुधार आवश्यक" : "Deficiency"}</span>;
      case "Under Verification":
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> {isHi ? "सत्यापन प्रगति पर" : "Under Verification"}</span>;
      case "Sanctioned":
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> {isHi ? "स्वीकृत" : "Sanctioned"}</span>;
      case "Eligible":
      case "Not Applied":
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold px-2 py-0.5 rounded-full">{isHi ? "पात्र / खुला" : "Eligible"}</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded-full">{isHi ? "लागू नहीं" : "Not Applicable"}</span>;
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Student Welcome & Identity Verification Card */}
      <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 rounded-2xl text-white p-4 sm:p-5 shadow-md relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-md uppercase tracking-wider">
                {profile.st_category} · {profile.st_subcaste}
              </span>
              {profile.is_pvtg && (
                <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-md">
                  PVTG: {profile.pvtg_community}
                </span>
              )}
            </div>
            
            <h2 className="text-lg sm:text-xl font-bold mt-1.5 flex items-center space-x-2">
              <span>{profile.full_name}</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" title="Aadhaar & Caste Verified" />
            </h2>
            
            <p className="text-xs text-slate-300 mt-0.5 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{profile.course_name} · {profile.institution_name}</span>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-2.5 border border-white/10 text-right self-stretch sm:self-auto flex sm:flex-col justify-between items-center sm:items-end">
            <span className="text-[10px] text-slate-300 uppercase tracking-wider">
              {isHi ? "अपार छात्र आईडी" : "APAAR / DigiLocker ID"}
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-amber-300">
              {profile.apaar_id}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">
              ✓ Aadhaar: {profile.aadhaar_masked}
            </span>
          </div>
        </div>

        {/* Ambient decorative circle */}
        <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-3 gap-2">
        <button 
          onClick={onOpenJago}
          className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl p-2.5 text-left flex flex-col justify-between hover:shadow-xs transition group"
        >
          <div className="flex items-center justify-between text-amber-700">
            <MessageSquareCode className="w-5 h-5" />
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div className="mt-2">
            <span className="text-xs font-bold text-slate-900 block group-hover:text-amber-800">
              {isHi ? "जागो AI" : "Ask JAGO"}
            </span>
            <span className="text-[10px] text-slate-500">
              {isHi ? "सहायक" : "AI Assistant"}
            </span>
          </div>
        </button>

        <button 
          onClick={onOpenWallet}
          className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-2.5 text-left flex flex-col justify-between hover:shadow-xs transition group"
        >
          <Wallet className="w-5 h-5 text-blue-700" />
          <div className="mt-2">
            <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-900">
              {isHi ? "दस्तावेज़" : "DigiLocker"}
            </span>
            <span className="text-[10px] text-slate-500">
              {isHi ? "वॉलेट" : "Digital Wallet"}
            </span>
          </div>
        </button>

        <button 
          onClick={() => setActiveTab("payments")}
          className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 text-left flex flex-col justify-between hover:shadow-xs transition group"
        >
          <CreditCard className="w-5 h-5 text-emerald-700" />
          <div className="mt-2">
            <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-900">
              {isHi ? "डीबीटी" : "DBT Track"}
            </span>
            <span className="text-[10px] text-slate-500">
              {isHi ? "₹25,000 प्राप्त" : "₹25,000 Paid"}
            </span>
          </div>
        </button>
      </div>

      {/* Active Deficiency Alert Banner (if any) */}
      {applications.some(a => a.application_status === "Deficiency") && (
        <div className="bg-rose-50 border-l-4 border-rose-600 rounded-xl p-3 shadow-xs flex items-center justify-between">
          <div className="flex items-start space-x-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-950">
                {isHi ? "शीर्ष श्रेणी छात्रवृत्ति: आय प्रमाण पत्र सुधार आवश्यक" : "Top Class Scholarship: Action Required"}
              </h4>
              <p className="text-[11px] text-rose-800 mt-0.5">
                {isHi ? "आय प्रमाण पत्र की अवधि समाप्त हो चुकी है। कृपया नवीनीकृत प्रमाण पत्र संलग्न करें।" : "Income Certificate expired. Upload renewed certificate to resume verification."}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const defApp = applications.find(a => a.application_status === "Deficiency");
              onResolveDeficiency(defApp);
            }}
            className="shrink-0 ml-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition"
          >
            {isHi ? "सुधार करें" : "Resolve"}
          </button>
        </div>
      )}

      {/* Unified 5 Schemes Overview Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isHi ? "सभी 5 जनजातीय छात्रवृत्ति एवं फैलोशिप योजनाएं" : "Unified MoTA Schemes Directory"}
            </h3>
            <p className="text-[11px] text-slate-500">
              {isHi ? "एक ही डैशबोर्ड से सभी योजनाओं की स्थिति व पात्रता देखें" : "Single pane of glass across all 5 national schemes"}
            </p>
          </div>
          <button 
            onClick={() => setActiveTab("schemes")}
            className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>{isHi ? "सभी देखें" : "View All"}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {applications.map((app) => (
            <div
              key={app.scheme_code}
              onClick={() => onSelectScheme(app)}
              className="bg-white rounded-xl p-3.5 border border-slate-200 hover:border-slate-300 hover:shadow-xs transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  app.has_active_application 
                    ? "bg-blue-900 text-white shadow-xs" 
                    : "bg-slate-100 text-slate-500"
                }`}>
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {isHi ? (app.scheme_name_hi || app.scheme_name) : app.scheme_name}
                    </h4>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 mt-0.5">
                    <span>{app.max_amount_display}</span>
                    <span>·</span>
                    <span className="font-mono text-slate-600">
                      {app.application_number || (isHi ? "आवेदन नहीं किया" : "Not Applied")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {getStatusBadge(app.application_status)}
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
