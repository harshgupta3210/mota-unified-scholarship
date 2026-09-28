import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Globe, 
  Clock, 
  ArrowRight, 
  User, 
  RotateCcw 
} from "lucide-react";
import { apiService } from "../services/api";

export default function JagoChatbot({ 
  profile, 
  applications, 
  language, 
  setLanguage,
  onResolveDeficiency,
  onOpenWallet,
  setActiveTab 
}) {
  const isHi = language === "hi";

  const [messages, setMessages] = useState([
    {
      id: "m0",
      sender: "jago",
      text: isHi 
        ? `नमस्ते ${profile.full_name}! मैं जागो (JAGO) हूँ — जनजातीय कार्य मंत्रालय (MoTA) का AI छात्रवृत्ति सहायक। आप मुझसे अपने आवेदन की स्थिति, लापता दस्तावेज़, डीबीटी भुगतान या 5 MoTA योजनाओं की पात्रता के बारे में पूछ सकते हैं।`
        : `Hello ${profile.full_name}! I am JAGO — your AI Assistant for the Ministry of Tribal Affairs (MoTA) Unified Scholarship Platform. Ask me anything about your application status, missing documents, DBT payment schedule, or scheme eligibility!`,
      actions: isHi 
        ? ["मेरा आवेदन कहाँ है?", "कौन सा दस्तावेज़ अधूरा है?", "छात्रवृत्ति का पैसा कब आएगा?", "क्या मैं टॉप क्लास के लिए पात्र हूँ?"]
        : ["Where is my scholarship application?", "What document is missing?", "When will my scholarship payment arrive?", "Am I eligible for Top Class Scholarship?"],
      timestamp: "10:00 AM"
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickQuestions = isHi ? [
    "मेरा छात्रवृत्ति आवेदन कहाँ है?",
    "कौन सा दस्तावेज़ अधूरा है?",
    "छात्रवृत्ति का भुगतान कब आएगा?",
    "मेरा आवेदन क्यों अटका हुआ है?",
    "क्या मैं टॉप क्लास छात्रवृत्ति के लिए पात्र हूँ?",
    "मेरा पिछला छात्रवृत्ति भुगतान कितना था?"
  ] : [
    "Where is my scholarship application?",
    "What document is missing?",
    "When will my scholarship payment arrive?",
    "Why is my application pending?",
    "Am I eligible for Top Class Scholarship?",
    "What was my previous scholarship payment?"
  ];

  const handleSend = async (queryText) => {
    const q = queryText || inputText;
    if (!q.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const res = await apiService.queryJago(q, language);
      const botMsg = {
        id: `j-${Date.now()}`,
        sender: "jago",
        text: res.response,
        actions: res.suggested_actions || [],
        timestamp: res.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const fallbackMsg = {
        id: `j-${Date.now()}`,
        sender: "jago",
        text: isHi 
          ? "माफ़ कीजिए, सर्वर से संपर्क नहीं हो पाया। कृपया पुनः प्रयास करें।" 
          : "I could not reach the server right now. Please try again.",
        actions: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.includes("Deficiency") || action.includes("Income") || action.includes("सुधार")) {
      const defApp = applications.find(a => a.application_status === "Deficiency");
      if (defApp) onResolveDeficiency(defApp);
    } else if (action.includes("Wallet") || action.includes("वॉलेट")) {
      onOpenWallet();
    } else if (action.includes("Timeline") || action.includes("आवेदन")) {
      setActiveTab("applications");
    } else if (action.includes("DBT") || action.includes("Payment") || action.includes("भुगतान")) {
      setActiveTab("payments");
    } else {
      handleSend(action);
    }
  };

  const toggleVoiceSimulation = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      // Simulate voice-to-text after 2.5 seconds
      setTimeout(() => {
        setIsRecording(false);
        const voiceSample = isHi 
          ? "मेरा छात्रवृत्ति आवेदन किस स्थिति में है?" 
          : "Where is my scholarship application?";
        setInputText(voiceSample);
      }, 2500);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] sm:h-[80vh] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* JAGO Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-3.5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="font-bold text-sm tracking-wide">
                {isHi ? "जागो AI छात्रवृत्ति सहायक" : "JAGO AI Assistant"}
              </h3>
              <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded font-semibold">
                MoTA
              </span>
            </div>
            <p className="text-[11px] text-amber-100 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <span>{isHi ? "ऑनलाइन · लाइव छात्र डेटा से जुड़ा" : "Online · Context-Aware Student Bot"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="text-[11px] font-bold bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition"
            title="Toggle Language"
          >
            {language === "en" ? "हिन्दी" : "EN"}
          </button>
        </div>
      </div>

      {/* Quick Prompt Pills Bar */}
      <div className="bg-amber-50/70 border-b border-amber-100 p-2 overflow-x-auto flex space-x-1.5 shrink-0 text-xs">
        <span className="text-[10px] font-bold text-amber-800 self-center uppercase tracking-wider shrink-0 mr-1">
          {isHi ? "त्वरित प्रश्न:" : "Quick Queries:"}
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="bg-white hover:bg-amber-100/60 text-slate-700 hover:text-amber-900 border border-amber-200/80 rounded-full px-2.5 py-1 text-[11px] whitespace-nowrap transition shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message Chat Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
        {messages.map((m) => {
          const isUser = m.sender === "user";

          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                isUser ? "bg-slate-900 text-white" : "bg-amber-600 text-white shadow-xs"
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed ${
                isUser 
                  ? "bg-blue-900 text-white rounded-tr-none" 
                  : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
              }`}>
                <p className="whitespace-pre-line">{m.text}</p>
                
                {/* Suggested Action Chips */}
                {!isUser && m.actions && m.actions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {m.actions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(act)}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg px-2.5 py-1 text-[11px] font-semibold flex items-center space-x-1 transition"
                      >
                        <span>{act}</span>
                        <ArrowRight className="w-3 h-3 text-amber-600" />
                      </button>
                    ))}
                  </div>
                )}

                <span className={`block text-[10px] mt-1 text-right ${isUser ? "text-blue-200" : "text-slate-400"}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs pl-10">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="italic">{isHi ? "जागो उत्तर तैयार कर रहा है..." : "JAGO is typing..."}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Recording Simulation Indicator */}
      {isRecording && (
        <div className="bg-rose-50 border-t border-rose-200 p-2 text-center text-xs text-rose-700 flex items-center justify-center space-x-2 animate-pulse">
          <Mic className="w-4 h-4 text-rose-600 animate-bounce" />
          <span className="font-bold">{isHi ? "सुन रहा हूँ... बोलिए (वॉयस इनपुट)" : "Listening... Speak now (Simulated Voice Recognition)"}</span>
        </div>
      )}

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-2.5 bg-white border-t border-slate-200 flex items-center space-x-2 shrink-0"
      >
        <button
          type="button"
          onClick={toggleVoiceSimulation}
          className={`p-2 rounded-xl transition ${
            isRecording 
              ? "bg-rose-600 text-white" 
              : "bg-slate-100 hover:bg-slate-200 text-slate-600"
          }`}
          title="Voice Input Simulation"
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isHi ? "छात्रवृत्ति संबंधी कोई भी प्रश्न पूछें..." : "Ask any question about your scholarship..."}
          className="flex-1 bg-slate-100 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white p-2 rounded-xl transition shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
