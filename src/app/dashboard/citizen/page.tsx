"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Building2,
  LogOut,
  User,
  Settings,
  Paperclip,
  Clock,
  CheckCircle,
  MessageSquare,
  Send,
  MapPin,
  X,
  Save,
  LayoutDashboard,
  Layers,
  UploadCloud,
  FileCheck2,
  Eye,
  Plus,
  Camera,
  Info,
  ShieldCheck,
  Building,
  UserCheck,
  Download,
  Calendar,
  Tag,
  RefreshCw
} from "lucide-react";

interface DocumentItem {
  id: string;
  name: string;
  url: string;
  uploadDate: string;
  size: string;
}

interface ApplicationRecord {
  id: string;
  trackingId: string;
  title: string;
  category: string;
  status: "Draft" | "Pending Review" | "In Field Inspection" | "Approved" | "Rejected";
  dateSubmitted: string;
  documents: DocumentItem[];
  comments: string;
  currentStep: number;
  assignedOfficer: string;
  assignedDepartment: string;
}

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  citizenRole: string;
  department: string;
  avatarUrl: string;
}

export default function CitizenDashboardPage() {
  const router = useRouter();

  // Navigation State
  const [activeTab, setActiveTab] = useState<"overview" | "workflows" | "gis">("overview");

  // Auth & Profile State
  const [userEmail, setUserEmail] = useState<string>("citizen@nirrmpt.org");
  const [loading, setLoading] = useState<boolean>(true);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState<boolean>(false);

  const [profile, setProfile] = useState<UserProfile>({
    fullName: "Public Partner Representative",
    email: "citizen@nirrmpt.org",
    phone: "+234 802 525 2362",
    organization: "Delta Eco Solutions Ltd",
    citizenRole: "Public Applicant",
    department: "Environmental Impact Assessment",
    avatarUrl: ""
  });

  // Modals & Action States
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [isNewAppOpen, setIsNewAppOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for New Application
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("EIA Permit Clearance");
  const [newFile, setNewFile] = useState<File | null>(null);

  // GIS Telemetry State
  const [activeGisLayer, setActiveGisLayer] = useState<"wetland" | "industrial" | "forest">("wetland");

  // Dynamic Applications & Realtime Store
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);

  // Support & Department Chat System
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState<"general" | "department" | "officer">("general");
  const [chatMessageInput, setChatMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  // -------------------------------------------------------------
  // DATABASE FETCHING ROUTINES
  // -------------------------------------------------------------

  const fetchApplications = useCallback(async (email: string) => {
    try {
      if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const { data, error } = await supabase
          .from("applications")
          .select("*, application_documents(*)")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const formatted: ApplicationRecord[] = data.map((item: any) => ({
            id: item.id,
            trackingId: item.tracking_id || `EIA-2026-${item.id.slice(0, 4)}`,
            title: item.title,
            category: item.category,
            status: item.status || "Pending Review",
            dateSubmitted: item.created_at ? item.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
            currentStep: item.current_step || 1,
            assignedOfficer: item.assigned_officer || "Awaiting Assignment",
            assignedDepartment: item.assigned_department || "Environmental Impact Assessment",
            comments: item.comments || "Application synchronized with NIRRMPT Core Database.",
            documents: item.application_documents
              ? item.application_documents.map((doc: any) => ({
                  id: doc.id,
                  name: doc.file_name,
                  url: doc.file_path,
                  uploadDate: doc.created_at ? doc.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                  size: doc.file_size || "1.5 MB"
                }))
              : []
          }));
          setApplications(formatted);
          return;
        }
      }
    } catch (err) {
      console.warn("Using fallback local records while syncing DB connection:", err);
    }

    // Fallback local records if DB is not populated or offline
    setApplications((prev) => (prev.length > 0 ? prev : [
      {
        id: "app-1",
        trackingId: "EIA-2026-8841",
        title: "Sector 4 Wetland Industrial Development Impact Assessment",
        category: "EIA Permit Clearance",
        status: "In Field Inspection",
        dateSubmitted: "2026-09-12",
        currentStep: 3,
        assignedOfficer: "Dr. A. Bello (Field Supervisor)",
        assignedDepartment: "Environmental Impact Assessment",
        documents: [
          { id: "d1", name: "Initial_Environmental_Audit.pdf", url: "#", uploadDate: "2026-09-12", size: "2.4 MB" },
          { id: "d2", name: "Site_Map_Coordinates.geojson", url: "#", uploadDate: "2026-09-14", size: "1.1 MB" }
        ],
        comments: "Field inspector assigned. Soil and hydrology probes scheduled for completion."
      },
      {
        id: "app-2",
        trackingId: "PER-2026-0032",
        title: "Coastal Mangrove Eco-Protection Certification",
        category: "Forestry & Biodiversity License",
        status: "Approved",
        dateSubmitted: "2026-08-15",
        currentStep: 4,
        assignedOfficer: "Engr. O. Kenneth (Directorate)",
        assignedDepartment: "Biodiversity & Ecosystems",
        documents: [
          { id: "d3", name: "Mangrove_Conservation_Plan.pdf", url: "#", uploadDate: "2026-08-15", size: "4.8 MB" },
          { id: "d4", name: "NIRRMPT_Clearance_Certificate.pdf", url: "#", uploadDate: "2026-08-28", size: "850 KB" }
        ],
        comments: "Approved by Directorate Operations. Certificate generated and active."
      }
    ]));
  }, []);

  const fetchChatMessages = useCallback(async () => {
    try {
      if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const { data } = await supabase
          .from("chat_messages")
          .select("*")
          .order("created_at", { ascending: true });

        if (data && data.length > 0) {
          setChatMessages(data);
          return;
        }
      }
    } catch {
      // Local fallback
    }

    setChatMessages((prev) => (prev.length > 0 ? prev : [
      {
        id: "1",
        target_channel: "general",
        sender_name: "NIRRMPT Support Desk",
        message: "Welcome to the Citizen & Partner Support Desk. Select a channel to speak with designated officers.",
        created_at: "09:00 AM"
      },
      {
        id: "2",
        target_channel: "department",
        sender_name: "EIA Department Admin",
        message: "Environmental Impact Assessment Desk online. Please reference your Application ID.",
        created_at: "09:15 AM"
      },
      {
        id: "3",
        target_channel: "officer",
        sender_name: "Dr. A. Bello (Assigned Staff)",
        message: "Hello! Your field probe report for EIA-2026-8841 is currently underway.",
        created_at: "10:30 AM"
      }
    ]));
  }, []);

  // -------------------------------------------------------------
  // INITIALIZATION AND REALTIME SUBSCRIPTIONS
  // -------------------------------------------------------------

  useEffect(() => {
    let appsChannel: any = null;
    let chatChannel: any = null;

    async function initSessionAndSubscriptions() {
      let activeEmail = "citizen@nirrmpt.org";
      try {
        if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
          const { data } = await supabase.auth.getUser();
          if (data?.user?.email) {
            activeEmail = data.user.email.replace(/@.*$/, "@nirrmpt.org");
          }
        }
      } catch {
        // Fallback email
      } finally {
        setUserEmail(activeEmail);
        setProfile((prev) => ({ ...prev, email: activeEmail }));

        // Initial Data Loads
        await fetchApplications(activeEmail);
        await fetchChatMessages();
        setLoading(false);

        // Realtime Subscriptions (attach `.on` before `.subscribe`)
        if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
          appsChannel = supabase
            .channel(`realtime-citizen-apps-${Date.now()}`)
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "applications" },
              () => {
                fetchApplications(activeEmail);
              }
            )
            .subscribe();

          chatChannel = supabase
            .channel(`realtime-chat-${Date.now()}`)
            .on(
              "postgres_changes",
              { event: "INSERT", schema: "public", table: "chat_messages" },
              (payload: any) => {
                if (payload?.new) {
                  setChatMessages((prev) => [...prev, payload.new]);
                } else {
                  fetchChatMessages();
                }
              }
            )
            .subscribe();
        }
      }
    }

    initSessionAndSubscriptions();

    // Clean Unsubscribe on Component Unmount / Re-render
    return () => {
      if (appsChannel) {
        appsChannel.unsubscribe();
        if (supabase) supabase.removeChannel(appsChannel);
      }
      if (chatChannel) {
        chatChannel.unsubscribe();
        if (supabase) supabase.removeChannel(chatChannel);
      }
    };
  }, [fetchApplications, fetchChatMessages]);

  // -------------------------------------------------------------
  // USER ACTIONS & HANDLERS
  // -------------------------------------------------------------

  const handleLogout = async () => {
    if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.auth.signOut();
    }
    if (typeof window !== "undefined") localStorage.removeItem("nirrmpt_user");
    router.push("/login");
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfile((prev) => ({ ...prev, avatarUrl: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaveSuccess(true);
    setTimeout(() => {
      setProfileSaveSuccess(false);
      setIsProfileOpen(false);
    }, 1000);
  };

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    const trackingId = `EIA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const { data, error } = await supabase
          .from("applications")
          .insert([
            {
              tracking_id: trackingId,
              title: newTitle,
              category: newCategory,
              status: "Pending Review",
              current_step: 1,
              applicant_email: profile.email,
              assigned_officer: "Awaiting Assignment",
              assigned_department: newCategory.includes("Forestry") ? "Biodiversity & Ecosystems" : "Environmental Impact Assessment",
              comments: "Application submitted successfully. Under desk review by NIRRMPT administrators."
            }
          ])
          .select();

        if (!error && data && data.length > 0) {
          const createdAppId = data[0].id;
          if (newFile) {
            await supabase.from("application_documents").insert([
              {
                application_id: createdAppId,
                file_name: newFile.name,
                file_path: "#",
                file_size: `${(newFile.size / (1024 * 1024)).toFixed(1)} MB`,
                uploaded_by: profile.email
              }
            ]);
          }
          await fetchApplications(profile.email);
        } else {
          throw new Error("Insert returned empty data");
        }
      } else {
        throw new Error("Supabase URL not configured");
      }
    } catch {
      const newEntry: ApplicationRecord = {
        id: `app-${Date.now()}`,
        trackingId: trackingId,
        title: newTitle,
        category: newCategory,
        status: "Pending Review",
        dateSubmitted: new Date().toISOString().split("T")[0],
        currentStep: 1,
        assignedOfficer: "Awaiting Assignment",
        assignedDepartment: newCategory.includes("Forestry") ? "Biodiversity & Ecosystems" : "Environmental Impact Assessment",
        documents: newFile
          ? [
              {
                id: `doc-${Date.now()}`,
                name: newFile.name,
                url: "#",
                uploadDate: new Date().toISOString().split("T")[0],
                size: `${(newFile.size / (1024 * 1024)).toFixed(1)} MB`
              }
            ]
          : [],
        comments: "Application submitted successfully. Under desk review by NIRRMPT administrators."
      };
      setApplications([newEntry, ...applications]);
    } finally {
      setIsSubmitting(false);
      setNewTitle("");
      setNewFile(null);
      setIsNewAppOpen(false);
    }
  };

  const handleFileUploadToApp = async (appId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const uploadedFile = event.target.files[0];

    try {
      if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        await supabase.from("application_documents").insert([
          {
            application_id: appId,
            file_name: uploadedFile.name,
            file_path: "#",
            file_size: `${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB`,
            uploaded_by: profile.email
          }
        ]);
      }
    } catch {
      // Local UI fallback
    }

    setApplications((prev) =>
      prev.map((item) => {
        if (item.id === appId) {
          const updatedDocs = [
            ...item.documents,
            {
              id: `doc-${Date.now()}`,
              name: uploadedFile.name,
              url: "#",
              uploadDate: new Date().toISOString().split("T")[0],
              size: `${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB`
            }
          ];
          const updatedApp = { ...item, documents: updatedDocs };
          if (selectedApp && selectedApp.id === appId) setSelectedApp(updatedApp);
          return updatedApp;
        }
        return item;
      })
    );
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageInput.trim()) return;

    const msgText = chatMessageInput;
    setChatMessageInput("");

    try {
      if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        await supabase.from("chat_messages").insert([
          {
            target_channel: chatTarget,
            sender_name: profile.fullName || userEmail,
            sender_email: profile.email,
            message: msgText
          }
        ]);
      }
    } catch {
      // Local state fallback
    }

    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        target_channel: chatTarget,
        sender_name: profile.fullName || userEmail,
        message: msgText,
        created_at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060a12] flex flex-col items-center justify-center gap-3 text-emerald-400 font-sans">
        <RefreshCw size={28} className="animate-spin text-emerald-400" />
        <span className="text-xs font-bold uppercase tracking-widest">Connecting Realtime NIRRMPT Database...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 font-sans flex flex-col">
      {/* Top Banner */}
      <div className="bg-[#04070d] border-b border-slate-800 px-4 py-1.5 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span className="font-semibold">Official Federal Portal – Republic of Nigeria</span>
        </div>
        <div className="flex items-center gap-6">
          <span>+2348025252362</span>
          <span>Port Harcourt, Rivers State</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-[#090e1a] border-b border-slate-800 px-4 lg:px-8 py-3.5 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-base font-black text-white tracking-tight leading-none">
              NIRRMPT Nigeria
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
              REGENERATIVE RESOURCE MANAGEMENT & PROTECTION
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#0d1627] hover:bg-[#121f38] border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2"
          >
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className="w-4 h-4 rounded-full object-cover" />
            ) : (
              <User size={14} />
            )}
            <span>Profile & Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 bg-[#080d18] border-b lg:border-b-0 lg:border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                ⌘
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider block">NIRRMPT PORTAL</span>
                <h2 className="text-xs font-black text-white">Public Hub Desk</h2>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase text-slate-500 px-3 block mb-2">PORTAL MODULES</span>
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                  activeTab === "overview"
                    ? "bg-slate-800/90 text-white border border-slate-700"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <LayoutDashboard size={15} className={activeTab === "overview" ? "text-emerald-400" : "text-slate-500"} />
                <span>Overview Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab("workflows")}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                  activeTab === "workflows"
                    ? "bg-slate-800/90 text-white border border-slate-700"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Layers size={15} className={activeTab === "workflows" ? "text-emerald-400" : "text-slate-500"} />
                <span>Operational Workflows</span>
              </button>

              <button
                onClick={() => setActiveTab("gis")}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                  activeTab === "gis"
                    ? "bg-slate-800/90 text-white border border-slate-700"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <MapPin size={15} className={activeTab === "gis" ? "text-emerald-400" : "text-slate-500"} />
                <span>GIS Resource Map</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 space-y-1">
            <span className="text-[9px] uppercase font-bold text-slate-500 block">AUTHENTICATED IDENTITY</span>
            <span className="text-xs font-bold text-slate-300 block truncate">{userEmail}</span>
            <span className="text-[10px] text-emerald-400/80 font-medium block">nirrmpt.org verified</span>
          </div>
        </aside>

        {/* Dynamic Main Section */}
        <main className="flex-1 p-4 lg:p-8 space-y-6 overflow-x-hidden">
          {/* Top Callout Card */}
          <div className="bg-[#0a101d] border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Building2 size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white tracking-tight">Citizen & Public Services Hub</h2>
                  <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    PUBLIC ACCESS
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Environmental Impact Assessment Registrations, Resource Tracking & Clearance Uploads
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsNewAppOpen(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shrink-0 shadow-lg transition-all"
            >
              <Plus size={16} />
              <span>Submit New Application</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
                  Application Metrics & Real-time Telemetry
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    onClick={() => setActiveTab("workflows")}
                    className="bg-[#0a101d] p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer shadow-lg group"
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <span>ACTIVE APPLICATIONS</span>
                      <FileCheck2 size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-3xl font-black text-white mt-2">
                      {applications.filter((a) => a.status !== "Approved").length}
                    </p>
                    <span className="text-xs text-emerald-400 font-semibold mt-1 block">In Inspection Phase →</span>
                  </div>

                  <div
                    onClick={() => setActiveTab("workflows")}
                    className="bg-[#0a101d] p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer shadow-lg group"
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <span>ISSUED CERTIFICATES</span>
                      <CheckCircle size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-3xl font-black text-white mt-2">
                      {applications.filter((a) => a.status === "Approved").length}
                    </p>
                    <span className="text-xs text-amber-400 font-semibold mt-1 block">Valid EIA Approvals →</span>
                  </div>

                  <div
                    onClick={() => setActiveTab("workflows")}
                    className="bg-[#0a101d] p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer shadow-lg group"
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <span>UPLOADED ASSETS</span>
                      <Paperclip size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-3xl font-black text-white mt-2">
                      {applications.reduce((acc, curr) => acc + (curr.documents ? curr.documents.length : 0), 0)}
                    </p>
                    <span className="text-xs text-blue-400 font-semibold mt-1 block">Indexed in NIRRMPT database →</span>
                  </div>
                </div>
              </div>

              {/* Submissions Data Table */}
              <div className="bg-[#0a101d] border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock size={16} className="text-emerald-400" />
                  <span>Recent Submissions & Stage Progress</span>
                </h3>

                <div className="divide-y divide-slate-800/60">
                  {applications.map((app) => (
                    <div key={app.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-400">{app.trackingId}</span>
                          <span className="text-xs font-semibold text-white">{app.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Category: {app.category} • Submitted: {app.dateSubmitted} • Officer: {app.assignedOfficer}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            app.status === "Approved"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          }`}
                        >
                          {app.status}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setActiveTab("workflows");
                          }}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1"
                        >
                          <Eye size={12} />
                          <span>Track</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WORKFLOWS */}
          {activeTab === "workflows" && (
            <div className="space-y-6">
              <div className="bg-[#0a101d] border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white">Application Tracker & Document Management</h3>
                  <p className="text-xs text-slate-400">
                    Upload supporting evidence, monitor inspection updates, and view audit records
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="bg-[#060a12] border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
                              {app.trackingId}
                            </span>
                            <h4 className="text-sm font-bold text-white leading-snug">{app.title}</h4>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                              app.status === "Approved"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>

                        {/* Stage Progress Bar */}
                        <div className="space-y-1.5 pt-2">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Stage {app.currentStep} of 4</span>
                            <span>{app.currentStep === 4 ? "Completed" : "In Progress"}</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full transition-all duration-500"
                              style={{ width: `${(app.currentStep / 4) * 100}%` }}
                            />
                          </div>
                          <div className="grid grid-cols-4 text-[9px] font-semibold text-slate-500 pt-1 text-center">
                            <span className={app.currentStep >= 1 ? "text-emerald-400" : ""}>Submitted</span>
                            <span className={app.currentStep >= 2 ? "text-emerald-400" : ""}>Desk Review</span>
                            <span className={app.currentStep >= 3 ? "text-emerald-400" : ""}>Field Audit</span>
                            <span className={app.currentStep >= 4 ? "text-emerald-400" : ""}>Approval</span>
                          </div>
                        </div>

                        {/* File Attachments */}
                        <div className="pt-3 border-t border-slate-800/80 space-y-2">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">
                            ATTACHED DOCUMENTS
                          </span>
                          <div className="space-y-1.5">
                            {app.documents &&
                              app.documents.map((doc) => (
                                <div
                                  key={doc.id}
                                  className="flex items-center justify-between bg-[#0a101d] px-3 py-1.5 rounded-lg border border-slate-800 text-xs"
                                >
                                  <div className="flex items-center gap-2 truncate max-w-[200px]">
                                    <Paperclip size={12} className="text-emerald-400 shrink-0" />
                                    <span className="text-slate-300 truncate">{doc.name}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-500">{doc.uploadDate}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                        <label className="cursor-pointer px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all">
                          <UploadCloud size={14} className="text-emerald-400" />
                          <span>Attach Document</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileUploadToApp(app.id, e)}
                          />
                        </label>

                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-lg transition-all"
                        >
                          Full Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GIS MAP */}
          {activeTab === "gis" && (
            <div className="bg-[#0a101d] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">GIS Public Resource Map & Telemetry</h3>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase rounded border border-emerald-500/30">
                      LIVE GIS FEED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Interactive spatial viewer for registered environmental sectors and permit zones
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#060a12] p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setActiveGisLayer("wetland")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      activeGisLayer === "wetland"
                        ? "bg-emerald-500 text-slate-950"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Wetland Zone
                  </button>
                  <button
                    onClick={() => setActiveGisLayer("industrial")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      activeGisLayer === "industrial"
                        ? "bg-amber-500 text-slate-950"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Industrial Grid
                  </button>
                  <button
                    onClick={() => setActiveGisLayer("forest")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      activeGisLayer === "forest"
                        ? "bg-blue-500 text-slate-950"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Forest Reserve
                  </button>
                </div>
              </div>

              <div className="bg-[#060a12] border border-slate-800 p-4 rounded-xl flex items-start gap-3">
                <Info size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-white block">How to use this interactive GIS Map:</span>
                  <p className="text-slate-400">
                    1. Use the layer buttons above to toggle between designated environmental sectors.
                    <br />
                    2. Coordinates and environmental impact indicators automatically sync with field inspection logs.
                  </p>
                </div>
              </div>

              <div className="w-full h-80 bg-[#04070d] border border-slate-800 rounded-xl relative overflow-hidden flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

                <MapPin
                  size={42}
                  className={`animate-bounce ${
                    activeGisLayer === "wetland"
                      ? "text-emerald-400"
                      : activeGisLayer === "industrial"
                      ? "text-amber-400"
                      : "text-blue-400"
                  }`}
                />

                <div className="relative z-10 space-y-1">
                  <h4 className="text-sm font-bold text-white">
                    {activeGisLayer === "wetland" && "Port Harcourt & Rivers State Sector 1 Wetland Conservation Zone"}
                    {activeGisLayer === "industrial" && "Sector 4 Regenerative Industrial & EIA Audit Grid"}
                    {activeGisLayer === "forest" && "Coastal Mangrove Eco-Protection Forestry Reserve"}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-lg">
                    Active Coordinates: 4°46'38"N, 7°00'48"E • Status: Baseline Telemetry Live & Verified
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: SUBMIT APPLICATION */}
      {isNewAppOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a101d] border border-slate-700 w-full max-w-lg rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Submit New Clearance Application</h3>
              <button onClick={() => setIsNewAppOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Project / Permit Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 3 Agriculture Boundary Inspection"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#060a12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#060a12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                >
                  <option value="EIA Permit Clearance">EIA Permit Clearance</option>
                  <option value="Forestry & Biodiversity License">Forestry & Biodiversity License</option>
                  <option value="Water Resources Audit">Water Resources Audit</option>
                  <option value="Soil Rehabilitation Verification">Soil Rehabilitation Verification</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Initial Document Attachment
                </label>
                <input
                  type="file"
                  onChange={(e) => setNewFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-800 file:text-emerald-400 file:font-bold hover:file:bg-slate-700 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewAppOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5"
                >
                  {isSubmitting && <RefreshCw size={12} className="animate-spin" />}
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: FULL DETAILS */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a101d] border border-slate-700 w-full max-w-2xl rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-start pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400">{selectedApp.trackingId}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedApp.status === "Approved"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {selectedApp.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{selectedApp.title}</h3>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#060a12] p-3 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                  <Tag size={12} /> Category
                </span>
                <p className="font-semibold text-slate-200">{selectedApp.category}</p>
              </div>

              <div className="bg-[#060a12] p-3 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                  <Calendar size={12} /> Submission Date
                </span>
                <p className="font-semibold text-slate-200">{selectedApp.dateSubmitted}</p>
              </div>

              <div className="bg-[#060a12] p-3 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                  <Building size={12} /> Department
                </span>
                <p className="font-semibold text-slate-200">{selectedApp.assignedDepartment}</p>
              </div>

              <div className="bg-[#060a12] p-3 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                  <UserCheck size={12} /> Assigned Staff / Inspector
                </span>
                <p className="font-semibold text-slate-200">{selectedApp.assignedOfficer}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Inspector Review Comments</span>
              <div className="bg-[#060a12] p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                {selectedApp.comments}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Uploaded Documents & Permits
              </span>
              <div className="space-y-2">
                {selectedApp.documents &&
                  selectedApp.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between bg-[#060a12] px-3.5 py-2 rounded-xl border border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Paperclip size={14} className="text-emerald-400" />
                        <div>
                          <span className="font-semibold text-slate-200 block">{doc.name}</span>
                          <span className="text-[10px] text-slate-500">
                            {doc.size} • Uploaded {doc.uploadDate}
                          </span>
                        </div>
                      </div>
                      <a
                        href={doc.url}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] font-bold rounded-lg flex items-center gap-1"
                      >
                        <Download size={12} />
                        <span>Download</span>
                      </a>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEPARTMENT & STAFF REALTIME CHAT */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-full flex items-center gap-2 shadow-2xl transition-all border border-amber-300/40"
          >
            <MessageSquare size={18} />
            <span>Staff & Department Live Chat</span>
          </button>
        ) : (
          <div className="w-80 md:w-96 h-[520px] bg-[#0a101d] border border-slate-700 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
            <div className="p-3 bg-[#060a12] border-b border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Citizen Communication Desk</span>
                </span>
                <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1 bg-[#0a101d] p-1 rounded-lg border border-slate-800 text-[10px] font-bold">
                <button
                  onClick={() => setChatTarget("general")}
                  className={`py-1 rounded ${chatTarget === "general" ? "bg-amber-500 text-slate-950" : "text-slate-400"}`}
                >
                  General Desk
                </button>
                <button
                  onClick={() => setChatTarget("department")}
                  className={`py-1 rounded ${chatTarget === "department" ? "bg-amber-500 text-slate-950" : "text-slate-400"}`}
                >
                  Department
                </button>
                <button
                  onClick={() => setChatTarget("officer")}
                  className={`py-1 rounded ${chatTarget === "officer" ? "bg-amber-500 text-slate-950" : "text-slate-400"}`}
                >
                  Assigned Staff
                </button>
              </div>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {chatMessages
                .filter((m) => (m.target_channel || m.target) === chatTarget)
                .map((msg, index) => (
                  <div key={msg.id || index} className="bg-slate-800/80 p-2.5 rounded-xl text-xs text-white space-y-1">
                    <div className="flex justify-between items-center text-[9px] text-slate-400">
                      <span className="font-bold text-emerald-400">{msg.sender_name || msg.sender}</span>
                      <span>
                        {msg.created_at
                          ? typeof msg.created_at === "string" && msg.created_at.includes("T")
                            ? msg.created_at.split("T")[1].slice(0, 5)
                            : msg.created_at
                          : "Just Now"}
                      </span>
                    </div>
                    <p className="text-slate-200">{msg.message || msg.text}</p>
                  </div>
                ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-2.5 bg-[#060a12] border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder={`Message ${
                  chatTarget === "general" ? "Support" : chatTarget === "department" ? "Department" : "Staff Officer"
                }...`}
                value={chatMessageInput}
                onChange={(e) => setChatMessageInput(e.target.value)}
                className="flex-1 bg-[#0a101d] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="p-2 bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 transition-all"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* MODAL 4: PROFILE & AVATAR SETTINGS */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a101d] border border-slate-700 w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Settings size={18} className="text-emerald-400" />
                <h3 className="text-base font-bold text-white">Profile & Account Settings</h3>
              </div>
              <button onClick={() => setIsProfileOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {profileSaveSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle size={16} />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center gap-4 bg-[#060a12] p-3 rounded-xl border border-slate-800">
                <div className="relative w-14 h-14 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} className="text-slate-500" />
                  )}
                </div>
                <div>
                  <label className="cursor-pointer px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1.5 border border-slate-700">
                    <Camera size={14} />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </label>
                  <span className="text-[10px] text-slate-500 block mt-1">PNG, JPG or WEBP (Max 2MB)</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full bg-[#060a12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Official Email Domain</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-[#060a12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Organization / Firm</label>
                <input
                  type="text"
                  value={profile.organization}
                  onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                  className="w-full bg-[#060a12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-xs font-bold text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-lg"
                >
                  <Save size={14} />
                  <span>Save Settings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}