import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  MapPin, 
  BarChart3, 
  TrendingUp, 
  Search, 
  Check, 
  X, 
  ArrowRight, 
  Building2, 
  HelpCircle 
} from "lucide-react";
import { apiService } from "../services/api";

export default function AdminDashboard({ language }) {
  const isHi = language === "hi";
  const [activeAdminTab, setActiveAdminTab] = useState("coverage_gap"); // "coverage_gap" or "manual_queue" or "schemes"
  
  // Data state
  const [stats, setStats] = useState({
    overview: {
      total_applications: 43102,
      pending_verification: 1422,
      manual_review_cases: 381,
      deficiencies: 891,
      approved_applications: 38201,
      rejected_applications: 2210,
      total_disbursed_cr: "₹85.4 Cr",
      active_academic_year: "2026-27"
    }
  });

  const [coverageData, setCoverageData] = useState(null);
  const [manualQueue, setManualQueue] = useState([
    {
      id: 2,
      app_num: "MOTA-TC-2026-90412",
      student_name: "Demo ST Student",
      course: "MCA (Year 1)",
      scheme: "Top Class Education Scheme",
      institution: "Demo Government College",
      flag_reason: "Income certificate expired on 31-March-2026. Tehsildar seal year discrepancy.",
      source: "State Revenue API",
      status: "Manual Review",
      applied_date: "15 Sep 2026"
    },
    {
      id: 104,
      app_num: "MOTA-NF-2026-11892",
      student_name: "Rameshwar Uraon",
      course: "Ph.D Anthropology",
      scheme: "National Fellowship (NFST)",
      institution: "Ranchi University",
      flag_reason: "NET-JRF Roll Number verified, but Guide Allocation Certificate pending signature.",
      source: "UGC / NTA Portal",
      status: "Manual Review",
      applied_date: "18 Sep 2026"
    },
    {
      id: 105,
      app_num: "MOTA-NO-2026-00412",
      student_name: "Anita Bhagat",
      course: "M.Sc Data Science",
      scheme: "National Overseas Scholarship (NOS)",
      institution: "University of Edinburgh (Top 50 QS)",
      flag_reason: "Foreign Unconditional Offer Letter verified. GRE Scorecard re-validation in progress.",
      source: "NOS Foreign Cell",
      status: "Manual Review",
      applied_date: "20 Sep 2026"
    }
  ]);

  const [actionNotice, setActionNotice] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const gap = await apiService.getCoverageGap();
        setCoverageData(gap);
      } catch (e) {
        console.error("Failed to load coverage gap", e);
      }
    }
    loadData();
  }, []);

  const handleManualAction = (item, action) => {
    setManualQueue(prev => prev.filter(q => q.id !== item.id));
    setActionNotice({
      app_num: item.app_num,
      action: action === "approve" ? "Approved & Forwarded to Sanction" : action === "deficiency" ? "Deficiency Notice Sent to Student" : "Rejected with Reason"
    });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const summary = coverageData?.summary || {
    total_enrolled_st: 10000,
    scholarship_beneficiaries: 7800,
    potentially_eligible: 2200,
    incomplete_applications: 840,
    coverage_percentage: 78.0
  };

  return (
    <div className="space-y-5">
      
      {/* Admin Portal Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 border border-purple-900/50 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              MoTA Official Central Portal
            </span>
            <span className="text-xs text-slate-300">
              {isHi ? "जनजातीय कार्य मंत्रालय, भारत सरकार" : "Ministry of Tribal Affairs, Govt. of India"}
            </span>
          </div>
          <h2 className="text-base sm:text-xl font-bold mt-1">
            {isHi ? "अधिकारी निगरानी एवं कवरेज-गैप डैशबोर्ड" : "Tribal Scholarship Oversight & Coverage Gap Portal"}
          </h2>
          <p className="text-xs text-purple-200 mt-0.5">
            UDISE+ · APAAR · AISHE National Verification & Direct Benefit Transfer Monitoring
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white/10 p-1 rounded-xl text-xs font-semibold self-stretch sm:self-auto justify-around">
          <button
            onClick={() => setActiveAdminTab("coverage_gap")}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeAdminTab === "coverage_gap" ? "bg-white text-purple-950 shadow-xs" : "text-purple-200 hover:text-white"
            }`}
          >
            {isHi ? "कवरेज-गैप विश्लेषण" : "Coverage Gap Analytics"}
          </button>
          <button
            onClick={() => setActiveAdminTab("manual_queue")}
            className={`px-3 py-1.5 rounded-lg transition relative ${
              activeAdminTab === "manual_queue" ? "bg-white text-purple-950 shadow-xs" : "text-purple-200 hover:text-white"
            }`}
          >
            <span>{isHi ? "मैन्युअल समीक्षा कतार" : "Manual Review Queue"}</span>
            {manualQueue.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px]">
                {manualQueue.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl p-3 text-xs flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              Application <strong>{actionNotice.app_num}</strong>: {actionNotice.action}
            </span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono">AUDIT LOG RECORDED</span>
        </div>
      )}

      {/* Top Ministry KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            {isHi ? "कुल प्राप्त आवेदन" : "Total Applications"}
          </span>
          <span className="text-lg sm:text-xl font-black text-slate-900 mt-1 block">
            {stats.overview.total_applications.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
            ↑ 12.4% vs 2025-26
          </span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            {isHi ? "कुल डीबीटी वितरण" : "Total Disbursed (DBT)"}
          </span>
          <span className="text-lg sm:text-xl font-black text-emerald-700 mt-1 block">
            {stats.overview.total_disbursed_cr}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            100% PFMS Aadhaar Bridge
          </span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            {isHi ? "मैन्युअल समीक्षा मामले" : "Manual Review Cases"}
          </span>
          <span className="text-lg sm:text-xl font-black text-amber-700 mt-1 block">
            {manualQueue.length} Active
          </span>
          <span className="text-[10px] text-amber-800 mt-0.5 block">
            Mismatches routed safely
          </span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            {isHi ? "स्वीकृति दर" : "Sanction Approval Rate"}
          </span>
          <span className="text-lg sm:text-xl font-black text-blue-900 mt-1 block">
            88.6%
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            Target: 95%
          </span>
        </div>
      </div>

      {/* VIEW 1: COVERAGE GAP DETECTION ANALYTICS */}
      {activeAdminTab === "coverage_gap" && (
        <div className="space-y-4">
          
          {/* Problem Statement Specific Example Callout */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-amber-700" />
              <h3 className="text-sm font-bold text-slate-900">
                {isHi ? "छात्रवृत्ति कवरेज गैप पहचान (Coverage Gap Detection)" : "Scholarship Coverage Gap Detection (MoTA Analytics)"}
              </h3>
            </div>
            
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              {isHi 
                ? "UDISE+, APAAR एवं उच्च शिक्षा AISHE डेटाबेस से तुलना करके उन एसटी छात्रों की पहचान की जाती है जो नामांकित हैं परंतु छात्रवृत्ति प्राप्त नहीं कर रहे हैं:"
                : "Cross-referencing central UDISE+, APAAR and AISHE enrollment registries to detect ST students enrolled in educational institutes who are not receiving scholarship benefits:"}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-xl border border-amber-200/80 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  {isHi ? "कुल नामांकित एसटी छात्र" : "Total Enrolled ST Students"}
                </span>
                <span className="text-base sm:text-lg font-black text-slate-800">
                  {summary.total_enrolled_st.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block font-mono">Source: UDISE+ / AISHE</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  {isHi ? "वर्तमान छात्रवृत्ति लाभार्थी" : "Scholarship Beneficiaries"}
                </span>
                <span className="text-base sm:text-lg font-black text-emerald-700">
                  {summary.scholarship_beneficiaries.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-800 block">78.0% Covered</span>
              </div>

              <div className="bg-amber-50/80 p-2 rounded-lg border border-amber-200">
                <span className="text-[10px] text-amber-800 uppercase font-bold block">
                  {isHi ? "संभावित पात्र (गैप)" : "Potentially Eligible (Gap)"}
                </span>
                <span className="text-base sm:text-lg font-black text-amber-800">
                  {summary.potentially_eligible.toLocaleString()}
                </span>
                <span className="text-[10px] text-amber-900 font-semibold block">Requires Outreach</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  {isHi ? "अपूर्ण आवेदन" : "Incomplete Applications"}
                </span>
                <span className="text-base sm:text-lg font-black text-rose-700">
                  {summary.incomplete_applications.toLocaleString()}
                </span>
                <span className="text-[10px] text-rose-800 block">Pending Documents</span>
              </div>
            </div>

            {/* Compliance Alert */}
            <div className="mt-3 flex items-start space-x-2 text-[11px] text-slate-600 bg-white/70 p-2 rounded-lg border border-amber-200/60">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>{isHi ? "नीति नियम:" : "Compliance Rule:"}</strong> {summary.compliance_note || "Students are classified as 'Potentially Eligible' pending verification of family income and institution enrollment."}
              </span>
            </div>
          </div>

          {/* District-Wise Coverage Heatmap Table */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {isHi ? "ज़िला-वार कवरेज विश्लेषण (District-Level Drilldown)" : "District-Level Scholarship Coverage Analysis"}
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">State / District</th>
                    <th className="py-2.5 px-3">Enrolled ST</th>
                    <th className="py-2.5 px-3">Beneficiaries</th>
                    <th className="py-2.5 px-3">Potentially Eligible</th>
                    <th className="py-2.5 px-3">Coverage %</th>
                    <th className="py-2.5 px-3">Outreach Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(coverageData?.districts || []).map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {d.district}, <span className="text-slate-500 text-[11px] font-normal">{d.state}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono">{d.total_enrolled_st.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{d.scholarship_beneficiaries.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-700">{d.potentially_eligible.toLocaleString()}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">{d.coverage_percentage}%</span>
                          <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${d.coverage_percentage}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          d.outreach_priority === "High" 
                            ? "bg-rose-100 text-rose-800" 
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {d.outreach_priority} Priority
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: MANUAL REVIEW QUEUE */}
      {activeAdminTab === "manual_queue" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isHi ? "स्वचालित बेमेल सत्यापन एवं मैन्युअल समीक्षा कतार" : "Automated Verification Mismatch & Manual Review Queue"}
              </h3>
              <p className="text-xs text-slate-500">
                {isHi 
                  ? "डेटा बेमेल होने पर छात्रों को सीधे खारिज न कर अधिकारी समीक्षा हेतु सुरक्षित रूप से भेजा जाता है" 
                  : "If automated verification fails or mismatches, applications are safely routed here instead of auto-rejection"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {manualQueue.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-purple-300 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 pb-2.5 border-b border-slate-100">
                  <div>
                    <span className="font-mono text-xs font-bold text-purple-950">
                      {item.app_num}
                    </span>
                    <h4 className="text-sm font-bold text-slate-800">
                      {item.student_name} · <span className="text-xs font-normal text-slate-500">{item.course}</span>
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      {item.institution} · {item.scheme}
                    </span>
                  </div>

                  <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Awaiting MoTA Officer Review</span>
                  </span>
                </div>

                {/* Flag Reason */}
                <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-3 text-xs text-rose-950">
                  <div className="flex items-center space-x-1.5 font-bold text-rose-900 mb-0.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Automated Verification Flag ({item.source}):</span>
                  </div>
                  <p className="italic text-rose-800">{item.flag_reason}</p>
                </div>

                {/* Officer Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleManualAction(item, "reject")}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center space-x-1 transition"
                  >
                    <X className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isHi ? "खारिज करें" : "Reject"}</span>
                  </button>

                  <button
                    onClick={() => handleManualAction(item, "deficiency")}
                    className="px-3 py-1.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold flex items-center space-x-1 transition"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>{isHi ? "त्रुटि सुधार मांगें" : "Request Deficiency"}</span>
                  </button>

                  <button
                    onClick={() => handleManualAction(item, "approve")}
                    className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center space-x-1 shadow-xs transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isHi ? "स्वीकृति दें (Approve)" : "Clear & Sanction"}</span>
                  </button>
                </div>

              </div>
            ))}

            {manualQueue.length === 0 && (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">
                  {isHi ? "सभी मैन्युअल समीक्षाएं पूरी हो चुकी हैं!" : "Manual Review Queue is Empty!"}
                </h4>
                <p className="text-xs">
                  All flagged verification cases have been resolved.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
