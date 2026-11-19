"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { logoutAction } from "@/app/actions/auth";
import { onboardStaffAction, updateUserRoleAction } from "@/app/actions/cms";
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
  LogOut,
  UserPlus,
  Scale,
  Compass,
  FileEdit,
  Tag,
  Paperclip,
  Download,
  Sliders,
} from "lucide-react";

// --- Types ---
export type MembershipGrade = "Fellow" | "Full Member" | "Associate" | "Graduate" | "Student";

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
  documents: Record<string, string | undefined>;
  checklist: Record<string, boolean>;
}

export interface TrainingCourse {
  id: string;
  title: string;
  type: "Onsite" | "Virtual" | "Hybrid";
  location_or_link: string;
  start_date: string;
  end_date: string;
  capacity: number;
  enrolled: number;
  completed: number;
  status: "Draft" | "Pending Approval" | "Approved" | "Active" | "Completed" | "Rejected";
  instructor: string;
}

export interface PermitApplicationItem {
  id: string;
  applicationNumber: string;
  companyName: string;
  permitType: string;
  state: string;
  status: "UNDER_REVIEW" | "APPROVED" | "FIELD_INSPECTION" | "DEFERRED";
  date: string;
}

export interface FOIItem {
  id: string;
  trackingCode: string;
  fullName: string;
  organization: string;
  subject: string;
  daysRemaining: number;
  status: "SUBMITTED" | "UNDER_REVIEW" | "RESPONDED";
}

export interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
}

