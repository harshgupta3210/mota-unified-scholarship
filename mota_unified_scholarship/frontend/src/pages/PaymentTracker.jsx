import React from "react";
import { 
  CreditCard, 
  CheckCircle2, 
  Building2, 
  ArrowDownLeft, 
  ShieldCheck, 
  Receipt, 
  ExternalLink, 
  Clock 
} from "lucide-react";

export default function PaymentTracker({ 
  payments, 
  profile, 
  language 
}) {
  const isHi = language === "hi";
  const primaryPayment = payments[0] || {
    amount: 25000,
    amount_formatted: "₹25,000",
    payment_date: "15 August 2026",
    dbt_status: "Payment Completed",
    pfms_txn_id: "PFMS-MOTA-2026-98124",
    utr_no: "RBI20260815998124",
    bank_name: "State Bank of India",
    bank_account_masked: "XXXXXXXX4291",
    scheme_name: "Post-Matric Scholarship for ST Students"
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          {isHi ? "प्रत्यक्ष लाभ अंतरण (DBT) एवं भुगतान ट्रैकर" : "Direct Benefit Transfer (DBT) & Payment Tracking"}
        </h2>
        <p className="text-xs text-slate-500">
          {isHi 
            ? "PFMS एवं आधार पेमेंट ब्रिज सिस्टम (APBS) के माध्यम से सीधे बैंक खाते में भुगतान" 
            : "Real-time disbursement tracker via PFMS and NPCI Aadhaar Payment Bridge"}
        </p>
      </div>

      {/* Main DBT Disbursed Hero Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white rounded-2xl p-5 shadow-sm border border-emerald-800 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">
                {isHi ? "कुल प्राप्त छात्रवृत्ति" : "Total Disbursed Amount"}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 flex items-baseline space-x-1">
                <span>{primaryPayment.amount_formatted}</span>
                <span className="text-xs font-normal text-emerald-300">/ 2026-27</span>
              </div>
            </div>

            <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-xl px-2.5 py-1 text-xs font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isHi ? "डीबीटी संपन्न" : "DBT Completed"}</span>
            </div>
          </div>

          <p className="text-xs text-emerald-100 mt-2">
            {primaryPayment.scheme_name}
          </p>

          <div className="mt-4 pt-3 border-t border-emerald-800/80 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-emerald-300 block uppercase tracking-wider">
                {isHi ? "भुगतान तिथि" : "Credit Date"}
              </span>
              <span className="font-semibold text-white">
                {primaryPayment.payment_date}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-emerald-300 block uppercase tracking-wider">
                {isHi ? "PFMS संदर्भ संख्या" : "PFMS Txn ID"}
              </span>
              <span className="font-mono text-white text-[11px]">
                {primaryPayment.pfms_txn_id}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] text-emerald-300 block uppercase tracking-wider">
                {isHi ? "आरबीआई यूटीआर (UTR)" : "Bank UTR Number"}
              </span>
              <span className="font-mono text-amber-300 text-[11px]">
                {primaryPayment.utr_no}
              </span>
            </div>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Aadhaar Seeded Bank Account Verification Status */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-blue-900" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {isHi ? "आधार से जुड़ा बैंक खाता (NPCI APBS)" : "Aadhaar-Seeded Bank Account (NPCI APBS)"}
            </h4>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Active & Seeded</span>
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>{isHi ? "बैंक का नाम:" : "Bank Name:"}</span>
            <span className="font-bold text-slate-900">{primaryPayment.bank_name}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>{isHi ? "खाता संख्या (सुरक्षित मास्क):" : "Account Number (Masked):"}</span>
            <span className="font-mono font-bold text-slate-900">{primaryPayment.bank_account_masked}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>{isHi ? "आईएफएससी कोड (IFSC):" : "IFSC Code:"}</span>
            <span className="font-mono text-slate-800">{profile.ifsc_code || "SBIN0001245"}</span>
          </div>
          <div className="flex justify-between text-slate-600 border-t pt-1.5">
            <span>{isHi ? "आधार सीडिंग स्थिति:" : "Aadhaar APBS Link:"}</span>
            <span className="text-emerald-700 font-semibold">Mapped to UIDAI {profile.aadhaar_masked}</span>
          </div>
        </div>
      </div>

      {/* Payment History List */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          {isHi ? "विस्तृत भुगतान इतिहास" : "Disbursement Passbook History"}
        </h4>

        {payments.map((p, idx) => (
          <div
            key={p.id || idx}
            className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {p.scheme_name}
                </span>
                <span className="text-[11px] text-slate-500">
                  {isHi ? "किस्त" : "Installment"} #{p.installment_no} · {p.payment_date}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs sm:text-sm font-bold text-emerald-700 block">
                +{p.amount_formatted}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {p.pfms_txn_id}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
