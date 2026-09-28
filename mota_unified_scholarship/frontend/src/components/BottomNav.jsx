import React from "react";
import { 
  Home, 
  GraduationCap, 
  Clock, 
  Wallet, 
  CreditCard, 
  MessageSquareCode, 
  UserCircle 
} from "lucide-react";

export default function BottomNav({ activeTab, setActiveTab, language }) {
  const isHi = language === "hi";

  const tabs = [
    { id: "home", label: isHi ? "होम" : "Home", icon: Home },
    { id: "schemes", label: isHi ? "योजनाएं" : "Schemes", icon: GraduationCap },
    { id: "applications", label: isHi ? "आवेदन" : "Applications", icon: Clock },
    { id: "wallet", label: isHi ? "वॉलेट" : "Wallet", icon: Wallet },
    { id: "payments", label: isHi ? "डीबीटी" : "DBT", icon: CreditCard },
    { id: "jago", label: isHi ? "जागो AI" : "JAGO AI", icon: MessageSquareCode, highlight: true },
    { id: "profile", label: isHi ? "प्रोफाइल" : "Profile", icon: UserCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
      <div className="max-w-lg mx-auto flex items-center justify-around py-1.5 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.highlight) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center p-1 group transition ${
                  isActive ? "text-amber-600 scale-105" : "text-slate-600 hover:text-amber-600"
                }`}
              >
                <div className={`w-10 h-10 -mt-5 rounded-full flex items-center justify-center shadow-md transition ${
                  isActive 
                    ? "bg-gradient-to-tr from-amber-600 to-orange-500 text-white ring-2 ring-amber-300" 
                    : "bg-amber-500 text-white hover:bg-amber-600"
                }`}>
                  <Icon className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-[10px] font-bold mt-0.5 tracking-tight text-amber-700">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
                isActive 
                  ? "text-blue-900 font-bold" 
                  : "text-slate-500 hover:text-slate-900 font-medium"
              }`}
            >
              <div className={`p-1 rounded-lg transition ${isActive ? "bg-blue-50 text-blue-900" : ""}`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
              </div>
              <span className="text-[10px] sm:text-[11px] mt-0.5 leading-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
