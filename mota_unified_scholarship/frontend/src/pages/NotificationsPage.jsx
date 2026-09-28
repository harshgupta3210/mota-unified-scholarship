import React, { useState } from "react";
import { 
  Bell, 
  CreditCard, 
  AlertCircle, 
  ShieldCheck, 
  Calendar, 
  Check, 
  CheckCheck 
} from "lucide-react";

export default function NotificationsPage({ 
  notifications, 
  onMarkAllRead, 
  language 
}) {
  const isHi = language === "hi";
  const [filter, setFilter] = useState("all");

  const getIcon = (type) => {
    switch (type) {
      case "payment":
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case "deficiency":
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      case "verification":
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
      case "deadline":
        return <Calendar className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const filteredNotifs = filter === "all" 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {isHi ? "सूचनाएं एवं महत्वपूर्ण संदेश" : "Notifications & Updates"}
          </h2>
          <p className="text-xs text-slate-500">
            {isHi 
              ? "सत्यापन, डीबीटी भुगतान और समय-सीमा से जुड़े रीयल-टाइम अलर्ट" 
              : "Real-time alerts on verification progress, DBT disbursement, and deadlines"}
          </p>
        </div>

        <button
          onClick={onMarkAllRead}
          className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center space-x-1"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>{isHi ? "सभी पढ़ें" : "Mark all read"}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 text-xs">
        {["all", "payment", "deficiency", "verification", "deadline"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-xl font-semibold capitalize transition ${
              filter === f 
                ? "bg-blue-900 text-white shadow-xs" 
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filteredNotifs.map((n) => (
          <div
            key={n.id}
            className={`p-3.5 rounded-2xl border transition flex items-start space-x-3 ${
              n.is_read 
                ? "bg-white border-slate-200" 
                : "bg-blue-50/50 border-blue-200 shadow-xs"
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
              {getIcon(n.type)}
            </div>

            <div className="flex-1 text-xs">
              <div className="flex justify-between items-start gap-1">
                <h4 className="font-bold text-slate-900">
                  {isHi ? (n.title_hi || n.title) : n.title}
                </h4>
                <span className="text-[10px] text-slate-400 shrink-0 whitespace-nowrap">
                  {n.created_at}
                </span>
              </div>
              <p className="text-slate-600 mt-1 leading-relaxed">
                {isHi ? (n.message_hi || n.message) : n.message}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
