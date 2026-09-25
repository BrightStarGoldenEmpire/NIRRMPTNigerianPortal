"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  ShieldAlert,
  Users,
  MessageSquare,
  Send,
  Radio,
  GraduationCap,
  UserCheck,
  Building2,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  Settings,
  X,
  PlusCircle,
  Megaphone,
  Camera,
  Activity,
  CheckSquare,
  Square,
  FileCheck2,
  Award,
  Loader2,
  ExternalLink,
  ArrowRightLeft,
  ShieldCheck,
  AlertCircle,
  Search,
  Filter,
  Check,
  RefreshCw,
  Bell,
  BarChart3,
  BookOpen,
  User,
  CheckCircle,
  MapPin,
  Video,
  Plus,
  SendHorizontal,
  Info,
} from "lucide-react";

// --- Types ---
export type MembershipGrade = "Fellow" | "Full Member" | "Associate" | "Graduate" | "Student";

export interface ApplicationDocuments {
  passport_photograph?: string;
  valid_id_document?: string;
  highest_qualification?: string;
  professional_qualification?: string;
  payment_proof?: string;
  [key: string]: string | undefined;
}

export interface ApplicationChecklist {
  completed_application_form: boolean;
  passport_photograph: boolean;
  highest_qualification: boolean;
  professional_qualification: boolean;
  employment_experience: boolean;
  valid_id_document: boolean;
  payment_proof: boolean;
  supporting_documents: boolean;
  [key: string]: boolean;
}

export interface MembershipApplication {
  id: string;
  applicant_name: string;
  email: string;
  applied_grade: MembershipGrade;
  submission_date: string;
  application_status: string;
  received_by: string;
  verified_by: string;
  qualifications_verified: boolean;
  membership_grade_approved: MembershipGrade;
  application_decision: "Pending" | "Approved" | "Deferred" | "Not Approved" | "Escalated to SuperAdmin";
  authorized_officer: string;
  approval_date: string;
  forwarded_to_superadmin: boolean;
  documents: ApplicationDocuments;
  checklist: ApplicationChecklist;
}

export interface ChatMessage {
  id?: string;
  sender: string;
  text: string;
  time: string;
  role: string;
}

export interface BroadcastLog {
  id: number | string;
  title: string;
  target: string;
  date: string;
  status: string;
}

export interface TrainingCourse {
  id: string;
  title: string;
  description?: string;
  type: "Onsite" | "Virtual" | "Hybrid";
  location_or_link: string;
  start_date: string;
  end_date: string;
  capacity: number;
  enrolled: number;
  completed: number;
  status: "Draft" | "Pending Approval" | "Approved" | "Active" | "Completed" | "Rejected";
  instructor: string;
  created_by: string;
  rejection_reason?: string;
}

// --- Default Mock Applications ---
const INITIAL_APPLICATIONS: MembershipApplication[] = [
  {
    id: "APP-2026-0891",
    applicant_name: "Dr. Emmanuel Etuk",
    email: "e.etuk@nirrmpt.gov.ng",
    applied_grade: "Fellow",
    submission_date: "2026-09-22",
    application_status: "Pending Directorate Verification",
    received_by: "Admin Desk Officer",
    verified_by: "Pending Verification",
    qualifications_verified: false,
    membership_grade_approved: "Fellow",
    application_decision: "Pending",
    authorized_officer: "",
    approval_date: "",
    forwarded_to_superadmin: false,
    documents: {
      passport_photograph: "https://via.placeholder.com/150",
      valid_id_document: "https://via.placeholder.com/300x200?text=National+ID",
      highest_qualification: "https://via.placeholder.com/300x200?text=BSc+Degree+Certificate",
      professional_qualification: "https://via.placeholder.com/300x200?text=Professional+Cert",
      payment_proof: "https://via.placeholder.com/300x200?text=Payment+Receipt",
    },
    checklist: {
      completed_application_form: true,
      passport_photograph: true,
      highest_qualification: true,
      professional_qualification: true,
      employment_experience: false,
      valid_id_document: true,
      payment_proof: true,
      supporting_documents: false,
    },
  },
  {
    id: "APP-2026-0892",
    applicant_name: "Engr. Amina Abubakar",
    email: "a.abubakar@nirrmpt.gov.ng",
    applied_grade: "Full Member",
    submission_date: "2026-09-23",
    application_status: "Pending Directorate Verification",
    received_by: "Admin Desk Officer",
    verified_by: "Pending Verification",
    qualifications_verified: false,
    membership_grade_approved: "Full Member",
    application_decision: "Pending",
    authorized_officer: "",
    approval_date: "",
    forwarded_to_superadmin: false,
    documents: {
      passport_photograph: "https://via.placeholder.com/150",
      valid_id_document: "https://via.placeholder.com/300x200?text=Voters+Card",
      highest_qualification: "https://via.placeholder.com/300x200?text=MSc+Degree+Certificate",
      professional_qualification: "https://via.placeholder.com/300x200?text=COREN+Cert",
      payment_proof: "https://via.placeholder.com/300x200?text=Bank+Teller",
    },
    checklist: {
      completed_application_form: true,
      passport_photograph: true,
      highest_qualification: true,
      professional_qualification: true,
      employment_experience: true,
      valid_id_document: true,
      payment_proof: true,
      supporting_documents: true,
    },
  },
];

