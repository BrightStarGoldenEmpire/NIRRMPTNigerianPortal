"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Building2,
  ShieldCheck,
  Search,
  LogOut,
  User,
  Settings,
  Paperclip,
  Clock,
  CheckCircle,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronUp,
  Users,
  UserCheck,
  FileText,
  MapPin,
  Award,
  BookOpen,
  GraduationCap,
  X,
  Save,
  Mail,
  Phone,
  LayoutDashboard,
  Layers,
  Globe,
  Plus,
  ArrowLeft,
  Image as ImageIcon,
  CheckCircle2
} from "lucide-react";

interface DetailRecord {
  id: string | number;
  ref_id?: string;
  title: string;
  subtitle?: string;
  status?: string;
  date?: string;
  category?: string;
  file_url?: string;
  full_content?: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  target: string;
  text: string;
  timestamp: string;
  targetType: "department" | "individual";
}

interface TrainingCourse {
  id: string;
  title: string;
  category: string;
  duration: string;
  lessons: number;
  progress: number;
  status: "Completed" | "In Progress" | "Not Started";
  description: string;
  certificateAvailable: boolean;
}

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  citizenRole: string;
  department: string;
  notificationPreferences: boolean;
  avatarUrl?: string;
}

const DEPARTMENTS = [
  "Environmental Protection & Monitoring",
  "GIS & Remote Sensing Division",
  "Hydrological & Water Resources",
  "Regenerative Agriculture & Soil Conservation",
  "Forestry & Biodiversity Reserves"
];

const DEPARTMENT_STAFF: Record<string, string[]> = {
  "Environmental Protection & Monitoring": [
    "Dr. O. Adeleke (Chief EIA Inspector)",
    "Engr. Musa Sani (Pollution Analyst)"
  ],
  "GIS & Remote Sensing Division": [
    "K. Ibrahim (Senior GIS Analyst)",
    "Chidi Nnamdi (Drone Telemetry Specialist)"
  ],
  "Hydrological & Water Resources": [
    "Dr. A. Bello (Chief Hydrologist)",
    "Fatima Usman (Water Quality Tech)"
  ],
  "Regenerative Agriculture & Soil Conservation": [
    "Prof. E. Okafor (Soil Regeneration Lead)",
    "Yusuf Danjuma (Field Officer)"
  ],
  "Forestry & Biodiversity Reserves": [
    "Amina Tarfa (Biodiversity Specialist)",
    "John Audu (Forestry Warden)"
  ]
};

