import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import DeviceFrame from "./components/DeviceFrame";
import Dashboard from "./pages/Dashboard";
import SchemesList from "./pages/SchemesList";
import ApplicationsTrack from "./pages/ApplicationsTrack";
import DocumentWallet from "./pages/DocumentWallet";
import PaymentTracker from "./pages/PaymentTracker";
import JagoChatbot from "./pages/JagoChatbot";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import AdminDashboard from "./pages/AdminDashboard";

import DigiLockerModal from "./components/DigiLockerModal";
import ConflictModal from "./components/ConflictModal";
import DeficiencyModal from "./components/DeficiencyModal";

import { apiService } from "./services/api";
import { 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_SCHEMES, 
  INITIAL_APPLICATIONS, 
  INITIAL_DOCUMENTS, 
  INITIAL_PAYMENTS, 
  INITIAL_NOTIFICATIONS 
} from "./services/mockData";

export default function App() {
  const [language, setLanguage] = useState("en"); // "en" or "hi"
  const [isMobileFrame, setIsMobileFrame] = useState(true); // Default to Phone Frame for SIH demo!
  const [currentRole, setCurrentRole] = useState("student"); // "student" or "admin"
  const [activeTab, setActiveTab] = useState("home");

  // Application Data States
  const [profile, setProfile] = useState(INITIAL_STUDENT_PROFILE);
  const [schemes, setSchemes] = useState(INITIAL_SCHEMES);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Modals state
  const [isDigiLockerOpen, setIsDigiLockerOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [conflictTargetScheme, setConflictTargetScheme] = useState("");
  const [isDeficiencyModalOpen, setIsDeficiencyModalOpen] = useState(false);
  const [deficiencyApp, setDeficiencyApp] = useState(null);

  // Initial load
  useEffect(() => {
    async function initData() {
      try {
        const [prof, schs, apps, docs, pmts, notifs] = await Promise.allSettled([
          apiService.getProfile(),
          apiService.getSchemes(),
          apiService.getApplications(),
          apiService.getDocuments(),
          apiService.getPayments(),
          apiService.getNotifications()
        ]);

        if (prof.status === "fulfilled" && prof.value) setProfile(prof.value);
        if (schs.status === "fulfilled" && schs.value?.length) setSchemes(schs.value);
        if (apps.status === "fulfilled" && apps.value?.length) setApplications(apps.value);
        if (docs.status === "fulfilled" && docs.value?.length) setDocuments(docs.value);
        if (pmts.status === "fulfilled" && pmts.value?.length) setPayments(pmts.value);
        if (notifs.status === "fulfilled" && notifs.value?.notifications) setNotifications(notifs.value.notifications);
      } catch (err) {
        console.log("Using initialized mock datasets");
      }
    }
    initData();
  }, []);

  // Handlers
  const handleApplyScheme = async (scheme) => {
    // Conflict Prevention Rule Check
    // If student is already enrolled in Post-Matric and tries to apply for another scheme
    if (scheme.code !== "POST_MATRIC") {
      setConflictTargetScheme(scheme.name);
      setIsConflictModalOpen(true);
      return;
    }

    alert(`You are already enrolled in ${scheme.name}. Status: ${applications.find(a => a.scheme_code === scheme.code)?.application_status || "Active"}`);
  };

  const handleResolveDeficiency = (app) => {
    setDeficiencyApp(app);
    setIsDeficiencyModalOpen(true);
  };

  const handleDeficiencyResolved = (appId, { docNumber, remarks }) => {
    // Update local applications state
    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          application_status: "Under Verification",
          verification_status: "Verified (Renewed)",
          deficiency_remarks: null,
          deficiency_field: null,
          stages: (a.stages || []).map(s => s.stage_number === 2 ? { ...s, status: "completed", description: "Renewed certificate re-verified." } : s)
        };
      }
      return a;
    }));

    // Update document wallet
    setDocuments(prev => prev.map(d => {
      if (d.doc_type === "Income Certificate") {
        return {
          ...d,
          doc_number: docNumber,
          verification_status: "Verified",
          remarks: "Renewed certificate authenticated via State Revenue Dept."
        };
      }
      return d;
    }));
  };

  const handleDocumentFetched = (docType) => {
    setDocuments(prev => {
      const exists = prev.find(d => d.doc_type === docType);
      if (exists) {
        return prev.map(d => d.doc_type === docType ? {
          ...d,
          verification_status: "Verified",
          source: "DigiLocker",
          digilocker_uri: `in.gov.edistrict:${Math.floor(10000 + Math.random() * 90000)}`,
          remarks: "Cryptographically verified via DigiLocker Mock API."
        } : d);
      } else {
        return [
          {
            id: Date.now(),
            doc_type: docType,
            doc_name: `${docType} (DigiLocker Verified)`,
            doc_number: `DL/2026/${Math.floor(100000 + Math.random() * 900000)}`,
            source: "DigiLocker",
            digilocker_uri: `in.gov.edistrict:${Math.floor(10000 + Math.random() * 90000)}`,
            verification_status: "Verified",
            verification_source: "DigiLocker Central Vault",
            remarks: "Pulled and authenticated via DigiLocker gateway."
          },
          ...prev
        ];
      }
    });
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Central Government Header */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        unreadCount={unreadCount}
        onOpenNotifications={() => setActiveTab("notifications")}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Viewport Container (Device Frame or Desktop View) */}
      <DeviceFrame isMobileFrame={isMobileFrame && currentRole === "student"}>
        <div className="p-3.5 sm:p-5 pb-20">
          
          {currentRole === "admin" || activeTab === "admin" ? (
            <AdminDashboard language={language} />
          ) : (
            <>
              {activeTab === "home" && (
                <Dashboard
                  profile={profile}
                  applications={applications}
                  onSelectScheme={(app) => {
                    if (app.has_active_application) setActiveTab("applications");
                    else setActiveTab("schemes");
                  }}
                  onResolveDeficiency={handleResolveDeficiency}
                  onOpenWallet={() => setActiveTab("wallet")}
                  onOpenJago={() => setActiveTab("jago")}
                  setActiveTab={setActiveTab}
                  language={language}
                />
              )}

              {activeTab === "schemes" && (
                <SchemesList
                  schemes={schemes}
                  onApplyScheme={handleApplyScheme}
                  language={language}
                />
              )}

              {activeTab === "applications" && (
                <ApplicationsTrack
                  applications={applications}
                  onResolveDeficiency={handleResolveDeficiency}
                  language={language}
                />
              )}

              {activeTab === "wallet" && (
                <DocumentWallet
                  documents={documents}
                  onOpenDigiLocker={() => setIsDigiLockerOpen(true)}
                  language={language}
                />
              )}

              {activeTab === "payments" && (
                <PaymentTracker
                  payments={payments}
                  profile={profile}
                  language={language}
                />
              )}

              {activeTab === "jago" && (
                <JagoChatbot
                  profile={profile}
                  applications={applications}
                  language={language}
                  setLanguage={setLanguage}
                  onResolveDeficiency={handleResolveDeficiency}
                  onOpenWallet={() => setActiveTab("wallet")}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === "profile" && (
                <ProfilePage
                  profile={profile}
                  language={language}
                />
              )}

              {activeTab === "notifications" && (
                <NotificationsPage
                  notifications={notifications}
                  onMarkAllRead={handleMarkAllRead}
                  language={language}
                />
              )}
            </>
          )}

        </div>
      </DeviceFrame>

      {/* Mobile-First Bottom Navigation (Visible for students) */}
      {currentRole === "student" && activeTab !== "admin" && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          language={language}
        />
      )}

      {/* Interactive Modals */}
      <DigiLockerModal
        isOpen={isDigiLockerOpen}
        onClose={() => setIsDigiLockerOpen(false)}
        onDocumentFetched={handleDocumentFetched}
        language={language}
      />

      <ConflictModal
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
        targetSchemeName={conflictTargetScheme}
        language={language}
      />

      <DeficiencyModal
        isOpen={isDeficiencyModalOpen}
        onClose={() => setIsDeficiencyModalOpen(false)}
        onResolved={handleDeficiencyResolved}
        application={deficiencyApp}
        language={language}
      />

    </div>
  );
}
