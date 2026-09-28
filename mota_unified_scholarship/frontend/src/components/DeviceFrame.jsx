import React from "react";
import { Wifi, Battery, Signal } from "lucide-react";

export default function DeviceFrame({ isMobileFrame, children }) {
  if (!isMobileFrame) {
    return (
      <main className="min-h-screen bg-slate-50 pb-20 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900/90 py-8 px-2 flex justify-center items-start overflow-y-auto">
      {/* Smartphone Chassis */}
      <div className="relative w-full max-w-[420px] bg-white rounded-[44px] shadow-2xl border-[10px] border-slate-800 ring-1 ring-slate-700/50 overflow-hidden flex flex-col min-h-[860px] max-h-[92vh]">
        
        {/* Top Notch & Phone Status Bar */}
        <div className="bg-slate-900 text-white px-7 pt-3 pb-2 flex items-center justify-between text-xs select-none sticky top-0 z-50">
          <span className="font-semibold tracking-tight text-[11px]">09:41</span>
          
          {/* Dynamic Island / Camera cutout */}
          <div className="w-20 h-4 bg-black rounded-full flex items-center justify-end px-2 space-x-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
            <div className="w-2 h-2 rounded-full bg-slate-800" />
          </div>

          <div className="flex items-center space-x-1.5 text-[10px]">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Scrollable Mobile App Screen */}
        <div className="flex-1 overflow-y-auto pb-24 bg-slate-50">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="bg-white/90 backdrop-blur py-1.5 flex justify-center border-t border-slate-100 sticky bottom-0 z-50">
          <div className="w-28 h-1 bg-slate-400 rounded-full" />
        </div>
      </div>
    </div>
  );
}
