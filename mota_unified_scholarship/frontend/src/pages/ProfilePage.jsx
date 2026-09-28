import React, { useState } from "react";
import { 
  UserCircle, 
  ShieldCheck, 
  Building2, 
  CreditCard, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Edit3, 
  Save 
} from "lucide-react";

export default function ProfilePage({ profile, language }) {
  const isHi = language === "hi";

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          {isHi ? "विद्यार्थी प्रोफ़ाइल एवं राष्ट्रीय पहचान" : "Student Profile & Verified Identity"}
        </h2>
        <p className="text-xs text-slate-500">
          {isHi 
            ? "आधार, अपार (APAAR), एवं राज्य ई-डिस्ट्रिक्ट द्वारा सत्यापित विद्यार्थी विवरण" 
            : "Central identity records verified through UIDAI, APAAR, and State e-District"}
        </p>
      </div>

      {/* Main Student ID Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              {profile.full_name?.charAt(0) || "S"}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {profile.full_name}
                </h3>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs text-slate-500">
                {profile.course_name}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Aadhaar Verified</span>
            </span>
            {profile.is_pvtg && (
              <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                PVTG: {profile.pvtg_community}
              </span>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 text-xs">
          
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              {isHi ? "जनजाति श्रेणी एवं उपजाति" : "ST Category & Subcaste"}
            </span>
            <span className="font-bold text-slate-800">
              {profile.st_category} ({profile.st_subcaste})
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              {isHi ? "विशेष रूप से कमजोर जनजातीय समूह (PVTG)" : "PVTG Status"}
            </span>
            <span className="font-bold text-amber-700">
              {profile.is_pvtg ? `Yes · ${profile.pvtg_community} Community` : "No"}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              {isHi ? "जन्म तिथि एवं लिंग" : "DOB & Gender"}
            </span>
            <span className="font-semibold text-slate-800">
              {profile.dob} · {profile.gender}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              {isHi ? "गृह राज्य एवं ज़िला" : "Home State & District"}
            </span>
            <span className="font-semibold text-slate-800 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{profile.district}, {profile.state}</span>
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              {isHi ? "संस्थान एवं AISHE कोड" : "Institution & AISHE Code"}
            </span>
            <span className="font-semibold text-slate-800 flex items-center space-x-1">
              <Building2 className="w-3 h-3 text-slate-400" />
              <span>{profile.institution_name} ({profile.aishe_code})</span>
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              {isHi ? "शैक्षणिक वर्ष" : "Academic Year"}
            </span>
            <span className="font-semibold text-slate-800">
              {profile.academic_year}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              {isHi ? "पारिवारिक वार्षिक आय" : "Annual Family Income"}
            </span>
            <span className="font-bold text-slate-900">
              ₹{Number(profile.annual_family_income || 180000).toLocaleString("en-IN")} / year
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              {isHi ? "अपार (APAAR) विद्यार्थी पहचान" : "APAAR / One Nation One Student ID"}
            </span>
            <span className="font-mono font-bold text-blue-900">
              {profile.apaar_id}
            </span>
          </div>

          <div className="space-y-1 col-span-1 sm:col-span-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              {isHi ? "आधार संख्या (सुरक्षा हेतु मास्क)" : "Aadhaar e-KYC (Masked for Security)"}
            </span>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                {profile.aadhaar_masked}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">
                ✓ UIDAI Demographic Match 100%
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Security & Privacy Notice */}
      <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 leading-relaxed">
        <strong className="text-slate-800 block mb-0.5">
          {isHi ? "गोपनीयता एवं सुरक्षा प्रतिज्ञा:" : "MoTA Security & Privacy Compliance:"}
        </strong>
        {isHi 
          ? "आधार और पहचान डेटा को डिजिटल पर्सनल डेटा प्रोटेक्शन (DPDP) दिशानिर्देशों के अनुरूप मास्क एवं एन्क्रिप्ट किया गया है। प्रोटोटाइप में कोई वास्तविक आधार संख्या प्रदर्शित नहीं की जाती है।" 
          : "Demographic and Aadhaar records are masked and encrypted in accordance with Digital Personal Data Protection standards. No raw Aadhaar credentials are stored or exposed."}
      </div>

    </div>
  );
}
