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
} from "lucide-react";

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

const INITIAL_APPLICATIONS: MembershipApplication[] = [
  {
    id: "APP-2026-0891",
    applicant_name: "Dr. Emmanuel Etuk",
    email: "e.etuk@nirrmpt.org",
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
    },
    checklist: { completed_application_form: true, valid_id_document: true },
  },
];

interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
}

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

  // Added staff_onboarding to active tabs
  const [activeTab, setActiveTab] = useState<
    "verification" | "official_use" | "overview" | "chat" | "broadcast" | "training" | "staff_onboarding" | "profile"
  >("verification");

  const [fullName, setFullName] = useState<string>("Directorate Operations Lead");
  const [userEmail, setUserEmail] = useState<string>("directorate@nirrmpt.org");

  // Application Data
  const [applications, setApplications] = useState<MembershipApplication[]>(INITIAL_APPLICATIONS);
  const [selectedAppId, setSelectedAppId] = useState<string>("APP-2026-0891");
  const [searchQuery, setSearchQuery] = useState("");

  // Staff Onboarding State
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [onboardingSubmitting, setOnboardingSubmitting] = useState(false);
  const [onboardForm, setOnboardForm] = useState({
    fullName: "",
    email: "",
    password: "",
    department: "Environmental Protection & Monitoring",
    phoneNumber: "",
    role: "STAFF_ADMIN",
  });

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
    setTimeout(() => setLoading(false), 300);
  }, []);

  const activeApp = applications.find((a) => a.id === selectedAppId) || applications[0] || INITIAL_APPLICATIONS[0];

  // Handle Staff Onboarding Submission
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
      showToast(`Staff member ${onboardForm.fullName} onboarded successfully!`);
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
      showToast(res?.error || "Failed to onboard staff.");
    }
  };

  // Handle Admin Role Reassignment
  const handleReassignRole = async (userId: string, newRole: string) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === userId ? { ...s, role: newRole } : s))
    );
    await updateUserRoleAction(userId, newRole, userEmail);
    showToast(`Role updated to ${newRole}`);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#020617", color: "#94a3b8", gap: "12px" }}>
        <Loader2 size={28} color="#3b82f6" style={{ animation: "spin 1s linear infinite" }} />
        <span style={{ fontSize: "15px", fontWeight: 600 }}>Loading Directorate Admin Portal...</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#020617", color: "#f8fafc", fontFamily: "system-ui, -apple-system, sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Toast */}
        {toastMessage && (
          <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, backgroundColor: "#1e293b", border: "1px solid #3b82f6", color: "#ffffff", padding: "12px 20px", borderRadius: "10px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: 700 }}>
            <CheckCircle size={18} color="#34d399" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
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

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#ffffff" }}>{fullName}</div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>{userEmail}</div>
            </div>
            <button
              onClick={handleSignOut}
              style={{ padding: "8px 14px", backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", color: "#f87171", fontSize: "12px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div style={{ display: "flex", gap: "8px", backgroundColor: "#0f172a", border: "1px solid #1e293b", padding: "6px", borderRadius: "12px", overflowX: "auto" }}>
          {[
            { id: "verification", label: "Applicant Documents (Sec I)", icon: FileCheck2 },
            { id: "official_use", label: "Official Approval (Sec L)", icon: Award },
            { id: "staff_onboarding", label: "Staff Onboarding & Roles", icon: UserPlus },
            { id: "overview", label: "Command Overview", icon: Activity },
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

        {/* TAB: STAFF ONBOARDING & ROLE ASSIGNMENT DESK */}
        {activeTab === "staff_onboarding" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Onboard Form */}
            <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #1e293b", paddingBottom: "12px" }}>
                <UserPlus size={20} color="#3b82f6" />
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                    Onboard New Staff Officer & Assign Role
                  </h3>
                  <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
                    Directorate Admin authority to provision field staff, researchers, and desk officers.
                  </p>
                </div>
              </div>

              <form onSubmit={handleOnboardStaffSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Engr. David Okon"
                    value={onboardForm.fullName}
                    onChange={(e) => setOnboardForm({ ...onboardForm, fullName: e.target.value })}
                    style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="d.okon@nirrmpt.org"
                    value={onboardForm.email}
                    onChange={(e) => setOnboardForm({ ...onboardForm, email: e.target.value })}
                    style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>Temporary Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={onboardForm.password}
                    onChange={(e) => setOnboardForm({ ...onboardForm, password: e.target.value })}
                    style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>Department Division</label>
                  <select
                    value={onboardForm.department}
                    onChange={(e) => setOnboardForm({ ...onboardForm, department: e.target.value })}
                    style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                  >
                    <option value="Environmental Protection & Monitoring">Environmental Protection & Monitoring</option>
                    <option value="GIS & Remote Sensing Division">GIS & Remote Sensing Division</option>
                    <option value="Hydrological & Water Resources">Hydrological & Water Resources</option>
                    <option value="Regenerative Agriculture & Soil Conservation">Regenerative Agriculture & Soil</option>
                    <option value="Directorate Operations & Administration">Directorate Operations</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "4px" }}>Assigned Role Authority *</label>
                  <select
                    value={onboardForm.role}
                    onChange={(e) => setOnboardForm({ ...onboardForm, role: e.target.value })}
                    style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                  >
                    <option value="STAFF_ADMIN">STAFF_ADMIN (Field Operations & Surveys)</option>
                    <option value="RESEARCHER">RESEARCHER (Scientific Fellow)</option>
                    <option value="CITIZEN">CITIZEN (Applicant Registry)</option>
                  </select>
                </div>

                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    type="submit"
                    disabled={onboardingSubmitting}
                    style={{ width: "100%", padding: "10px", backgroundColor: "#10b981", color: "#020617", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    {onboardingSubmitting ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                    <span>{onboardingSubmitting ? "Onboarding..." : "Onboard Officer"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Manage Existing Staff & Reassign Roles */}
            <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "12px" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                    Active Staff Roster & Role Assignments
                  </h3>
                  <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
                    Reassign officer duties and authority levels.
                  </p>
                </div>
                <span style={{ fontSize: "11px", color: "#34d399", fontWeight: "bold" }}>
                  {staffList.length} Officers Active
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {staffList.map((staff) => (
                  <div
                    key={staff.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#020617",
                      border: "1px solid #1e293b",
                      borderRadius: "10px",
                      padding: "12px 16px",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#ffffff" }}>{staff.fullName}</div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>{staff.email} • {staff.department}</div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 800, backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", padding: "3px 8px", borderRadius: "4px" }}>
                        {staff.role}
                      </span>

                      <select
                        defaultValue={staff.role}
                        onChange={(e) => handleReassignRole(staff.id, e.target.value)}
                        style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#ffffff", fontSize: "11px", borderRadius: "6px", padding: "4px 8px", outline: "none" }}
                      >
                        <option value="STAFF_ADMIN">STAFF_ADMIN</option>
                        <option value="RESEARCHER">RESEARCHER</option>
                        <option value="CITIZEN">CITIZEN</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Existing Section I, L, Overview, Chat, Training tabs continue functioning normally */}
        {activeTab === "verification" && (
          <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff", marginBottom: "8px" }}>
              Applicant Document Inspection & Verification Checklist
            </h3>
            <p style={{ fontSize: "12px", color: "#94a3b8" }}>
              Selected: <strong>{activeApp.applicant_name} ({activeApp.id})</strong> • Applied Grade: {activeApp.applied_grade}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}