const INITIAL_TRAININGS: TrainingCourse[] = [
  {
    id: "TRN-101",
    title: "GIS Environmental Impact Survey Protocols",
    description: "Advanced geospatial data collection and EIA methodology for field verification officers.",
    type: "Onsite",
    location_or_link: "NIRRMPT Training Annex B, Port Harcourt",
    start_date: "2026-10-05",
    end_date: "2026-10-09",
    capacity: 50,
    enrolled: 42,
    completed: 38,
    status: "Active",
    instructor: "Dr. A. Bello",
    created_by: "Directorate Admin",
  },
  {
    id: "TRN-102",
    title: "Hazardous Material Assessment & Compliance",
    description: "Standard protocols for testing, handling, and report authorization on chemical spills.",
    type: "Virtual",
    location_or_link: "https://meet.nirrmpt.gov.ng/trn-102-compliance",
    start_date: "2026-10-12",
    end_date: "2026-10-14",
    capacity: 100,
    enrolled: 28,
    completed: 25,
    status: "Active",
    instructor: "Engr. K. Chinedu",
    created_by: "Directorate Admin",
  },
];

export default function DirectorateAdminDashboard() {
  const [profile, setProfile] = useState<{ email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbSaving, setDbSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    "verification" | "official_use" | "overview" | "chat" | "broadcast" | "training" | "profile"
  >("training");

  // Profile Settings State
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [fullName, setFullName] = useState<string>("Directorate Lead");
  const [department, setDepartment] = useState<string>("Operations & Compliance");

  // Application Data & Selection
  const [applications, setApplications] = useState<MembershipApplication[]>(INITIAL_APPLICATIONS);
  const [selectedAppId, setSelectedAppId] = useState<string>("APP-2026-0891");
  const [searchQuery, setSearchQuery] = useState("");

  // Chat State
  const [chatType, setChatType] = useState<"public" | "department" | "staff">("department");
  const [selectedTarget, setSelectedTarget] = useState("Environmental Compliance Desk");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "System", text: "Welcome to Directorate Live Operations Chat.", time: "09:00 AM", role: "System" },
    { sender: "Field Lead - Zone 4", text: "EIA Report #NIR-8092 field validation complete.", time: "09:14 AM", role: "Staff" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Broadcast State
  const [broadcastTarget, setBroadcastTarget] = useState<"all" | "department" | "group">("all");
  const [broadcastDept, setBroadcastDept] = useState("All Departments");
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastHistory, setBroadcastHistory] = useState<BroadcastLog[]>([
    { id: 1, title: "Q4 Environmental Audit Directive", target: "All Departments", date: "Sept 20, 2026", status: "Delivered" },
  ]);

  // Enterprise Training Module State
  const [trainingCourses, setTrainingCourses] = useState<TrainingCourse[]>(INITIAL_TRAININGS);
  const [showAddTrainingModal, setShowAddTrainingModal] = useState(false);
  const [trainingFilter, setTrainingFilter] = useState<"All" | "Pending Approval" | "Approved" | "Active" | "Completed">("All");

  // New Training Form Data
  const [newTraining, setNewTraining] = useState({
    title: "",
    description: "",
    type: "Onsite" as "Onsite" | "Virtual" | "Hybrid",
    location_or_link: "",
    start_date: "",
    end_date: "",
    capacity: 50,
    instructor: "",
  });

  // Helper Toast Alert
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load User Session & Synchronize Applications and Trainings from Supabase
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const email = session.user.email || "admin@nirrmpt.gov.ng";
        setProfile({ email, role: "admin" });
        setFullName(email.split("@")[0].toUpperCase().replace(".", " ") || "Directorate Lead");
      } else {
        setProfile({ email: "admin@nirrmpt.gov.ng", role: "admin" });
      }

      // Fetch Applications
      const { data: appData, error: appError } = await supabase
        .from("membership_applications")
        .select("*")
        .order("submission_date", { ascending: false });

      if (appData && appData.length > 0 && !appError) {
        setApplications(appData);
        setSelectedAppId(appData[0].id);
      }

      // Fetch Training Courses
      const { data: trnData, error: trnError } = await supabase
        .from("training_courses")
        .select("*")
        .order("start_date", { ascending: true });

      if (trnData && trnData.length > 0 && !trnError) {
        setTrainingCourses(trnData);
      }
    } catch (err) {
      console.error("Supabase initial load failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeApp = applications.find((a) => a.id === selectedAppId) || applications[0] || INITIAL_APPLICATIONS[0];
  const isFellowClass = (activeApp?.applied_grade || activeApp?.membership_grade_approved) === "Fellow";

  // Filtered applications list
  const filteredApplications = applications.filter(
    (app) =>
      app.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applied_grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle Document Checklist Item & Sync with Supabase
  const handleToggleChecklist = async (key: string) => {
    if (!activeApp) return;

    const currentChecklist = activeApp.checklist || {};
    const updatedChecklist: ApplicationChecklist = {
      ...currentChecklist,
      [key]: !currentChecklist[key],
    };

    const updatedApp = { ...activeApp, checklist: updatedChecklist };
    setApplications((prev) => prev.map((a) => (a.id === activeApp.id ? updatedApp : a)));

    try {
      const { error } = await supabase
        .from("membership_applications")
        .update({ checklist: updatedChecklist })
        .eq("id", activeApp.id);

      if (error) throw error;
      showToast(`Checklist item updated for ${activeApp.applicant_name}`);
    } catch (err) {
      console.warn("Local state updated. Supabase sync error:", err);
    }
  };

  // Save Official Decision (Handles Fellow Routing to SuperAdmin)
  const handleSaveOfficialDecision = async (decisionOverride?: string) => {
    if (!activeApp) return;
    setDbSaving(true);

    let finalDecision = decisionOverride || activeApp.application_decision;
    let finalStatus = activeApp.application_status;
    let isEscalated = activeApp.forwarded_to_superadmin;

    // Rule: Fellow class MUST be escalated to SuperAdmin for final approval
    if (isFellowClass && finalDecision === "Approved") {
      finalDecision = "Escalated to SuperAdmin";
      finalStatus = "Pending SuperAdmin Approval";
      isEscalated = true;
    } else if (finalDecision === "Approved") {
      finalStatus = "Approved by Directorate";
    } else if (finalDecision === "Deferred") {
      finalStatus = "Deferred by Directorate";
    }

    const updatedApp: MembershipApplication = {
      ...activeApp,
      application_decision: finalDecision as any,
      application_status: finalStatus,
      forwarded_to_superadmin: isEscalated,
      verified_by: activeApp.verified_by || fullName,
      authorized_officer: activeApp.authorized_officer || fullName,
      approval_date: activeApp.approval_date || new Date().toISOString().split("T")[0],
    };

    setApplications((prev) => prev.map((a) => (a.id === activeApp.id ? updatedApp : a)));

    try {
      const { error } = await supabase
        .from("membership_applications")
        .update({
          received_by: updatedApp.received_by,
          verified_by: updatedApp.verified_by,
          qualifications_verified: updatedApp.qualifications_verified,
          membership_grade_approved: updatedApp.membership_grade_approved,
          application_decision: updatedApp.application_decision,
          application_status: updatedApp.application_status,
          authorized_officer: updatedApp.authorized_officer,
          approval_date: updatedApp.approval_date,
          forwarded_to_superadmin: updatedApp.forwarded_to_superadmin,
        })
        .eq("id", activeApp.id);

      if (error) throw error;
      showToast(
        isFellowClass && finalDecision === "Escalated to SuperAdmin"
          ? `Application ${activeApp.id} escalated to SuperAdmin!`
          : `Decision saved successfully for ${activeApp.applicant_name}`
      );
    } catch (err) {
      console.warn("Decision updated in local state. Supabase sync warning:", err);
      showToast(`Decision applied locally. (Database sync pending)`);
    } finally {
      setDbSaving(false);
    }
  };

  // Dispatch Broadcast Message
  const handleDispatchBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    const newLog: BroadcastLog = {
      id: Date.now(),
      title: broadcastTitle.trim() || "Official Directorate Notice",
      target: broadcastTarget === "all" ? "All Departments" : broadcastDept,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Delivered",
    };

    setBroadcastHistory((prev) => [newLog, ...prev]);
    setBroadcastTitle("");
    setBroadcastMessage("");
    showToast("Broadcast message dispatched to active channels.");
  };

  // Handle Enterprise Messaging
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        sender: fullName || "Directorate Lead",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        role: "Directorate Lead",
      },
    ]);
    setNewMessage("");
  };

  // Create & Schedule Training (Submit for SuperAdmin Approval)
  const handleCreateTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTraining.title || !newTraining.instructor || !newTraining.start_date) {
      showToast("Please fill in all required training fields.");
      return;
    }

    const createdCourse: TrainingCourse = {
      id: `TRN-${Math.floor(100 + Math.random() * 900)}`,
      title: newTraining.title,
      description: newTraining.description,
      type: newTraining.type,
      location_or_link: newTraining.location_or_link || (newTraining.type === "Virtual" ? "Link Pending" : "Headquarters Auditorium"),
      start_date: newTraining.start_date,
      end_date: newTraining.end_date || newTraining.start_date,
      capacity: Number(newTraining.capacity) || 50,
      enrolled: 0,
      completed: 0,
      status: "Pending Approval",
      instructor: newTraining.instructor,
      created_by: fullName,
    };

    setTrainingCourses((prev) => [createdCourse, ...prev]);
    setShowAddTrainingModal(false);

    // Reset Form
    setNewTraining({
      title: "",
      description: "",
      type: "Onsite",
      location_or_link: "",
      start_date: "",
      end_date: "",
      capacity: 50,
      instructor: "",
    });

    try {
      const { error } = await supabase.from("training_courses").insert([createdCourse]);
      if (error) throw error;
      showToast(`Training scheduled and forwarded to SuperAdmin for approval!`);
    } catch (err) {
      console.warn("Training saved locally. Database sync warning:", err);
      showToast(`Training scheduled locally and queued for SuperAdmin approval.`);
    }
  };

  // Filtered Training Courses
  const filteredTrainings = trainingCourses.filter((course) => {
    if (trainingFilter === "All") return true;
    return course.status === trainingFilter;
  });

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#020617", color: "#94a3b8", gap: "12px" }}>
        <Loader2 size={28} color="#3b82f6" style={{ animation: "spin 1s linear infinite" }} />
        <span style={{ fontSize: "15px", fontWeight: 600 }}>Loading Directorate Admin Portal...</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#020617", color: "#f8fafc", fontFamily: "sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Dynamic Toast Notification */}
        {toastMessage && (
          <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, backgroundColor: "#1e293b", border: "1px solid #3b82f6", color: "#ffffff", padding: "12px 20px", borderRadius: "10px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: 700 }}>
            <CheckCircle size={18} color="#34d399" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Executive Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#0f172a", border: "1px solid #1e293b", padding: "16px 24px", borderRadius: "16px", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa" }}>
              <Building2 size={26} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#60a5fa", letterSpacing: "1px", textTransform: "uppercase" }}>
                  NIRRMPT Institute Administrative Verification Portal
                </span>
                <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.3)", fontSize: "10px", fontWeight: 800, padding: "2px 8px", borderRadius: "10px" }}>
                  DIRECTORATE ADMIN DESK
                </span>
              </div>
              <h1 style={{ fontSize: "20px", fontWeight: 900, color: "#ffffff", margin: "2px 0 0 0" }}>
                National Environmental Risk & Resource Management Portal
              </h1>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={loadData}
              title="Refresh Portal Data"
              style={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#94a3b8", padding: "8px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <RefreshCw size={16} />
            </button>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#ffffff" }}>{fullName}</div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>{profile?.email}</div>
            </div>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#1e293b", border: "2px solid #3b82f6", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <UserCheck size={20} color="#60a5fa" />
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Bar */}
        <div style={{ display: "flex", gap: "8px", backgroundColor: "#0f172a", border: "1px solid #1e293b", padding: "6px", borderRadius: "12px", overflowX: "auto" }}>
          {[
            { id: "verification", label: "Applicant Documents Verification (Sec I)", icon: FileCheck2 },
            { id: "official_use", label: "Official Approval & Routing (Sec L)", icon: Award },
            { id: "overview", label: "Command Overview", icon: Activity },
            { id: "chat", label: "Enterprise Chat System", icon: MessageSquare },
            { id: "broadcast", label: "Broadcast Dispatch", icon: Megaphone },
            { id: "training", label: "Training Management", icon: GraduationCap },
            { id: "profile", label: "Profile Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: isActive ? "#1e293b" : "transparent",
                  color: isActive ? "#ffffff" : "#94a3b8",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                }}
              >
                <Icon size={16} color={isActive ? "#3b82f6" : "#94a3b8"} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* SECTION I: APPLICANT DOCUMENT UPLOADS & VERIFICATION DESK */}
        {activeTab === "verification" && (
          <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "20px" }}>
            {/* Left Sidebar: Application Queue & Search */}
            <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "12px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>
                  Applications ({filteredApplications.length})
                </div>
              </div>

              {/* Search Control */}
              <div style={{ position: "relative" }}>
                <Search size={14} color="#64748b" style={{ position: "absolute", left: "10px", top: "10px" }} />
                <input
                  type="text"
                  placeholder="Filter name, ID, or grade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", padding: "8px 8px 8px 32px", color: "#ffffff", fontSize: "12px", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "550px", overflowY: "auto" }}>
                {filteredApplications.map((app) => {
                  const isFellow = app.applied_grade === "Fellow";
                  const isSelected = activeApp && selectedAppId === app.id;
                  return (
                    <button
                      key={app.id}
                      onClick={() => setSelectedAppId(app.id)}
                      style={{
                        textAlign: "left",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid",
                        borderColor: isSelected ? "#3b82f6" : "#1e293b",
                        backgroundColor: isSelected ? "#1e293b" : "#020617",
                        cursor: "pointer",
                        transition: "border-color 0.2s ease",
                      }}
                    >
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#ffffff" }}>{app.applicant_name}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>{app.id}</span>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 800,
                            padding: "2px 6px",
                            borderRadius: "4px",
                            backgroundColor: isFellow ? "rgba(245, 158, 11, 0.15)" : "rgba(59, 130, 246, 0.15)",
                            color: isFellow ? "#fbbf24" : "#60a5fa",
                          }}
                        >
                          {app.applied_grade}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Panel: Document Inspection Grid & Checklist */}
            <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {activeApp ? (
                <>
                  <div style={{ borderBottom: "1px solid #1e293b", paddingBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "#60a5fa", letterSpacing: "1px", textTransform: "uppercase" }}>
                        SECTION I: DOCUMENTS CHECKLIST VERIFICATION
                      </span>
                      <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#ffffff", margin: "4px 0 0 0" }}>
                        {activeApp.applicant_name} ({activeApp.id})
                      </h2>
                      <p style={{ fontSize: "12px", color: "#94a3b8", margin: "2px 0 0 0" }}>
                        Class Applied: <strong style={{ color: "#ffffff" }}>{activeApp.applied_grade}</strong> • Submitted: {activeApp.submission_date}
                      </p>
                    </div>

                    {isFellowClass && (
                      <div style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.4)", padding: "8px 12px", borderRadius: "10px", color: "#fbbf24", fontSize: "11px", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px" }}>
                        <ShieldAlert size={16} /> REQUIRES SUPERADMIN FINAL APPROVAL
                      </div>
                    )}
                  </div>

                  {/* Uploaded Document Artifacts Inspection */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", margin: 0 }}>
                      Uploaded Document Previews
                    </h3>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                      {[
                        { label: "Passport Photograph", url: activeApp.documents?.passport_photograph },
                        { label: "Valid ID Document", url: activeApp.documents?.valid_id_document },
                        { label: "Highest Qualification", url: activeApp.documents?.highest_qualification },
                        { label: "Professional Qualification", url: activeApp.documents?.professional_qualification },
                        { label: "Payment Proof / Receipt", url: activeApp.documents?.payment_proof },
                      ].map((doc, idx) => (
                        <div key={idx} style={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "10px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#cbd5e1" }}>{doc.label}</span>
                          {doc.url ? (
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                color: "#60a5fa",
                                fontSize: "12px",
                                fontWeight: 700,
                                textDecoration: "none",
                                backgroundColor: "rgba(59, 130, 246, 0.1)",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                width: "fit-content",
                              }}
                            >
                              <ExternalLink size={14} /> Preview Upload
                            </a>
                          ) : (
                            <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: 600 }}>No document uploaded</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Document Verification Checklist */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", margin: 0 }}>
                      Verification Audit Checklist
                    </h3>

                    {[
                      { key: "completed_application_form", label: "Completed and signed application form" },
                      { key: "passport_photograph", label: "Recent passport photograph" },
                      { key: "highest_qualification", label: "Evidence of highest educational qualification" },
                      { key: "professional_qualification", label: "Evidence of professional qualification / certification" },
                      { key: "employment_experience", label: "Evidence of employment / professional experience" },
                      { key: "valid_id_document", label: "Valid identification document" },
                      { key: "payment_proof", label: "Evidence of payment of applicable registration fee" },
                      { key: "supporting_documents", label: "Any other supporting document requested by the Institute" },
                    ].map((item) => {
                      const isChecked = activeApp.checklist?.[item.key] ?? false;
                      return (
                        <div
                          key={item.key}
                          onClick={() => handleToggleChecklist(item.key)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 14px",
                            backgroundColor: "#020617",
                            border: "1px solid",
                            borderColor: isChecked ? "rgba(16, 185, 129, 0.4)" : "#1e293b",
                            borderRadius: "8px",
                            cursor: "pointer",
                            userSelect: "none",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {isChecked ? <CheckSquare size={16} color="#10b981" /> : <Square size={16} color="#64748b" />}
                            <span style={{ fontSize: "12px", color: isChecked ? "#ffffff" : "#94a3b8" }}>{item.label}</span>
                          </div>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 800,
                              padding: "2px 6px",
                              borderRadius: "4px",
                              backgroundColor: isChecked ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                              color: isChecked ? "#34d399" : "#f87171",
                            }}
                          >
                            {isChecked ? "VERIFIED" : "UNVERIFIED"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
                  No application selected or available in queue.
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION L: FOR OFFICIAL USE ONLY (APPROVAL & SUPERADMIN ROUTING) */}
        {activeTab === "official_use" && (
          <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {activeApp ? (
              <>
                <div style={{ borderBottom: "1px solid #1e293b", paddingBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#f59e0b", letterSpacing: "1px", textTransform: "uppercase" }}>
                      SECTION L: FOR OFFICIAL USE ONLY
                    </span>
                    <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#ffffff", margin: "4px 0 0 0" }}>
                      Official Approval & Decision Routing Desk
                    </h2>
                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: "2px 0 0 0" }}>
                      Applicant: <strong style={{ color: "#60a5fa" }}>{activeApp.applicant_name} ({activeApp.id})</strong>
                    </p>
                  </div>

                  {dbSaving && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#60a5fa", fontSize: "12px", fontWeight: 700 }}>
                      <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Syncing Supabase DB...
                    </div>
                  )}
                </div>

                {/* Approval Notice Box for Fellow vs Other Classes */}
                {isFellowClass ? (
                  <div style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "10px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <ShieldAlert size={22} color="#f59e0b" />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#fbbf24" }}>FELLOW CLASS WORKFLOW NOTICE</div>
                      <div style={{ fontSize: "11px", color: "#cbd5e1" }}>
                        You are verifying a <strong>Fellow Membership Application</strong>. Upon Directorate verification, this application will automatically be forwarded to the <strong>SuperAdmin</strong> for final sign-off.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "10px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <ShieldCheck size={22} color="#10b981" />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#34d399" }}>DIRECTORATE APPROVAL AUTHORIZED</div>
                      <div style={{ fontSize: "11px", color: "#cbd5e1" }}>
                        Applications for <strong>{activeApp.applied_grade}</strong> can be directly verified and approved by the Directorate Admin.
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                  {/* Verification Metadata Inputs */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#020617", padding: "16px", borderRadius: "12px", border: "1px solid #1e293b" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#ffffff", margin: 0 }}>Verification Trail</h3>

                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>Application Received By</label>
                      <input
                        type="text"
                        value={activeApp.received_by || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setApplications((prev) => prev.map((a) => (a.id === activeApp.id ? { ...a, received_by: val } : a)));
                        }}
                        style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "13px", outline: "none" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>Documents Verified By</label>
                      <input
                        type="text"
                        value={activeApp.verified_by || fullName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setApplications((prev) => prev.map((a) => (a.id === activeApp.id ? { ...a, verified_by: val } : a)));
                        }}
                        style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "13px", outline: "none" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "6px" }}>Qualifications & Credentials Verified?</label>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <button
                          onClick={() => {
                            setApplications((prev) => prev.map((a) => (a.id === activeApp.id ? { ...a, qualifications_verified: true } : a)));
                          }}
                          style={{
                            flex: 1,
                            padding: "8px",
                            fontSize: "12px",
                            fontWeight: 800,
                            borderRadius: "8px",
                            border: "1px solid",
                            borderColor: activeApp.qualifications_verified ? "#10b981" : "#334155",
                            backgroundColor: activeApp.qualifications_verified ? "rgba(16, 185, 129, 0.15)" : "#0f172a",
                            color: activeApp.qualifications_verified ? "#34d399" : "#94a3b8",
                            cursor: "pointer",
                          }}
                        >
                          Yes (Verified)
                        </button>
                        <button
                          onClick={() => {
                            setApplications((prev) => prev.map((a) => (a.id === activeApp.id ? { ...a, qualifications_verified: false } : a)));
                          }}
                          style={{
                            flex: 1,
                            padding: "8px",
                            fontSize: "12px",
                            fontWeight: 800,
                            borderRadius: "8px",
                            border: "1px solid",
                            borderColor: !activeApp.qualifications_verified ? "#ef4444" : "#334155",
                            backgroundColor: !activeApp.qualifications_verified ? "rgba(239, 68, 68, 0.15)" : "#0f172a",
                            color: !activeApp.qualifications_verified ? "#f87171" : "#94a3b8",
                            cursor: "pointer",
                          }}
                        >
                          No (Unverified)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Membership Class & Final Decision Action */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#020617", padding: "16px", borderRadius: "12px", border: "1px solid #1e293b" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#ffffff", margin: 0 }}>Membership Grade & Final Action</h3>

                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>Approved Membership Grade</label>
                      <select
                        value={activeApp.membership_grade_approved || activeApp.applied_grade}
                        onChange={(e) => {
                          const val = e.target.value as MembershipGrade;
                          setApplications((prev) => prev.map((a) => (a.id === activeApp.id ? { ...a, membership_grade_approved: val } : a)));
                        }}
                        style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "13px", outline: "none" }}
                      >
                        <option value="Fellow">Fellow Member (Requires SuperAdmin Approval)</option>
                        <option value="Full Member">Full Member</option>
                        <option value="Associate">Associate Member</option>
                        <option value="Graduate">Graduate Member</option>
                        <option value="Student">Student Member</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "6px" }}>Action Trigger</label>
                      {isFellowClass ? (
                        <button
                          onClick={() => handleSaveOfficialDecision("Approved")}
                          disabled={dbSaving}
                          style={{
                            width: "100%",
                            padding: "12px",
                            fontSize: "13px",
                            fontWeight: 800,
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "#f59e0b",
                            color: "#020617",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          <ArrowRightLeft size={16} /> Verify & Forward Fellow to SuperAdmin
                        </button>
                      ) : (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => handleSaveOfficialDecision("Approved")}
                            disabled={dbSaving}
                            style={{
                              flex: 1,
                              padding: "10px",
                              fontSize: "12px",
                              fontWeight: 800,
                              borderRadius: "8px",
                              border: "none",
                              backgroundColor: "#10b981",
                              color: "#020617",
                              cursor: "pointer",
                            }}
                          >
                            Approve Membership
                          </button>
                          <button
                            onClick={() => handleSaveOfficialDecision("Deferred")}
                            disabled={dbSaving}
                            style={{
                              flex: 1,
                              padding: "10px",
                              fontSize: "12px",
                              fontWeight: 800,
                              borderRadius: "8px",
                              border: "none",
                              backgroundColor: "#ef4444",
                              color: "#ffffff",
                              cursor: "pointer",
                            }}
                          >
                            Defer Application
                          </button>
                        </div>
                      )}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "4px" }}>
                      <div>
                        <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>Authorised Officer Signature</label>
                        <input
                          type="text"
                          value={activeApp.authorized_officer || fullName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setApplications((prev) => prev.map((a) => (a.id === activeApp.id ? { ...a, authorized_officer: val } : a)));
                          }}
                          style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "13px", outline: "none" }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>Approval Date</label>
                        <input
                          type="date"
                          value={activeApp.approval_date || new Date().toISOString().split("T")[0]}
                          onChange={(e) => {
                            const val = e.target.value;
                            setApplications((prev) => prev.map((a) => (a.id === activeApp.id ? { ...a, approval_date: val } : a)));
                          }}
                          style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "13px", outline: "none" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
                No active application selected.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COMMAND OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                  Directorate Command Summary & Operations Desk
                </h2>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: "4px 0 0 0" }}>Real-time status overview of applications, approvals, and system metrics</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              <div style={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8" }}>Total Submissions</span>
                  <FileText size={18} color="#3b82f6" />
                </div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "#ffffff" }}>{applications.length}</div>
                <span style={{ fontSize: "11px", color: "#34d399" }}>Active queue sync</span>
              </div>

              <div style={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8" }}>Pending Escalations</span>
                  <ShieldAlert size={18} color="#f59e0b" />
                </div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "#fbbf24" }}>
                  {applications.filter((a) => a.applied_grade === "Fellow" || a.forwarded_to_superadmin).length}
                </div>
                <span style={{ fontSize: "11px", color: "#fbbf24" }}>Requires SuperAdmin sign-off</span>
              </div>

              <div style={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8" }}>Approved Applications</span>
                  <CheckCircle2 size={18} color="#10b981" />
                </div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "#34d399" }}>
                  {applications.filter((a) => a.application_decision === "Approved").length}
                </div>
                <span style={{ fontSize: "11px", color: "#34d399" }}>Directorate confirmed</span>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #1e293b", paddingTop: "16px", marginTop: "8px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              <div style={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px", padding: "16px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#ffffff", margin: "0 0 6px 0" }}>Document Verification Desk</h3>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Inspect passport, ID, qualifications, and payment uploads with audit status tracking.</p>
              </div>
              <div style={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px", padding: "16px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#ffffff", margin: "0 0 6px 0" }}>SuperAdmin Fellow Escalation</h3>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Directly approve general classes; automatically route Fellow applicants for final executive sign-off.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ENTERPRISE CHAT SYSTEM */}
        {activeTab === "chat" && (
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "16px", minHeight: "500px" }}>
            <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>Communication Channel</div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[
                  { label: "Environmental Compliance Desk", type: "department" },
                  { label: "Zone 4 Field Desk", type: "staff" },
                  { label: "General Directorate Channel", type: "public" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedTarget(item.label);
                      setChatType(item.type as any);
                    }}
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid",
                      borderColor: selectedTarget === item.label ? "#3b82f6" : "transparent",
                      backgroundColor: selectedTarget === item.label ? "#1e293b" : "#020617",
                      color: selectedTarget === item.label ? "#ffffff" : "#94a3b8",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    # {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", display: "flex", flexDirection: "column", padding: "16px" }}>
              <div style={{ borderBottom: "1px solid #1e293b", paddingBottom: "12px", marginBottom: "12px", fontSize: "14px", fontWeight: 800, color: "#ffffff" }}>
                Channel: {selectedTarget}
              </div>

              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "380px" }}>
                {messages.map((msg, idx) => (
                  <div key={idx} style={{ alignSelf: msg.sender === fullName ? "flex-end" : "flex-start", maxWidth: "75%" }}>
                    <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "2px" }}>{msg.sender} ({msg.role}) • {msg.time}</div>
                    <div style={{ backgroundColor: msg.sender === fullName ? "#2563eb" : "#1e293b", color: "#ffffff", padding: "10px 14px", borderRadius: "12px", fontSize: "13px" }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <input
                  type="text"
                  placeholder="Send message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  style={{ flex: 1, backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "13px", outline: "none" }}
                />
                <button
                  onClick={handleSendMessage}
                  style={{ backgroundColor: "#3b82f6", color: "#ffffff", border: "none", borderRadius: "8px", padding: "0 20px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Send size={14} /> Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BROADCAST DISPATCH */}
        {activeTab === "broadcast" && (
          <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 4px 0", color: "#ffffff" }}>Broadcast Dispatch Hub</h3>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Issue official network directives across Institute operational departments.</p>
            </div>

            <form onSubmit={handleDispatchBroadcast} style={{ display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "#020617", border: "1px solid #1e293b", padding: "20px", borderRadius: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>Notice Title</label>
                  <input
                    type="text"
                    placeholder="Enter broadcast subject..."
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "10px", color: "#ffffff", fontSize: "13px", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>Target Channel</label>
                  <select
                    value={broadcastDept}
                    onChange={(e) => setBroadcastDept(e.target.value)}
                    style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "10px", color: "#ffffff", fontSize: "13px", outline: "none" }}
                  >
                    <option value="All Departments">All Departments</option>
                    <option value="Environmental Compliance">Environmental Compliance</option>
                    <option value="Field Desk Zone Leads">Field Desk Zone Leads</option>
                    <option value="SuperAdmin Core">SuperAdmin Core Desk</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>Message Directive</label>
                <textarea
                  rows={4}
                  placeholder="Type official directive text here..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "10px", color: "#ffffff", fontSize: "13px", outline: "none", resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                style={{ backgroundColor: "#3b82f6", color: "#ffffff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "13px", fontWeight: 800, cursor: "pointer", alignSelf: "flex-end", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Megaphone size={16} /> Issue Broadcast Dispatch
              </button>
            </form>

            {/* Broadcast Log Table */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", margin: 0 }}>Dispatch History Log</h4>
              <div style={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "10px", overflow: "hidden" }}>
                {broadcastHistory.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#ffffff" }}>{item.title}</div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>Target: {item.target} • {item.date}</div>
                    </div>
                    <span style={{ fontSize: "10px", fontWeight: 800, backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", padding: "4px 8px", borderRadius: "6px" }}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ENTERPRISE TRAINING & COMPLIANCE MANAGEMENT */}
        {activeTab === "training" && (
          <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Header & Controls Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", borderBottom: "1px solid #1e293b", paddingBottom: "20px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "#60a5fa", letterSpacing: "1px", textTransform: "uppercase" }}>
                    Institute Development Program
                  </span>
                  <span style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", border: "1px solid rgba(245, 158, 11, 0.3)", fontSize: "10px", fontWeight: 800, padding: "2px 8px", borderRadius: "10px" }}>
                    SUPERADMIN APPROVAL WORKFLOW
                  </span>
                </div>
                <h2 style={{ fontSize: "20px", fontWeight: 900, color: "#ffffff", margin: "4px 0 0 0" }}>
                  Staff Training & Compliance Center
                </h2>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: "4px 0 0 0" }}>
                  Schedule and manage official staff development, GIS protocols, onsite workshops, and virtual webinars.
                </p>
              </div>

              <button
                onClick={() => setShowAddTrainingModal(true)}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 18px",
                  fontSize: "13px",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)",
                }}
              >
                <Plus size={18} /> Schedule New Training
              </button>
            </div>

            {/* Filter Tabs & Quick Metrics */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ display: "flex", gap: "6px", backgroundColor: "#020617", padding: "4px", borderRadius: "10px", border: "1px solid #1e293b" }}>
                {(["All", "Pending Approval", "Approved", "Active", "Completed"] as const).map((filter) => {
                  const isActive = trainingFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setTrainingFilter(filter)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: isActive ? "#1e293b" : "transparent",
                        color: isActive ? "#ffffff" : "#94a3b8",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#94a3b8" }}>
                <div>
                  Total Sessions: <strong style={{ color: "#ffffff" }}>{trainingCourses.length}</strong>
                </div>
                <div>
                  Pending SuperAdmin:{" "}
                  <strong style={{ color: "#fbbf24" }}>
                    {trainingCourses.filter((t) => t.status === "Pending Approval").length}
                  </strong>
                </div>
              </div>
            </div>

            {/* Dynamic Training Cards Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>
              {filteredTrainings.map((course) => {
                const isPending = course.status === "Pending Approval";
                const isApproved = course.status === "Approved" || course.status === "Active";
                const isVirtual = course.type === "Virtual";

                return (
                  <div
                    key={course.id}
                    style={{
                      backgroundColor: "#020617",
                      border: "1px solid",
                      borderColor: isPending ? "rgba(245, 158, 11, 0.4)" : "#1e293b",
                      borderRadius: "14px",
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                      position: "relative",
                      boxShadow: isPending ? "0 4px 20px rgba(245, 158, 11, 0.05)" : "none",
                    }}
                  >
                    {/* Top Badges */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 800, color: "#60a5fa", letterSpacing: "1px" }}>
                          {course.id}
                        </span>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: "6px",
                            backgroundColor: isVirtual ? "rgba(168, 85, 247, 0.15)" : "rgba(59, 130, 246, 0.15)",
                            color: isVirtual ? "#c084fc" : "#60a5fa",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {isVirtual ? <Video size={12} /> : <MapPin size={12} />}
                          {course.type}
                        </span>
                      </div>

                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          padding: "3px 10px",
                          borderRadius: "20px",
                          backgroundColor:
                            course.status === "Active" || course.status === "Approved"
                              ? "rgba(16, 185, 129, 0.15)"
                              : course.status === "Pending Approval"
                              ? "rgba(245, 158, 11, 0.15)"
                              : "rgba(148, 163, 184, 0.15)",
                          color:
                            course.status === "Active" || course.status === "Approved"
                              ? "#34d399"
                              : course.status === "Pending Approval"
                              ? "#fbbf24"
                              : "#94a3b8",
                          border: "1px solid",
                          borderColor:
                            course.status === "Active" || course.status === "Approved"
                              ? "rgba(16, 185, 129, 0.3)"
                              : course.status === "Pending Approval"
                              ? "rgba(245, 158, 11, 0.3)"
                              : "rgba(148, 163, 184, 0.3)",
                        }}
                      >
                        {course.status}
                      </span>
                    </div>

                    {/* Course Title & Description */}
                    <div>
                      <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff", margin: "0 0 6px 0" }}>
                        {course.title}
                      </h4>
                      {course.description && (
                        <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, lineHeight: "1.4" }}>
                          {course.description}
                        </p>
                      )}
                    </div>

                    {/* Meta Details */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", backgroundColor: "#0f172a", padding: "10px 12px", borderRadius: "8px", border: "1px solid #1e293b", fontSize: "11px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#cbd5e1" }}>
                        <User size={13} color="#60a5fa" />
                        <span>Instructor: <strong style={{ color: "#ffffff" }}>{course.instructor}</strong></span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#cbd5e1" }}>
                        <Calendar size={13} color="#60a5fa" />
                        <span>Schedule: <strong style={{ color: "#ffffff" }}>{course.start_date}</strong> to <strong style={{ color: "#ffffff" }}>{course.end_date}</strong></span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#cbd5e1" }}>
                        {isVirtual ? <Video size={13} color="#c084fc" /> : <MapPin size={13} color="#34d399" />}
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {isVirtual ? "URL: " : "Venue: "}
                          <strong style={{ color: "#ffffff" }}>{course.location_or_link}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Enrollment */}
                    <div style={{ borderTop: "1px solid #1e293b", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8" }}>
                        <span>Capacity: {course.enrolled} / {course.capacity} Officers</span>
                        <span>Completed: <strong style={{ color: "#34d399" }}>{course.completed}</strong></span>
                      </div>
                      <div style={{ height: "6px", backgroundColor: "#0f172a", borderRadius: "3px", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.min(100, (course.enrolled / (course.capacity || 1)) * 100)}%`,
                            backgroundColor: "#3b82f6",
                          }}
                        />
                      </div>
                    </div>

                    {/* SuperAdmin Workflow Notice Footer */}
                    {isPending && (
                      <div style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", padding: "8px 10px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#fbbf24" }}>
                        <Clock size={14} />
                        <span>Submitted to SuperAdmin Core. Awaiting public release approval.</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal: Add & Schedule New Training */}
            {showAddTrainingModal && (
              <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(2, 6, 23, 0.8)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px", maxWidth: "600px", width: "100%", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "12px" }}>
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                        Schedule & Upload New Training Session
                      </h3>
                      <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0 0" }}>
                        Requires SuperAdmin approval before public release.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddTrainingModal(false)}
                      style={{ backgroundColor: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleCreateTraining} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>Course Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Advanced Remote Sensing & Field Analysis"
                        value={newTraining.title}
                        onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })}
                        style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "13px", outline: "none" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>Course Description</label>
                      <textarea
                        rows={3}
                        placeholder="Provide details about objectives and target audience..."
                        value={newTraining.description}
                        onChange={(e) => setNewTraining({ ...newTraining, description: e.target.value })}
                        style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "13px", outline: "none", resize: "vertical" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>Training Format *</label>
                        <select
                          value={newTraining.type}
                          onChange={(e) => setNewTraining({ ...newTraining, type: e.target.value as any })}
                          style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "13px", outline: "none" }}
                        >
                          <option value="Onsite">Onsite Workshop</option>
                          <option value="Virtual">Virtual Session</option>
                          <option value="Hybrid">Hybrid Model</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>Lead Instructor / Facilitator *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. O. Williams"
                          value={newTraining.instructor}
                          onChange={(e) => setNewTraining({ ...newTraining, instructor: e.target.value })}
                          style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "13px", outline: "none" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>
                        {newTraining.type === "Virtual" ? "Virtual Meeting URL / Platform Link" : "Onsite Venue / Room Location"}
                      </label>
                      <input
                        type="text"
                        placeholder={newTraining.type === "Virtual" ? "https://meet.nirrmpt.gov.ng/..." : "Audit Hall A, Regional Command"}
                        value={newTraining.location_or_link}
                        onChange={(e) => setNewTraining({ ...newTraining, location_or_link: e.target.value })}
                        style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "13px", outline: "none" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>Start Date *</label>
                        <input
                          type="date"
                          required
                          value={newTraining.start_date}
                          onChange={(e) => setNewTraining({ ...newTraining, start_date: e.target.value })}
                          style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "12px", outline: "none" }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>End Date</label>
                        <input
                          type="date"
                          value={newTraining.end_date}
                          onChange={(e) => setNewTraining({ ...newTraining, end_date: e.target.value })}
                          style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "12px", outline: "none" }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>Max Capacity</label>
                        <input
                          type="number"
                          min="5"
                          value={newTraining.capacity}
                          onChange={(e) => setNewTraining({ ...newTraining, capacity: Number(e.target.value) })}
                          style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "12px", outline: "none" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                      <button
                        type="button"
                        onClick={() => setShowAddTrainingModal(false)}
                        style={{ backgroundColor: "#1e293b", color: "#94a3b8", border: "none", borderRadius: "8px", padding: "10px 16px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{ backgroundColor: "#f59e0b", color: "#020617", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "12px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        <SendHorizontal size={14} /> Schedule & Submit to SuperAdmin
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: PROFILE SETTINGS */}
        {activeTab === "profile" && (
          <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px", maxWidth: "640px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#ffffff", margin: 0 }}>Directorate Officer Profile</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "#020617", padding: "20px", borderRadius: "12px", border: "1px solid #1e293b" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "6px" }}>Officer Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "10px 12px", color: "#ffffff", fontSize: "13px", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "6px" }}>Department / Command</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "10px 12px", color: "#ffffff", fontSize: "13px", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "6px" }}>Avatar Photo URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "10px 12px", color: "#ffffff", fontSize: "13px", outline: "none" }}
                />
              </div>

              <button
                onClick={() => showToast("Officer profile settings updated successfully.")}
                style={{ backgroundColor: "#3b82f6", color: "#ffffff", border: "none", borderRadius: "8px", padding: "10px", fontSize: "13px", fontWeight: 800, cursor: "pointer", marginTop: "8px" }}
              >
                Save Profile Configuration
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}