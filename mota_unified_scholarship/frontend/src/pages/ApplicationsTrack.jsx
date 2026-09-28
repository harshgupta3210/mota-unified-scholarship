import React, { useState } from "react";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  CreditCard, 
  Download 
} from "lucide-react";

export default function ApplicationsTrack({ 
  applications, 
  onResolveDeficiency, 
  language 
}) {
  const isHi = language === "hi";
  
  // Active selected application for detail timeline view
  const [selectedAppId, setSelectedAppId] = useState(
    applications.find(a => a.has_active_application)?.id || applications[0]?.id
  );

  const activeApp = applications.find(a => a.id === selectedAppId) || applications[0];

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          {isHi ? "आवेदन प्रगति एवं 7-चरणीय समय-सीमा" : "Application Tracking & 7-Stage Timeline"}
        </h2>
        <p className="text-xs text-slate-500">
          {isHi 
            ? "आवेदन जमा करने से लेकर बैंक खाते में डीबीटी भुगतान तक की पारदर्शी स्थिति" 
            : "End-to-end transparent verification pipeline from submission to DBT transfer"}
        </p>
      </div>

      {/* Application Switcher Pills */}
      <div className="flex space-x-2 overflow-x-auto pb-1">
        {applications.filter(a => a.has_active_application).map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedAppId(app.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedAppId === app.id
                ? "bg-blue-900 text-white border-blue-900 shadow-xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span>{app.scheme_code}</span>
            <span className="ml-1.5 opacity-80 font-mono text-[10px]">
              ({app.application_status})
            </span>
          </button>
        ))}
      </div>

      {activeApp && (
        <div className="space-y-4">
          
          {/* Active Application Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                  {isHi ? "आवेदन संदर्भ संख्या" : "Application Reference No."}
                </span>
                <span className="font-mono text-sm font-bold text-blue-950">
                  {activeApp.application_number}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                  {isHi ? (activeApp.scheme_name_hi || activeApp.scheme_name) : activeApp.scheme_name}
                </h3>
              </div>

              <div className="text-right">
                {activeApp.application_status === "Payment Completed" && (
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full inline-flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isHi ? "₹25,000 भुगतान संपन्न" : "₹25,000 Disbursed"}</span>
                  </span>
                )}
                {activeApp.application_status === "Deficiency" && (
                  <span className="bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold px-3 py-1 rounded-full inline-flex items-center space-x-1 animate-pulse">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{isHi ? "कार्रवाई आवश्यक (Deficiency)" : "Action Required"}</span>
                  </span>
                )}
                {activeApp.application_status === "Under Verification" && (
                  <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full inline-flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{isHi ? "सत्यापन प्रक्रियाधीन" : "Under Verification"}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Deficiency Resolution Callout */}
            {activeApp.application_status === "Deficiency" && (
              <div className="mt-3 bg-rose-50 border border-rose-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-rose-950">
                    <span className="font-bold block">
                      {isHi ? "त्रुटि: आय प्रमाण पत्र नवीनीकरण आवश्यक" : "Deficiency: Income Certificate Renewal"}
                    </span>
                    <span className="text-[11px] text-rose-800 italic">
                      {activeApp.deficiency_remarks}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onResolveDeficiency(activeApp)}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition shrink-0"
                >
                  {isHi ? "अभी सुधार करें" : "Resolve Deficiency"}
                </button>
              </div>
            )}
          </div>

          {/* 7-Stage Visual Timeline Stepper */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              {isHi ? "आधिकारिक सत्यापन एवं डीबीटी प्रवाह (7 चरण):" : "Official Verification & DBT Stages (7 Steps):"}
            </h4>

            <div className="space-y-4 relative">
              {/* Connecting line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200 -z-0" />

              {(activeApp.stages || []).map((stage, idx) => {
                const isCompleted = stage.status === "completed";
                const isDeficiency = stage.status === "deficiency";
                const isInProgress = stage.status === "in_progress";
                const isPending = stage.status === "pending";

                return (
                  <div key={stage.stage_number} className="relative flex items-start space-x-3.5 z-10">
                    
                    {/* Stage Number / Status Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs shadow-xs transition ${
                      isCompleted 
                        ? "bg-emerald-600 text-white ring-4 ring-emerald-50" 
                        : isDeficiency 
                        ? "bg-rose-600 text-white ring-4 ring-rose-50 animate-bounce" 
                        : isInProgress 
                        ? "bg-amber-500 text-white ring-4 ring-amber-50" 
                        : "bg-slate-100 text-slate-400 border border-slate-300"
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stage.stage_number}
                    </div>

                    {/* Stage Details */}
                    <div className="flex-1 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h5 className={`text-xs font-bold ${
                          isDeficiency ? "text-rose-700" : isCompleted ? "text-slate-900" : "text-slate-700"
                        }`}>
                          {isHi ? (stage.stage_name_hi || stage.stage_name) : stage.stage_name}
                        </h5>
                        
                        {stage.completed_at && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            {stage.completed_at}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {stage.description}
                      </p>

                      {isDeficiency && (
                        <div className="mt-2 text-[10px] text-rose-800 font-bold flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          <span>Action required: Upload valid 2026-27 certificate</span>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