// --- Initial Verified Data Fallbacks ---
const INITIAL_APPLICATIONS: MembershipApplication[] = [
  {
    id: "APP-2026-0891",
    applicant_name: "Dr. Emmanuel Etuk",
    email: "e.etuk@nirrmpt.org",
    applied_grade: "Fellow",
    submission_date: "2026-10-14",
    application_status: "Pending Directorate Verification",
    received_by: "Admin Desk Officer",
    verified_by: "Pending Verification",
    qualifications_verified: true,
    membership_grade_approved: "Fellow",
    application_decision: "Pending",
    authorized_officer: "",
    approval_date: "",
    forwarded_to_superadmin: false,
    documents: {
      passport_photograph: "https://via.placeholder.com/150",
      valid_id_document: "https://via.placeholder.com/300x200?text=National+ID",
      highest_qualification: "https://via.placeholder.com/300x200?text=Ph.D.+Degree+Certificate",
      professional_qualification: "https://via.placeholder.com/300x200?text=Professional+Charter",
      payment_proof: "https://via.placeholder.com/300x200?text=Official+Receipt",
    },
    checklist: {
      completed_application_form: true,
      passport_photograph: true,
      highest_qualification: true,
      professional_qualification: true,
      employment_experience: true,
      valid_id_document: true,
      payment_proof: true,
      supporting_documents: false,
    },
  },
  {
    id: "APP-2026-0892",
    applicant_name: "Engr. Amina Abubakar",
    email: "a.abubakar@nirrmpt.org",
    applied_grade: "Full Member",
    submission_date: "2026-10-18",
    application_status: "Pending Directorate Verification",
    received_by: "Admin Desk Officer",
    verified_by: "Pending Verification",
    qualifications_verified: true,
    membership_grade_approved: "Full Member",
    application_decision: "Pending",
    authorized_officer: "",
    approval_date: "",
    forwarded_to_superadmin: false,
    documents: {
      passport_photograph: "https://via.placeholder.com/150",
      valid_id_document: "https://via.placeholder.com/300x200?text=Voters+Card",
      highest_qualification: "https://via.placeholder.com/300x200?text=M.Sc.+Certificate",
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
    type: "Onsite",
    location_or_link: "NIRRMPT Training Annex B, Port Harcourt",
    start_date: "2026-11-16",
    end_date: "2026-11-20",
    capacity: 60,
    enrolled: 44,
    completed: 0,
    status: "Active",
    instructor: "Dr. Emmanuel Etuk, FNIRRMPT",
  },
  {
    id: "TRN-102",
    title: "Hazardous Material Assessment & Chemical Baseline Audits",
    type: "Virtual",
    location_or_link: "https://meet.nirrmpt.org/trn-102",
    start_date: "2026-12-02",
    end_date: "2026-12-05",
    capacity: 100,
    enrolled: 28,
    completed: 0,
    status: "Active",
    instructor: "Engr. K. Chinedu",
  },
];

const INITIAL_PERMITS: PermitApplicationItem[] = [
  {
    id: "prm-1",
    applicationNumber: "PRM-NIRRMPT-2026-0891",
    companyName: "Apex Marine & Ecological Services Ltd",
    permitType: "Bio-Remediation Field Operations Clearance",
    state: "Rivers State",
    status: "FIELD_INSPECTION",
    date: "Oct 18, 2026",
  },
  {
    id: "prm-2",
    applicationNumber: "PRM-NIRRMPT-2026-0892",
    companyName: "Trans-Niger Watershed Consortium",
    permitType: "Industrial Effluent & Discharge Permit",
    state: "Delta State",
    status: "UNDER_REVIEW",
    date: "Nov 02, 2026",
  },
];

const INITIAL_FOI: FOIItem[] = [
  {
    id: "foi-1",
    trackingCode: "FOI-NIRRMPT-2026-0042",
    fullName: "Mr. Chukwuma Obi",
    organization: "Civil Ecological Justice Initiative",
    subject: "Sector 4 Coastal Soil Salinity Baseline Data Disclosure",
    daysRemaining: 4,
    status: "UNDER_REVIEW",
  },
];

const INITIAL_STAFF: StaffMember[] = [
  { id: "s-1", fullName: "Engr. Amina Abubakar", email: "field.staff@nirrmpt.org", role: "STAFF_ADMIN", department: "GIS & Remote Sensing", isActive: true },
  { id: "s-2", fullName: "Dr. Kenneth Okafor", email: "k.okafor@nirrmpt.org", role: "RESEARCHER", department: "Soil Remediation", isActive: true },
  { id: "s-3", fullName: "Barr. Florence Danjuma", email: "f.danjuma@nirrmpt.org", role: "STAFF_ADMIN", department: "Legal Affairs & FOI Desk", isActive: true },
];

export default function DirectorateAdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dbSaving, setDbSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    | "verification"
    | "official_use"
    | "overview"
    | "permits_eia"
    | "training"
    | "foi"
    | "staff_onboarding"
    | "gis_preview"
    | "profile"
  >("verification");

  // User Profile
  const [fullName, setFullName] = useState<string>("Directorate Operations Lead");
  const [userEmail, setUserEmail] = useState<string>("directorate@nirrmpt.org");
  const [department, setDepartment] = useState<string>("Operations & Compliance");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  // Delegated permissions from Super Admin
  const [hasFellowDelegation, setHasFellowDelegation] = useState(true);
  const [hasCmsDelegation, setHasCmsDelegation] = useState(true);

  // Operational Data State
  const [applications, setApplications] = useState<MembershipApplication[]>(INITIAL_APPLICATIONS);
  const [selectedAppId, setSelectedAppId] = useState<string>("APP-2026-0891");
  const [searchQuery, setSearchQuery] = useState("");
  const [trainingCourses, setTrainingCourses] = useState<TrainingCourse[]>(INITIAL_TRAININGS);
  const [permitsList, setPermitsList] = useState<PermitApplicationItem[]>(INITIAL_PERMITS);
  const [foiList, setFoiList] = useState<FOIItem[]>(INITIAL_FOI);
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);

  // Modals & Forms
  const [showAddTrainingModal, setShowAddTrainingModal] = useState(false);
  const [newTraining, setNewTraining] = useState({
    title: "",
    type: "Onsite" as "Onsite" | "Virtual" | "Hybrid",
    location_or_link: "",
    start_date: "",
    end_date: "",
    capacity: 60,
    instructor: "",
  });

  const [onboardForm, setOnboardForm] = useState({
    fullName: "",
    email: "",
    password: "",
    department: "Environmental Protection & Monitoring",
    phoneNumber: "",
    role: "STAFF_ADMIN",
  });
  const [onboardingSubmitting, setOnboardingSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSignOut = async () => {
    if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.auth.signOut();
    }
    await logoutAction();
    window.location.href = "/portal/login";
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 200);
  }, []);

  const activeApp = applications.find((a) => a.id === selectedAppId) || applications[0] || INITIAL_APPLICATIONS[0];
  const isFellowClass = (activeApp?.applied_grade || activeApp?.membership_grade_approved) === "Fellow";

  const filteredApplications = applications.filter(
    (app) =>
      app.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applied_grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle Checklist Item
  const handleToggleChecklist = (key: string) => {
    if (!activeApp) return;
    const currentChecklist = activeApp.checklist || {};
    const updatedChecklist = { ...currentChecklist, [key]: !currentChecklist[key] };
    const updatedApp = { ...activeApp, checklist: updatedChecklist };
    setApplications((prev) => prev.map((a) => (a.id === activeApp.id ? updatedApp : a)));
    showToast(`Verification status updated for item.`);
  };

  // Save Official Decision (Handles Fellow Routing vs Direct Approval)
  const handleSaveOfficialDecision = (decision: "Approved" | "Deferred" | "Not Approved") => {
    if (!activeApp) return;
    setDbSaving(true);

    let finalDecision: any = decision;
    let finalStatus = activeApp.application_status;
    let isEscalated = false;

    if (isFellowClass && decision === "Approved") {
      if (hasFellowDelegation) {
        finalStatus = "Approved by Directorate (Delegated Authority)";
        finalDecision = "Approved";
      } else {
        finalDecision = "Escalated to SuperAdmin";
        finalStatus = "Pending SuperAdmin Final Approval";
        isEscalated = true;
      }
    } else if (decision === "Approved") {
      finalStatus = "Approved by Directorate";
    } else if (decision === "Deferred") {
      finalStatus = "Deferred by Directorate";
    }

    const updatedApp: MembershipApplication = {
      ...activeApp,
      application_decision: finalDecision,
      application_status: finalStatus,
      forwarded_to_superadmin: isEscalated,
      verified_by: fullName,
      authorized_officer: fullName,
      approval_date: new Date().toISOString().split("T")[0],
    };

    setApplications((prev) => prev.map((a) => (a.id === activeApp.id ? updatedApp : a)));
    setDbSaving(false);
    showToast(
      isFellowClass && finalDecision === "Escalated to SuperAdmin"
        ? `Application ${activeApp.id} forwarded to SuperAdmin!`
        : `Statutory determination recorded for ${activeApp.applicant_name}`
    );
  };

  // Staff Onboarding Form
  const handleOnboardStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardingSubmitting(true);

    const formData = new FormData();
    formData.append("fullName", onboardForm.fullName);
    formData.append("email", onboardForm.email);
    formData.append("password", onboardForm.password);
    formData.append("department", onboardForm.department);
    formData.append("phoneNumber", onboardForm.phoneNumber);
    formData.append("role", onboardForm.role);

    const res = await onboardStaffAction(formData);
    setOnboardingSubmitting(false);

    if (res && res.success) {
      showToast(`Officer ${onboardForm.fullName} onboarded successfully!`);
      setStaffList((prev) => [
        {
          id: `s-${Date.now()}`,
          fullName: onboardForm.fullName,
          email: onboardForm.email,
          role: onboardForm.role,
          department: onboardForm.department,
          isActive: true,
        },
        ...prev,
      ]);
      setOnboardForm({
        fullName: "",
        email: "",
        password: "",
        department: "Environmental Protection & Monitoring",
        phoneNumber: "",
        role: "STAFF_ADMIN",
      });
    } else {
      showToast(res?.error || "Onboarding registered in local roster.");
    }
  };

  // Role Reassignment
  const handleReassignRole = async (userId: string, newRole: string) => {
    setStaffList((prev) => prev.map((s) => (s.id === userId ? { ...s, role: newRole } : s)));
    await updateUserRoleAction(userId, newRole, userEmail);
    showToast(`Role updated to ${newRole}`);
  };

  // Schedule Training Cohort
  const handleCreateTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTraining.title || !newTraining.instructor || !newTraining.start_date) {
      showToast("Please fill in required fields.");
      return;
    }

    const created: TrainingCourse = {
      id: `TRN-${Math.floor(100 + Math.random() * 900)}`,
      title: newTraining.title,
      type: newTraining.type,
      location_or_link: newTraining.location_or_link || "Headquarters Auditorium",
      start_date: newTraining.start_date,
      end_date: newTraining.end_date || newTraining.start_date,
      capacity: Number(newTraining.capacity) || 60,
      enrolled: 0,
      completed: 0,
      status: "Active",
      instructor: newTraining.instructor,
    };

    setTrainingCourses((prev) => [created, ...prev]);
    setShowAddTrainingModal(false);
    showToast(`Cohort published and open for public enrollment!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-3 text-emerald-400 font-sans">
        <Loader2 size={32} className="animate-spin text-emerald-400" />
        <span className="text-xs font-bold uppercase tracking-widest">Loading Directorate Admin Operations...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-6 sm:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Dynamic Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] border border-emerald-500 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold">
            <CheckCircle size={18} className="text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Executive Header */}
        <header className="bg-[#0f172a] border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Building2 size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  NIRRMPT Directorate Verification Portal
                </span>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[9px] font-black px-2 py-0.5 rounded uppercase">
                  DIRECTORATE ADMIN DESK
                </span>
                {hasFellowDelegation && (
                  <span className="bg-amber-950 text-amber-300 border border-amber-500/30 text-[9px] font-black px-2 py-0.5 rounded uppercase">
                    FELLOW APPROVAL DELEGATED
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                National Environmental Risk & Resource Management Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap self-end md:self-center">
            {hasCmsDelegation && (
              <Link
                href="/dashboard/super-admin/cms"
                className="px-3.5 py-1.5 bg-[#004d2c] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
              >
                <FileEdit size={14} />
                <span>Public CMS</span>
              </Link>
            )}

            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block">{fullName}</span>
              <span className="text-[11px] font-mono text-slate-400">{userEmail}</span>
            </div>

            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Tab Navigation (Role-Isolated: Only Directorate Admin Tools!) */}
        <nav className="bg-[#0f172a] border border-slate-800 p-2 rounded-2xl flex gap-1.5 overflow-x-auto shadow-xl">
          {[
            { id: "verification", label: "Applicant Documents (Sec I)", icon: FileCheck2 },
            { id: "official_use", label: "Official Approval (Sec L)", icon: Award },
            { id: "overview", label: "Command Overview", icon: Activity },
            { id: "permits_eia", label: "Permits & EIA Vetting", icon: FileText },
            { id: "training", label: "Training Management", icon: GraduationCap },
            { id: "foi", label: "FOI Disclosures", icon: Scale },
            { id: "staff_onboarding", label: "Staff Onboarding & Roles", icon: UserPlus },
            { id: "gis_preview", label: "Phase 2 GIS Telemetry", icon: Compass },
            { id: "profile", label: "Profile Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#004d2c] text-white shadow-md border border-emerald-500/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon size={14} className={isActive ? "text-emerald-300" : "text-slate-500"} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* TAB 1: SECTION I — APPLICANT DOCUMENT VERIFICATION DESK */}
        {activeTab === "verification" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Applications Queue */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Applications Queue ({filteredApplications.length})
                </span>
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter by applicant or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredApplications.map((app) => {
                  const isSelected = activeApp && selectedAppId === app.id;
                  const isFellow = app.applied_grade === "Fellow";

                  return (
                    <button
                      key={app.id}
                      onClick={() => setSelectedAppId(app.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition ${
                        isSelected
                          ? "bg-slate-950 border-emerald-500/60 shadow-md"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-white block">{app.applicant_name}</span>
                          <span className="font-mono text-[10px] text-slate-400">{app.id}</span>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            isFellow ? "bg-amber-950 text-amber-300 border border-amber-500/30" : "bg-emerald-950 text-emerald-300"
                          }`}
                        >
                          {app.applied_grade}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Columns: Inspection Grid & Audit Checklist (2 Cols) */}
            <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              {activeApp ? (
                <>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                        SECTION I: STATUTORY DOCUMENT AUDIT
                      </span>
                      <h2 className="text-xl font-bold text-white mt-1">
                        {activeApp.applicant_name} ({activeApp.id})
                      </h2>
                      <p className="text-xs text-slate-400">
                        Grade Requested: <strong className="text-white">{activeApp.applied_grade}</strong> · Submitted: {activeApp.submission_date}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab("official_use")}
                      className="px-4 py-2 bg-[#004d2c] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                    >
                      <span>Proceed to Official Approval (Sec L)</span>
                      <ArrowRightLeft size={13} />
                    </button>
                  </div>

                  {/* Document Previews */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Uploaded Statutory Evidence
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { label: "Passport Photograph", url: activeApp.documents?.passport_photograph },
                        { label: "Valid Identification", url: activeApp.documents?.valid_id_document },
                        { label: "Highest Qualification", url: activeApp.documents?.highest_qualification },
                        { label: "Professional Certificate", url: activeApp.documents?.professional_qualification },
                        { label: "Payment Proof / Receipt", url: activeApp.documents?.payment_proof },
                      ].map((doc, i) => (
                        <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                          <span className="text-[11px] font-bold text-slate-300 block truncate">{doc.label}</span>
                          {doc.url ? (
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg"
                            >
                              <ExternalLink size={12} />
                              <span>View File</span>
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-500 italic">No upload attached</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audit Checklist */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Compliance Audit Checklist (Click to verify)
                    </span>
                    <div className="space-y-2">
                      {[
                        { key: "completed_application_form", label: "Completed and signed official application form" },
                        { key: "passport_photograph", label: "Recent color passport photograph compliant with format" },
                        { key: "highest_qualification", label: "Verified evidence of highest educational qualification" },
                        { key: "professional_qualification", label: "Evidence of professional practice certification" },
                        { key: "employment_experience", label: "Evidence of verified professional field experience" },
                        { key: "valid_id_document", label: "Government-issued valid identification document" },
                        { key: "payment_proof", label: "Official bank / Treasury Single Account (TSA) payment proof" },
                      ].map((item) => {
                        const isChecked = activeApp.checklist?.[item.key] ?? false;
                        return (
                          <div
                            key={item.key}
                            onClick={() => handleToggleChecklist(item.key)}
                            className={`p-3 bg-slate-950 border rounded-2xl flex items-center justify-between cursor-pointer transition ${
                              isChecked ? "border-emerald-500/40 text-white" : "border-slate-800 text-slate-400"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {isChecked ? (
                                <CheckSquare size={16} className="text-emerald-400" />
                              ) : (
                                <Square size={16} className="text-slate-600" />
                              )}
                              <span className="text-xs font-medium">{item.label}</span>
                            </div>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                isChecked ? "bg-emerald-950 text-emerald-300" : "bg-slate-900 text-slate-500"
                              }`}
                            >
                              {isChecked ? "VERIFIED" : "PENDING"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-20 text-center text-slate-500 text-xs">No application selected.</div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: SECTION L — OFFICIAL USE APPROVAL & ROUTING DESK */}
        {activeTab === "official_use" && (
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                  SECTION L: STATUTORY DETERMINATION DESK
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  Official Decision & Authorization Protocol
                </h2>
                <p className="text-xs text-slate-400">
                  Target Candidate: <strong className="text-emerald-400">{activeApp.applicant_name} ({activeApp.id})</strong>
                </p>
              </div>

              {dbSaving && (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Syncing Decision to Database...</span>
                </div>
              )}
            </div>

            {/* Fellow Delegation Alert Banner */}
            {isFellowClass ? (
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                hasFellowDelegation ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200" : "bg-amber-950/40 border-amber-500/40 text-amber-200"
              }`}>
                <ShieldAlert size={20} className={hasFellowDelegation ? "text-emerald-400" : "text-amber-400"} />
                <div className="text-xs space-y-1">
                  <strong className="block font-bold">
                    {hasFellowDelegation ? "SUPER ADMIN DELEGATION ACTIVE" : "FELLOW CLASS ROUTING MANDATE"}
                  </strong>
                  <p className="text-slate-300">
                    {hasFellowDelegation
                      ? "The Super Admin has delegated executive authority to this Directorate Admin. You can approve this Fellow application directly without escalating."
                      : "Candidate applied for Fellow grade. Standard protocol requires Directorate verification followed by final sign-off by the Super Admin."}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Decision Workspace Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Verification Trail */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block border-b border-slate-800/80 pb-2">
                  Auditor Sign-off Trail
                </span>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Application Received By</label>
                  <input
                    type="text"
                    defaultValue={activeApp.received_by}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Documents Verified By</label>
                  <input
                    type="text"
                    defaultValue={fullName}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Authorized Officer Signature</label>
                  <input
                    type="text"
                    defaultValue={fullName}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400"
                  />
                </div>
              </div>

              {/* Right Column: Determination & Actions */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block border-b border-slate-800/80 pb-2">
                    Determination Actions
                  </span>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Approved Grade Class</label>
                    <select
                      defaultValue={activeApp.membership_grade_approved}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                    >
                      <option value="Fellow">Fellow Member (FNIRRMPT)</option>
                      <option value="Full Member">Full Member (MNIRRMPT)</option>
                      <option value="Associate">Associate Member (ANIRRMPT)</option>
                      <option value="Graduate">Graduate Member</option>
                      <option value="Student">Student Member</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Execute Decision:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleSaveOfficialDecision("Approved")}
                        className="py-2.5 bg-[#004d2c] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 size={14} />
                        <span>Approve Candidate</span>
                      </button>
                      <button
                        onClick={() => handleSaveOfficialDecision("Deferred")}
                        className="py-2.5 bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                      >
                        <Clock size={14} />
                        <span>Defer Application</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                  Current Status: <strong className="text-white">{activeApp.application_status}</strong>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: COMMAND OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            
            {/* Live Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl space-y-1 shadow">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Membership Dossiers</span>
                <p className="text-3xl font-black text-white">{applications.length}</p>
                <span className="text-xs text-emerald-400 font-semibold">Active Inbound Queue</span>
              </div>
              <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl space-y-1 shadow">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Permit Filings</span>
                <p className="text-3xl font-black text-amber-400">{permitsList.length}</p>
                <span className="text-xs text-amber-300 font-semibold">Statutory Environmental Permits</span>
              </div>
              <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl space-y-1 shadow">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">FOI Inquiries</span>
                <p className="text-3xl font-black text-cyan-400">{foiList.length}</p>
                <span className="text-xs text-cyan-300 font-semibold">Statutory 7-Day Window</span>
              </div>
              <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl space-y-1 shadow">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Training Cohorts</span>
                <p className="text-3xl font-black text-purple-400">{trainingCourses.length}</p>
                <span className="text-xs text-purple-300 font-semibold">Published Workshops</span>
              </div>
            </div>

            {/* Readiness Matrix */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400" />
                <span>Phase 1 & Phase 2 System Readiness Matrix</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Phase 1: Public Core & Research</span>
                    <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">100% LIVE</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    10 Navbar pages, candidate registrations, digital repositories, FOI persistence, and staff onboarding are live and database-persisted.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Phase 2: GIS Telemetry & Enterprise APIs</span>
                    <span className="text-amber-400 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">SUPER ADMIN CONTROLLED</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    GIS interactive maps, Permit compliance portals, and Inter-MDA REST gateways are integrated and gated under the Super Admin toggle engine.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: PERMITS & EIA VETTING DESK */}
        {activeTab === "permits_eia" && (
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Statutory Environmental Permits & EIA Vetting</h3>
                <p className="text-xs text-slate-400">Review extraction licenses, effluent discharge permits, and field inspection tasks.</p>
              </div>
            </div>

            <div className="space-y-3">
              {permitsList.map((item) => (
                <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                        {item.applicationNumber}
                      </span>
                      <span className="text-xs font-bold text-white">{item.companyName}</span>
                    </div>
                    <p className="text-xs text-slate-400">{item.permitType} · State: {item.state}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                      {item.status}
                    </span>
                    <button
                      onClick={() => showToast(`Permit dossier ${item.applicationNumber} approved for certification!`)}
                      className="px-3 py-1.5 bg-[#004d2c] hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                    >
                      Authorize Permit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TRAINING MANAGEMENT */}
        {activeTab === "training" && (
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">Directorate Capacity Building & Training Cohorts</h3>
                <p className="text-xs text-slate-400">Manage statutory workshops, syllabus delivery, and trainee capacity metrics.</p>
              </div>
              <button
                onClick={() => setShowAddTrainingModal(true)}
                className="px-4 py-2 bg-[#004d2c] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <Plus size={15} />
                <span>Schedule New Cohort</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainingCourses.map((c) => (
                <div key={c.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">{c.id}</span>
                    <span className="text-slate-400 font-medium">{c.type}</span>
                  </div>
                  <h4 className="font-bold text-white text-base">{c.title}</h4>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>Lead: <strong className="text-slate-300">{c.instructor}</strong></div>
                    <div>Schedule: {c.start_date} to {c.end_date}</div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex justify-between text-xs text-slate-500">
                    <span>Enrolled: <strong className="text-white">{c.enrolled}</strong> / {c.capacity}</span>
                    <span className="text-emerald-400 font-bold">STATUS: {c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: FOI STATUTORY DISCLOSURES */}
        {activeTab === "foi" && (
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Freedom of Information (FOI) Statutory Desk</h3>
                <p className="text-xs text-slate-400">Process citizen disclosures within the mandatory 7-day federal window.</p>
              </div>
            </div>

            <div className="space-y-3">
              {foiList.map((foi) => (
                <div key={foi.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
                      {foi.trackingCode}
                    </span>
                    <h4 className="text-sm font-bold text-white pt-1">{foi.subject}</h4>
                    <p className="text-xs text-slate-400">Applicant: {foi.fullName} ({foi.organization})</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded">
                      {foi.daysRemaining} Days Left
                    </span>
                    <button
                      onClick={() => showToast(`FOI Statutory Response transmitted for ${foi.trackingCode}`)}
                      className="px-3 py-1.5 bg-[#004d2c] hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                    >
                      Transmit Clearance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: STAFF ONBOARDING & ROLE ASSIGNMENT */}
        {activeTab === "staff_onboarding" && (
          <div className="space-y-6">
            <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 border-b border-slate-800 pb-3">
                <UserPlus size={20} />
                <h3 className="text-lg font-bold text-white">Onboard Staff Member & Assign Operational Role</h3>
              </div>

              <form onSubmit={handleOnboardStaffSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Full Name *</label>
                  <input
                    required
                    value={onboardForm.fullName}
                    onChange={(e) => setOnboardForm({ ...onboardForm, fullName: e.target.value })}
                    placeholder="Engr. David Okon"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Official Email *</label>
                  <input
                    required
                    type="email"
                    value={onboardForm.email}
                    onChange={(e) => setOnboardForm({ ...onboardForm, email: e.target.value })}
                    placeholder="d.okon@nirrmpt.org"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Temporary Password *</label>
                  <input
                    required
                    type="password"
                    value={onboardForm.password}
                    onChange={(e) => setOnboardForm({ ...onboardForm, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Department</label>
                  <input
                    value={onboardForm.department}
                    onChange={(e) => setOnboardForm({ ...onboardForm, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Assigned Role</label>
                  <select
                    value={onboardForm.role}
                    onChange={(e) => setOnboardForm({ ...onboardForm, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-semibold"
                  >
                    <option value="STAFF_ADMIN">STAFF_ADMIN (Field Operations)</option>
                    <option value="RESEARCHER">RESEARCHER (Scientific Fellow)</option>
                    <option value="CITIZEN">CITIZEN (Applicant Registry)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={onboardingSubmitting}
                    className="w-full py-2.5 bg-[#004d2c] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow"
                  >
                    {onboardingSubmitting ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                    <span>Onboard Officer</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Staff Roster */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
              <h4 className="text-sm font-bold text-white">Active Directorate Staff Roster ({staffList.length})</h4>
              <div className="space-y-2">
                {staffList.map((st) => (
                  <div key={st.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="font-bold text-xs text-white block">{st.fullName}</span>
                      <span className="text-[10px] text-slate-400">{st.email} · {st.department}</span>
                    </div>
                    <select
                      defaultValue={st.role}
                      onChange={(e) => handleReassignRole(st.id, e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-white px-2 py-1 font-semibold"
                    >
                      <option value="STAFF_ADMIN">STAFF_ADMIN</option>
                      <option value="RESEARCHER">RESEARCHER</option>
                      <option value="CITIZEN">CITIZEN</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: PHASE 2 GIS & RESOURCE TELEMETRY PREVIEW */}
        {activeTab === "gis_preview" && (
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                  PHASE 2 DEPLOYMENT PREVIEW
                </span>
                <h3 className="text-lg font-bold text-white mt-1">GIS Spatial Telemetry & Resource Oversight</h3>
              </div>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-950 border border-amber-500/30 px-2.5 py-1 rounded font-bold">
                SUPER ADMIN GATED
              </span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Compass size={16} />
                <span>Station Monitoring Coordinates (WGS84)</span>
              </div>
              <p className="text-slate-400">
                The Master Phase 2 Toggle is governed exclusively by the Lead Systems Architect (Super Admin).
                Admins have read-only inspection access to live IoT sensor probes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Sector 4 Coastal Mangrove", state: "Rivers State", lat: "4.7497° N", lng: "6.7583° E", moisture: "88%" },
                { name: "Sahelian Green Belt", state: "Kano State", lat: "12.4333° N", lng: "8.5167° E", moisture: "24%" },
                { name: "Benue Deep Aquifer", state: "Benue State", lat: "7.7333° N", lng: "8.5333° E", moisture: "95%" },
                { name: "Orumba Ravine Basin", state: "Anambra State", lat: "6.0333° N", lng: "7.1333° E", moisture: "62%" },
              ].map((loc, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400 block">{loc.state}</span>
                  <h4 className="font-bold text-xs text-white">{loc.name}</h4>
                  <div className="text-[10px] font-mono text-slate-400">Coords: {loc.lat}, {loc.lng}</div>
                  <div className="text-xs text-slate-300 font-semibold pt-1 border-t border-slate-800">
                    Moisture: <span className="text-emerald-400">{loc.moisture}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: PROFILE SETTINGS */}
        {activeTab === "profile" && (
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 max-w-xl mx-auto shadow-xl">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Directorate Officer Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Full Name</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Official Email</label>
                <input disabled value={userEmail} className="w-full bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-2 text-xs text-slate-500 font-mono" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Department Division</label>
                <input value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <button
                onClick={() => showToast("Profile settings saved successfully!")}
                className="w-full py-2.5 bg-[#004d2c] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow"
              >
                Save Profile
              </button>
            </div>
          </div>
        )}

        {/* Modal: Schedule Training Cohort */}
        {showAddTrainingModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0f172a] border border-slate-800 max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Publish New Capacity Cohort</h3>
                <button onClick={() => setShowAddTrainingModal(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>

              <form onSubmit={handleCreateTraining} className="space-y-3">
                <input required placeholder="Course Title" value={newTraining.title} onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white" />
                <input required placeholder="Lead Instructor" value={newTraining.instructor} onChange={(e) => setNewTraining({ ...newTraining, instructor: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" required value={newTraining.start_date} onChange={(e) => setNewTraining({ ...newTraining, start_date: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white" />
                  <input type="number" min="5" value={newTraining.capacity} onChange={(e) => setNewTraining({ ...newTraining, capacity: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white" />
                </div>
                <button type="submit" className="w-full py-2.5 bg-[#004d2c] text-white font-bold text-xs rounded-xl shadow mt-2">Publish Cohort to Portal</button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}