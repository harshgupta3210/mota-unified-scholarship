import React, { useState } from "react";
import { 
  Wallet, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Download, 
  Eye, 
  Plus, 
  FileText, 
  RefreshCw, 
  ExternalLink 
} from "lucide-react";

export default function DocumentWallet({ 
  documents, 
  onOpenDigiLocker, 
  language 
}) {
  const isHi = language === "hi";
  const [selectedDoc, setSelectedDoc] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Verified":
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{isHi ? "प्रमाणित (Verified)" : "Verified"}</span>
          </span>
        );
      case "Mismatch":
      case "Invalid":
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 animate-pulse">
            <AlertCircle className="w-3 h-3" />
            <span>{isHi ? "नवीनीकरण आवश्यक" : "Mismatch / Expired"}</span>
          </span>
        );
      default:
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{isHi ? "सत्यापन लंबित" : "Pending Review"}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header with DigiLocker Integration CTA */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-blue-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-400 text-blue-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              DigiLocker Linked
            </span>
            <span className="text-xs text-blue-200">
              {isHi ? "सिम्युलेटेड राष्ट्रीय सत्यापन सेवा" : "Unified Document Wallet"}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold mt-1">
            {isHi ? "डिजिटल दस्तावेज़ वॉलेट (डिजिलॉकर समर्थित)" : "Digital Document Wallet (DigiLocker Powered)"}
          </h2>
          <p className="text-xs text-blue-100 max-w-md mt-0.5">
            {isHi 
              ? "एक बार दस्तावेज़ अपलोड या फेच करें और MoTA की सभी 5 छात्रवृत्तियों में दोबारा उपयोग करें।" 
              : "Store, auto-verify, and reuse certificates seamlessly across all MoTA scholarship schemes."}
          </p>
        </div>

        <button
          onClick={onOpenDigiLocker}
          className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center space-x-2 transition self-stretch sm:self-auto justify-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{isHi ? "डिजिलॉकर से दस्तावेज़ जोड़ें" : "Fetch via DigiLocker"}</span>
        </button>
      </div>

      {/* Simulated Verification Layer Badge */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            {isHi 
              ? "स्वचालित सत्यापन: UIDAI · राज्य ई-डिस्ट्रिक्ट · UDISE+ · AISHE · NTA" 
              : "Automated Verification Layer: UIDAI · State e-District · UDISE+ · AISHE · NTA"}
          </span>
        </div>
        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
          MOCK / SIMULATED
        </span>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {documents.map((doc) => (
          <div
            key={doc.id || doc.doc_type}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-sm transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      {doc.doc_type}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                      {doc.doc_number || "Awaiting Verification"}
                    </span>
                  </div>
                </div>

                {getStatusBadge(doc.verification_status)}
              </div>

              {/* Source & Remarks */}
              <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>{isHi ? "स्रोत / जारीकर्ता:" : "Source / Issuer:"}</span>
                  <span className="font-semibold text-slate-700">{doc.verification_source}</span>
                </div>
                {doc.digilocker_uri && (
                  <div className="flex justify-between text-slate-500 font-mono text-[10px]">
                    <span>URI:</span>
                    <span className="text-blue-700">{doc.digilocker_uri}</span>
                  </div>
                )}
                {doc.remarks && (
                  <p className="text-[10px] text-slate-600 italic pt-1 border-t border-slate-200">
                    "{doc.remarks}"
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
              <span className="text-[10px] text-slate-400">
                {doc.source === "DigiLocker" ? "✓ DigiLocker Verified" : "Direct Student Upload"}
              </span>

              <div className="flex space-x-1.5">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title="View Certificate"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => alert(`Downloading verified certificate ${doc.doc_number}`)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title="Download Certificate"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{selectedDoc.doc_type}</h3>
                <span className="text-[10px] text-slate-500 font-mono">{selectedDoc.doc_number}</span>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 text-center space-y-2">
              <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">Digitally Certified e-Document</span>
                <span className="text-slate-500 font-mono text-[10px]">SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f</span>
              </div>
              <p className="text-[11px] text-slate-600 italic">
                Issued for Demo ST Student · Scheduled Tribe Welfare Registry
              </p>
            </div>

            <button
              onClick={() => setSelectedDoc(null)}
              className="w-full bg-slate-900 text-white font-semibold py-2 rounded-xl text-xs"
            >
              {isHi ? "बंद करें" : "Close Certificate"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