export default function DashboardPage() {
  const router = useRouter();

  // Navigation Sub-tab State
  const [activeTab, setActiveTab] = useState<"overview" | "workflows" | "gis">("overview");

  // User & Profile State
  const [userEmail, setUserEmail] = useState<string>("hello@yopmail.com");
  const [loading, setLoading] = useState<boolean>(true);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState<boolean>(false);

  const [profile, setProfile] = useState<UserProfile>({
    fullName: "Field Officer Inspector",
    email: "hello@yopmail.com",
    phone: "+234 802 525 2362",
    organization: "NIRRMPT Field Operations Directorate",
    citizenRole: "Field Officer",
    department: "Environmental Protection & Monitoring",
    notificationPreferences: true
  });

  // Dynamic Card Detail Drawer/Modal State
  const [selectedCard, setSelectedCard] = useState<
    "submissions" | "surveys" | "assets" | "applications" | "certificates" | "zones" | null
  >(null);
  const [expandedRecordId, setExpandedRecordId] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Operational Submissions Data Store
  const [isCreateEntryOpen, setIsCreateEntryOpen] = useState(false);
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [newEntryCategory, setNewEntryCategory] = useState("Soil & Water");

  const [submissionsList, setSubmissionsList] = useState<DetailRecord[]>([
    {
      id: "sub-1",
      ref_id: "#SUB-2026-091",
      title: "Sector 2 Runoff Field Survey Report",
      subtitle: "Published • Environmental Protection & Monitoring",
      status: "Published",
      date: "Sept 24, 2026",
      category: "Environmental Inspection",
      full_content: "Comprehensive soil chemistry and topsoil salinity measurement audit for Sector 2 agricultural boundary."
    },
    {
      id: "sub-2",
      ref_id: "#SUB-2026-084",
      title: "Rivers State Coastal Biodiversity Assessment",
      subtitle: "Pending Approval • Forestry Division",
      status: "Pending Approval",
      date: "Sept 21, 2026",
      category: "Forestry & Biodiversity",
      full_content: "Drone telemetry observation log covering mangrove reforestation progress along Port Harcourt coastal fringe."
    }
  ]);

  const [surveysList] = useState<DetailRecord[]>([
    {
      id: "srv-101",
      ref_id: "#SRV-882",
      title: "Sector 2 Soil Salinity Telemetry Inspection",
      subtitle: "Status: Active • Target Due: Sept 28, 2026",
      status: "Active",
      date: "2026-09-28",
      full_content: "Mandatory on-site probe sampling following high seasonal precipitation along Sector 2 watershed."
    }
  ]);

  const [assetsList] = useState<DetailRecord[]>([
    {
      id: "ast-201",
      title: "High-Resolution Sector 2 Multispectral Orthomosaic Map",
      subtitle: "Indexed in public gallery • File: GIS_SEC2_2026_ORTHO.TIFF",
      status: "Indexed",
      date: "2026-09-22",
      file_url: "GIS_SEC2_2026_ORTHO.TIFF",
      full_content: "High resolution aerial map indexed and assigned to the public spatial clearinghouse."
    }
  ]);

  const [applicationsList] = useState<DetailRecord[]>([
    {
      id: "app-101",
      title: "EIA Permit Registration - Sector 4 Wetland",
      subtitle: "Tracking ID: #EIA-2026-884 • Submitted: Sep 12, 2026",
      status: "In Inspection Phase",
      date: "2026-09-12",
      full_content: "Application for commercial ecosystem interaction within Sector 4."
    }
  ]);

  const [certificatesList] = useState<DetailRecord[]>([
    {
      id: "cert-991",
      title: "Official EIA Clearance Approval Certificate",
      subtitle: "Cert ID: NIRRMPT-EIA-2026-0041 • Valid until Sep 2028",
      status: "Valid EIA Approval",
      date: "2026-08-15",
      file_url: "NIRRMPT_EIA_Official_Certificate.pdf",
      full_content: "Official clearance granted for eco-friendly agricultural development in Sector 2."
    }
  ]);

  const [zonesList] = useState<DetailRecord[]>([
    { id: "z-1", title: "Sector 1: Coastal Wetland Conservation Reserve", subtitle: "Public Access Sector", status: "Active" },
    { id: "z-2", title: "Sector 2: Regenerative Agriculture Pilot Area", subtitle: "Public Access Sector", status: "Active" }
  ]);

  // Training Module Store
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);
  const [courses] = useState<TrainingCourse[]>([
    {
      id: "c1",
      title: "Environmental Impact Assessment (EIA) Standard",
      category: "Regulatory",
      duration: "2h 30m",
      lessons: 6,
      progress: 100,
      status: "Completed",
      description: "Comprehensive guidance on NIRRMPT regulatory compliance, field inspection protocols, and submission guidelines.",
      certificateAvailable: true
    }
  ]);

  // Chat System State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatTargetType, setChatTargetType] = useState<"department" | "individual">("department");
  const [selectedDept, setSelectedDept] = useState<string>(DEPARTMENTS[0]);
  const [selectedStaff, setSelectedStaff] = useState<string>(DEPARTMENT_STAFF[DEPARTMENTS[0]][0]);
  const [chatMessageInput, setChatMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "System Automated Desk",
      target: "Environmental Protection & Monitoring",
      text: "Welcome to NIRRMPT Field Live Chat Desk. Connected with regional headquarters.",
      timestamp: "08:30 AM",
      targetType: "department"
    }
  ]);

  const loadUserData = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        setUserEmail(data.user.email);
        setProfile(prev => ({ ...prev, email: data.user.email }));
      }
    } catch {
      console.log("Session verified locally.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (typeof window !== "undefined") localStorage.removeItem("nirrmpt_user");
    router.push("/login");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaveSuccess(true);
    setTimeout(() => {
      setProfileSaveSuccess(false);
      setIsProfileOpen(false);
    }, 1200);
  };

  const handleCreateSubmissionEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntryTitle.trim()) return;

    const newEntry: DetailRecord = {
      id: `sub-${Date.now()}`,
      ref_id: `#SUB-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: newEntryTitle,
      subtitle: `Pending Approval • ${profile.department}`,
      category: newEntryCategory,
      status: "Pending Approval",
      date: "Sept 25, 2026",
      full_content: "New field observation entry logged and pending supervisor review."
    };

    setSubmissionsList([newEntry, ...submissionsList]);
    setNewEntryTitle("");
    setIsCreateEntryOpen(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageInput.trim()) return;

    const currentTarget = chatTargetType === "department" ? selectedDept : selectedStaff;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: userEmail,
      target: currentTarget,
      text: chatMessageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      targetType: chatTargetType
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatMessageInput("");
  };

  const getActiveList = () => {
    let list: DetailRecord[] = [];
    if (selectedCard === "submissions") list = submissionsList;
    if (selectedCard === "surveys") list = surveysList;
    if (selectedCard === "assets") list = assetsList;
    if (selectedCard === "applications") list = applicationsList;
    if (selectedCard === "certificates") list = certificatesList;
    if (selectedCard === "zones") list = zonesList;

    if (!searchQuery.trim()) return list;
    return list.filter(
      item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const currentChatTarget = chatTargetType === "department" ? selectedDept : selectedStaff;
  const filteredMessages = chatMessages.filter(
    msg => msg.target === currentChatTarget || msg.sender === currentChatTarget
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060a12] flex flex-col items-center justify-center gap-3 text-emerald-400 font-sans">
        <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 font-sans flex flex-col">
      
      {/* Official Government Top Bar */}
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

      {/* Main Navigation Header */}
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

        <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <span className="hover:text-emerald-400 cursor-pointer">Home</span>
          <span className="hover:text-emerald-400 cursor-pointer">About Us</span>
          <span className="hover:text-emerald-400 cursor-pointer">Leadership & Board</span>
          <span className="hover:text-emerald-400 cursor-pointer">Departments</span>
          <span className="hover:text-emerald-400 cursor-pointer">News</span>
          <span className="hover:text-emerald-400 cursor-pointer">Events</span>
          <span className="hover:text-emerald-400 cursor-pointer">Gallery</span>
          <span className="hover:text-emerald-400 cursor-pointer">Contact</span>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#0d1627] hover:bg-[#121f38] border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2"
          >
            <User size={14} />
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

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-[#080d18] border-b lg:border-b-0 lg:border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                ⌘
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider block">NIRRMPT PORTAL</span>
                <h2 className="text-xs font-black text-white">Command Desk</h2>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase text-slate-500 px-3 block mb-2">QUICK MODULES</span>
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${activeTab === "overview" ? "bg-slate-800/90 text-white border border-slate-700" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"}`}
              >
                <LayoutDashboard size={15} className={activeTab === "overview" ? "text-emerald-400" : "text-slate-500"} />
                <span>Overview Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab("workflows")}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${activeTab === "workflows" ? "bg-slate-800/90 text-white border border-slate-700" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"}`}
              >
                <Layers size={15} className={activeTab === "workflows" ? "text-emerald-400" : "text-slate-500"} />
                <span>Operational Workflows</span>
              </button>

              <button
                onClick={() => setActiveTab("gis")}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${activeTab === "gis" ? "bg-slate-800/90 text-white border border-slate-700" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"}`}
              >
                <MapPin size={15} className={activeTab === "gis" ? "text-emerald-400" : "text-slate-500"} />
                <span>GIS Resource Map</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 space-y-2">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block">ACTIVE SESSION</span>
              <span className="text-xs font-bold text-slate-300 block truncate">{userEmail}</span>
            </div>
          </div>
        </aside>

        {/* Dashboard Workspace */}
        <main className="flex-1 p-4 lg:p-8 space-y-6 overflow-x-hidden">
          
          <div className="bg-[#0a101d] border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Building2 size={26} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white tracking-tight">NIRRMPT PORTAL</h2>
                    <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      SYSTEM ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Nigerian Institute of Regenerative Resource Management & Protection Technologies
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="px-4 py-2 bg-[#0e172a] hover:bg-[#14223d] border border-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-2"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Metric Cards */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Field Metrics & Resource Assets</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div
                    onClick={() => { setSelectedCard("submissions"); setSearchQuery(""); setExpandedRecordId(null); }}
                    className="bg-[#0a101d] p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer shadow-lg group"
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <span>MY SUBMISSIONS</span>
                      <FileText size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-3xl font-black text-white mt-2">{submissionsList.length} Items</p>
                    <span className="text-xs text-amber-400 font-semibold mt-1 block">Click to view details →</span>
                  </div>

                  <div
                    onClick={() => { setSelectedCard("surveys"); setSearchQuery(""); setExpandedRecordId(null); }}
                    className="bg-[#0a101d] p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer shadow-lg group"
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <span>ASSIGNED FIELD SURVEYS</span>
                      <MapPin size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-3xl font-black text-white mt-2">{surveysList.length} Active</p>
                    <span className="text-xs text-emerald-400 font-semibold mt-1 block">Resource monitoring active →</span>
                  </div>

                  <div
                    onClick={() => { setSelectedCard("assets"); setSearchQuery(""); setExpandedRecordId(null); }}
                    className="bg-[#0a101d] p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer shadow-lg group"
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <span>MEDIA UPLOADS</span>
                      <ImageIcon size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-3xl font-black text-white mt-2">{assetsList.length} Assets</p>
                    <span className="text-xs text-blue-400 font-semibold mt-1 block">Indexed in public gallery →</span>
                  </div>

                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a101d] border border-slate-700 w-full max-w-lg rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Settings size={18} className="text-emerald-400" />
                <h3 className="text-lg font-bold text-white">User Profile & Settings</h3>
              </div>
              <button onClick={() => setIsProfileOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {profileSaveSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Profile settings saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full bg-[#060a12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsProfileOpen(false)} className="px-4 py-2 bg-slate-800 text-xs font-bold text-slate-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5">
                  <Save size={14} />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Drawer Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a101d] border border-slate-700 w-full max-w-2xl max-h-[85vh] rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white capitalize">{selectedCard} Details</h3>
              <button onClick={() => setSelectedCard(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3">
              {getActiveList().map(item => (
                <div key={item.id} className="p-4 bg-[#060a12] border border-slate-800 rounded-xl space-y-1">
                  <span className="font-bold text-sm text-white block">{item.title}</span>
                  <p className="text-xs text-slate-400">{item.subtitle}</p>
                  <p className="text-xs text-slate-300 pt-2">{item.full_content}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button onClick={() => setSelectedCard(null)} className="px-4 py-2 bg-slate-800 text-xs font-bold text-slate-200 rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Live Chat Drawer */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-full flex items-center gap-2 shadow-2xl transition-all border border-amber-300/40"
          >
            <MessageSquare size={18} />
            <span>Staff Live Chat</span>
          </button>
        ) : (
          <div className="w-80 md:w-96 h-[520px] bg-[#0a101d] border border-slate-700 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
            <div className="p-3 bg-[#060a12] border-b border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold text-white">NIRRMPT Field Live Chat</span>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {chatMessages.map(msg => (
                <div key={msg.id} className="bg-slate-800 p-2.5 rounded-xl text-xs text-white space-y-1">
                  <span className="text-[9px] text-slate-400 block">{msg.sender}</span>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-2.5 bg-[#060a12] border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={chatMessageInput}
                onChange={e => setChatMessageInput(e.target.value)}
                className="flex-1 bg-[#0a101d] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
              />
              <button type="submit" className="p-2 bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400">
                <Send size={14} />
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}