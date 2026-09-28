import React from "react";
import { 
  Bell, Globe, Shield, Smartphone, Monitor, User, LogOut, CheckCircle2 
} from "lucide-react";

export default function Navbar({ 
  language, 
  setLanguage, 
  isMobileFrame, 
  setIsMobileFrame, 
  currentRole, 
  setCurrentRole, 
  unreadCount, 
  onOpenNotifications,
  activeTab,
  setActiveTab
}) {
  const isHi = language === "hi";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm border-b border-slate-200">
      {/* Tiranga Accent Strip */}
      <div className="tiranga-strip w-full" />

      {/* Main Top Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between">
        
        {/* Ministry Emblem & Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("home")}>
          <div className="w-10 h-10 rounded-full bg-amber-700/10 border border-amber-600/30 flex items-center justify-center p-1.5 shadow-sm">
            {/* MoTA Emblem graphic simulation */}
            <div className="text-center font-black text-amber-800 text-[11px] leading-tight">
              MoTA
              <span className="block text-[8px] tracking-tighter text-emerald-800">GOI</span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                {isHi ? "जनजातीय कार्य मंत्रालय" : "Ministry of Tribal Affairs"}
              </span>
              <span className="hidden sm:inline-block text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                Govt. of India
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              {isHi ? "एकीकृत एसटी छात्रवृत्ति एवं फैलोशिप पोर्टल" : "Unified ST Scholarship & Fellowship Platform"}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Device Viewport Toggle (Phone Frame vs Full Web) */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className={`hidden md:flex items-center space-x-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition ${
              isMobileFrame 
                ? "bg-indigo-50 border-indigo-300 text-indigo-700" 
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
            title="Toggle between Mobile Phone Frame and Responsive Desktop view"
          >
            {isMobileFrame ? <Smartphone className="w-3.5 h-3.5 text-indigo-600" /> : <Monitor className="w-3.5 h-3.5 text-slate-600" />}
            <span>{isMobileFrame ? "Phone View" : "Desktop View"}</span>
          </button>

          {/* Role Switcher: Student vs MoTA Official (Admin) */}
          <button
            onClick={() => {
              const newRole = currentRole === "student" ? "admin" : "student";
              setCurrentRole(newRole);
              if (newRole === "admin") setActiveTab("admin");
              else setActiveTab("home");
            }}
            className={`flex items-center space-x-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition shadow-xs ${
              currentRole === "admin"
                ? "bg-purple-100 border-purple-300 text-purple-900"
                : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentRole === "admin" ? "MoTA Officer" : "Student View"}</span>
          </button>

          {/* Bilingual Language Switcher */}
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-bold">{language === "en" ? "हिन्दी" : "English"}</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
