import React, { useState } from "react";
import { AlertCircle, Upload, CheckCircle2, X, FileCheck, ArrowRight, Loader2 } from "lucide-react";

export default function DeficiencyModal({ isOpen, onClose, onResolved, application, language }) {
  const [docNumber, setDocNumber] = useState("INC/UP/2026/90214");
  const [remarks, setRemarks] = useState("Uploaded renewed income certificate issued by Tehsildar Robertsganj on 10-Aug-2026.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !application) return null;
  const isHi = language === "hi";

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onResolved(application.id, { docNumber, remarks });
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-rose-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">
                {isHi ? "दस्तावेज़ त्रुटि सुधार" : "Resolve Application Deficiency"}
              </h3>
              <p className="text-[11px] text-rose-200 font-mono">
                {application.application_number}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-rose-200 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                {isHi ? "त्रुटि सुधार सफलतापूर्वक जमा!" : "Deficiency Rectified Successfully!"}
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {isHi 
                  ? "आपका अद्यतन प्रमाण पत्र स्वतः पुनः सत्यापन के लिए भेज दिया गया है।" 
                  : "Your renewed certificate has been re-submitted to the verification queue."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-3 text-xs text-rose-950">
                <span className="font-bold block text-rose-900 mb-0.5">
                  {isHi ? "सत्यापन अधिकारी की टिप्पणी:" : "Verification Officer Remark:"}
                </span>
                <p className="italic text-rose-800">{application.deficiency_remarks}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHi ? "नवीनीकृत प्रमाण पत्र संख्या (Certificate Number):" : "Renewed Certificate Number:"}
                </label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHi ? "छात्र की स्पष्टीकरण टिप्पणी:" : "Student Clarification Note:"}
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  required
                />
              </div>

              <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50">
                <FileCheck className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <span className="text-xs font-semibold text-slate-800 block">
                  Income_Certificate_2026_Renewed.pdf
                </span>
                <span className="text-[10px] text-slate-500">
                  Ready to submit · DigiLocker / Revenue Portal Linked
                </span>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition"
                >
                  {isHi ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-rose-700 hover:bg-rose-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isHi ? "जमा हो रहा है..." : "Submitting..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{isHi ? "पुनः सत्यापन हेतु भेजें" : "Submit Correction"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
