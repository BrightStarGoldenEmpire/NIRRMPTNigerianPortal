"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { logoutAction } from "@/app/actions/auth";
import {
  FileText,
  MapPin,
  Image as ImageIcon,
  Bell,
  Upload,
  PenTool,
  RefreshCw,
  CheckCircle2,
  X,
  MessageSquare,
  Send,
  Building2,
  Circle,
  Briefcase,
  Layers,
  Map,
  Award,
  Calendar,
  User,
  LogOut,
  UploadCloud,
  Eye,
  Camera,
} from "lucide-react";

interface StaffProfile {
  id?: string;
  email: string;
  role: string;
  department?: string;
  avatar_url?: string;
}

interface DetailRecord {
  id: string | number;
  title: string;
  subtitle: string;
  status?: string;
  date?: string;
  category?: string;
  file_url?: string;
  approval_status?: "pending_approval" | "approved" | "rejected";
  full_content?: string;
}

interface TrainingProgram {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  seatsLeft: number;
  description: string;
  flyerUrl: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  target: string;
  text: string;
  timestamp: string;
  chatType: "private" | "group";
}

const DEPARTMENTS = [
  "Environmental Protection & Monitoring",
  "GIS & Remote Sensing Division",
  "Hydrological & Water Resources",
  "Regenerative Agriculture & Soil Conservation",
  "Forestry & Biodiversity Reserves",
  "Directorate Operations & Administration",
  "Research & Technology Integration",
];

const PRIVATE_CONTACTS = [
  "Admin Portal",
  "Field Team Lead",
  "GIS Operations Lead",
  "Senior Hydrologist",
];

const GROUP_CHANNELS = [
  "General Staff Forum",
  "GIS Emergency Channel",
  "Field Ops Directive Group",
];

export default function StaffDashboard() {
  const router = useRouter();

  // Navigation State
  const [activeSubModule, setActiveSubModule] = useState<"overview" | "workflows" | "gis" | "training">("overview");
  const [activeTab, setActiveTab] = useState<"dashboard" | "profile">("dashboard");

  // Profile State
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [profileName, setProfileName] = useState("Staff Officer");
  const [selectedDepartment, setSelectedDepartment] = useState(DEPARTMENTS[0]);
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);

  // Training Module States
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccessId, setRegistrationSuccessId] = useState<string | null>(null);
  const [trainingFormData, setTrainingFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    designation: "",
    experienceLevel: "Mid-Level",
  });

  const trainingPrograms: TrainingProgram[] = [
    {
      id: "TR-2026-01",
      title: "Environmental Impact Assessment (EIA) Certification 2026",
      category: "Regulatory Compliance",
      date: "November 12 - 15, 2026",
      location: "Port Harcourt / Hybrid Stream",
      seatsLeft: 14,
      description: "Comprehensive statutory certification covering EIA auditing frameworks under federal guidelines and NDPR principles.",
      flyerUrl: "/assets/images/training-eia-2026.png",
    },
    {
      id: "TR-2026-02",
      title: "GIS Mapping & Resource Management Workshop",
      category: "Spatial Analytics",
      date: "December 03 - 05, 2026",
      location: "Abuja Directorate Center & Virtual",
      seatsLeft: 8,
      description: "Hands-on geospatial mapping workflows, satellite terrain monitoring, and automated database resource tracking.",
      flyerUrl: "/assets/images/training-gis-2026.png",
    },
    {
      id: "TR-2026-03",
      title: "Regenerative Soil & Ecosystem Protection Masterclass",
      category: "Field Operations",
      date: "January 20 - 22, 2027",
      location: "Field Desk Operations Base, Rivers State",
      seatsLeft: 22,
      description: "Advanced methodologies for soil remediation, natural asset protection, and field data telemetry reporting.",
      flyerUrl: "/assets/images/training-soil-2027.png",
    },
  ];

  // Data Stores
  const [submissionsList, setSubmissionsList] = useState<DetailRecord[]>([]);
  const [surveysList, setSurveysList] = useState<DetailRecord[]>([]);
  const [mediaList, setMediaList] = useState<DetailRecord[]>([]);
  const [bulletinsList, setBulletinsList] = useState<DetailRecord[]>([]);

  // Modals
  const [selectedCard, setSelectedCard] = useState<"submissions" | "surveys" | "media" | "bulletins" | null>(null);
  const [expandedRecordId, setExpandedRecordId] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState<"news" | "gallery" | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Live Chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState<"private" | "group">("private");
  const [activeTarget, setActiveTarget] = useState<string>(PRIVATE_CONTACTS[0]);
  const [chatMessageInput, setChatMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "Admin Portal",
      target: "Admin Portal",
      text: "Welcome to NIRRMPT Operational Desk. Submit direct staff queries here.",
      timestamp: "09:00 AM",
      chatType: "private",
    },
    {
      id: "2",
      sender: "GIS Operations Lead",
      target: "General Staff Forum",
      text: "All field officers: Sector 4 GIS satellite sync completed.",
      timestamp: "10:15 AM",
      chatType: "group",
    },
  ]);

  // Form Field Inputs
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsFile, setNewsFile] = useState<File | null>(null);
  const [mediaCaption, setMediaCaption] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  // Data Fetching
  const loadWorkspaceData = useCallback(async () => {
    try {
      let currentUserEmail = "field.staff@nirrmpt.org";
      let currentUserId = "";

      if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          currentUserId = session.user.id;
          currentUserEmail = session.user.email || "field.staff@nirrmpt.org";
        }
      }

      setProfile({
        id: currentUserId,
        email: currentUserEmail,
        role: "staff",
        department: selectedDepartment,
      });

      const [newsRes, surveysRes, mediaRes, bulletinsRes] = await Promise.allSettled([
        supabase ? supabase.from("news_submissions").select("*").order("created_at", { ascending: false }) : Promise.reject(),
        supabase ? supabase.from("field_surveys").select("*").order("created_at", { ascending: false }) : Promise.reject(),
        supabase ? supabase.from("gallery_assets").select("*").order("created_at", { ascending: false }) : Promise.reject(),
        supabase ? supabase.from("internal_bulletins").select("*").order("created_at", { ascending: false }) : Promise.reject(),
      ]);

      if (newsRes.status === "fulfilled" && newsRes.value.data && newsRes.value.data.length > 0) {
        setSubmissionsList(
          newsRes.value.data.map((item: any) => ({
            id: item.id,
            title: item.title || "Untitled Field Report",
            subtitle: item.content?.substring(0, 90) + "..." || "Pending operational report summary",
            full_content: item.content || "No detailed content provided.",
            status: item.status || "pending",
            approval_status: item.approval_status || "pending_approval",
            date: new Date(item.created_at || Date.now()).toLocaleDateString(),
          }))
        );
      } else {
        setSubmissionsList([
          {
            id: "1",
            title: "Q3 Coastal Soil Degradation Assessment",
            subtitle: "Detailed analysis of coastal erosion in Sector 4",
            full_content: "High concentration of salinity detected in surface soil samples. Recommended emergency barrier deployment and mangrove re-vegetation.",
            status: "published",
            approval_status: "approved",
            date: "2026-09-15",
          },
          {
            id: "2",
            title: "Hydrological Field Survey Draft",
            subtitle: "River Basin water quality measurements",
            full_content: "Water pH levels recorded at 6.4 with trace mineral sedimentation.",
            status: "pending",
            approval_status: "pending_approval",
            date: "2026-09-17",
          },
        ]);
      }

      if (surveysRes.status === "fulfilled" && surveysRes.value.data && surveysRes.value.data.length > 0) {
        setSurveysList(
          surveysRes.value.data.map((item: any) => ({
            id: item.id,
            title: item.title || "Assigned Field Survey",
            subtitle: item.location || "Active Inspection Zone",
            full_content: `Location coordinates verified. Task scope: ${item.location || "Sector Inspection"}`,
            status: item.status || "Active",
            date: new Date(item.created_at || Date.now()).toLocaleDateString(),
          }))
        );
      } else {
        setSurveysList([
          {
            id: "s1",
            title: "Niger Delta Mangrove Restoration Monitor",
            subtitle: "Zone Delta-4 Field Sector",
            full_content: "Active field survey tracking root survival rate in restored coastal zone.",
            status: "Active",
            date: "2026-09-18",
          },
          {
            id: "s2",
            title: "Soil Contamination GIS Sampling",
            subtitle: "Zone North-2 Industrial Perimeter",
            full_content: "Heavy metal heavy-ion analysis scheduled across 12 grid blocks.",
            status: "Active",
            date: "2026-09-17",
          },
        ]);
      }

      if (mediaRes.status === "fulfilled" && mediaRes.value.data && mediaRes.value.data.length > 0) {
        setMediaList(
          mediaRes.value.data.map((item: any) => ({
            id: item.id,
            title: item.caption || "Field Photograph Asset",
            subtitle: item.url || "Stored in cloud repository",
            full_content: `Media Asset Metadata: Author: ${item.author_email || "Staff"}`,
            category: item.category || "Field Captures",
            approval_status: item.approval_status || "pending_approval",
            date: new Date(item.created_at || Date.now()).toLocaleDateString(),
          }))
        );
      } else {
        setMediaList([
          {
            id: "m1",
            title: "Sector 4 High-Res Wetland Drone Shot",
            subtitle: "RAW High-Resolution Capture • 14.2 MB",
            full_content: "Aerial multispectral imagery covering 45 hectares of degraded wetland.",
            category: "Aerial",
            approval_status: "approved",
            date: "2026-09-17",
          },
        ]);
      }

      if (bulletinsRes.status === "fulfilled" && bulletinsRes.value.data && bulletinsRes.value.data.length > 0) {
        setBulletinsList(
          bulletinsRes.value.data.map((item: any) => ({
            id: item.id,
            title: item.subject || "Directorate Bulletin",
            subtitle: item.body || "Directive from central command",
            full_content: item.body || "Directive details issued by NIRRMPT Directorate.",
            status: item.unread ? "Unread" : "Read",
            date: new Date(item.created_at || Date.now()).toLocaleDateString(),
          }))
        );
      } else {
        setBulletinsList([
          {
            id: "b1",
            title: "Revised Field Protocol Directive (NIRRMPT-2026)",
            subtitle: "Mandatory updated safety procedure guidelines",
            full_content: "All staff deployed in high-salinity field sectors must log real-time telemetry every 4 hours.",
            status: "Unread",
            date: "2026-09-18",
          },
        ]);
      }
    } catch (err: any) {
      console.warn("Workspace sync warning:", err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    loadWorkspaceData();
  }, [loadWorkspaceData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadWorkspaceData();
  };

  const handleSignOut = async () => {
    if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.auth.signOut();
    }
    await logoutAction();
    window.location.href = "/portal/login";
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageInput.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: profileName || profile?.email || "Staff Officer",
      target: activeTarget,
      text: chatMessageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      chatType: chatMode,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatMessageInput("");
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) return;

    setSubmitting(true);
    const newRecord: DetailRecord = {
      id: Date.now().toString(),
      title: newsTitle,
      subtitle: newsContent.length > 90 ? newsContent.substring(0, 90) + "..." : newsContent,
      full_content: newsContent,
      status: "Pending Review",
      approval_status: "pending_approval",
      file_url: newsFile ? newsFile.name : undefined,
      date: new Date().toISOString().split("T")[0],
    };

    setSubmissionsList((prev) => [newRecord, ...prev]);
    setActionSuccess("News draft submitted to Directorate for approval before publishing.");
    setNewsTitle("");
    setNewsContent("");
    setNewsFile(null);
    setActiveModal(null);
    setSubmitting(false);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaCaption.trim()) return;

    setSubmitting(true);
    const newRecord: DetailRecord = {
      id: Date.now().toString(),
      title: mediaCaption,
      subtitle: mediaFile ? `Attached: ${mediaFile.name}` : "Staged Asset",
      full_content: `Uploaded file asset: ${mediaFile ? mediaFile.name : "Staged Asset"}. Pending Directorate clearance.`,
      category: "Field Upload",
      approval_status: "pending_approval",
      date: new Date().toISOString().split("T")[0],
    };

    setMediaList((prev) => [newRecord, ...prev]);
    setActionSuccess("Media asset uploaded and queued for Directorate clearance.");
    setMediaCaption("");
    setMediaFile(null);
    setActiveModal(null);
    setSubmitting(false);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  const handleTrainingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTrainingFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTrainingRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setRegistrationSuccessId(null);

    setTimeout(() => {
      const trackingCode = `CERT-REG-${Math.floor(100000 + Math.random() * 900000)}`;
      setIsRegistering(false);
      setRegistrationSuccessId(trackingCode);
    }, 1000);
  };

  const handleProfileAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setProfileAvatar(imageUrl);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-3 text-amber-400 font-sans">
        <RefreshCw size={28} className="animate-spin text-amber-400" />
        <span className="text-xs font-bold uppercase tracking-widest">Loading Operational Workspace...</span>
      </div>
    );
  }

  const totalSubmissions = submissionsList.length;
  const publishedSubmissions = submissionsList.filter((i) => i.approval_status === "approved" || i.status === "published").length;
  const pendingSubmissions = submissionsList.filter((i) => i.approval_status === "pending_approval" || i.status === "pending").length;
  const activeSurveys = surveysList.length;
  const totalMedia = mediaList.length;
  const unreadBulletins = bulletinsList.filter((i) => i.status === "Unread").length;

  const cardConfig = [
    { key: "submissions", label: "My Submissions", val: `${totalSubmissions} Items`, note: `${publishedSubmissions} approved, ${pendingSubmissions} pending`, icon: FileText, color: "#fbbf24" },
    { key: "surveys", label: "Assigned Field Surveys", val: `${activeSurveys} Active`, note: "Resource telemetry active", icon: MapPin, color: "#34d399" },
    { key: "media", label: "Media Uploads", val: `${totalMedia} Assets`, note: "Indexed in archive", icon: ImageIcon, color: "#60a5fa" },
    { key: "bulletins", label: "Internal Bulletins", val: `${unreadBulletins} Unread`, note: "Directorate directives", icon: Bell, color: "#f87171" },
  ];

  const getActiveList = () => {
    let list: DetailRecord[] = [];
    if (selectedCard === "submissions") list = submissionsList;
    if (selectedCard === "surveys") list = surveysList;
    if (selectedCard === "media") list = mediaList;
    if (selectedCard === "bulletins") list = bulletinsList;

    if (!searchQuery.trim()) return list;
    return list.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredChatMessages = chatMessages.filter((msg) => {
    if (msg.chatType !== chatMode) return false;
    return msg.target === activeTarget || msg.sender === activeTarget || msg.sender === profileName;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col">
      
      {/* Top Bar Banner */}
      <div className="bg-[#00111a] border-b border-slate-800/80 px-6 py-2 flex justify-between items-center text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Circle size={8} className="text-emerald-400 fill-emerald-400" />
          <span>Official Federal Portal - Republic of Nigeria</span>
        </div>
        <div>
          <span>+2348025252362</span> | <span>Port Harcourt, Rivers State</span>
        </div>
      </div>

      {/* Main Single Header */}
      <header className="px-6 py-4 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-base font-black text-white leading-none">NIRRMPT Nigeria</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">REGENERATIVE RESOURCE MANAGEMENT & PROTECTION</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab(activeTab === "dashboard" ? "profile" : "dashboard")}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-2"
          >
            <User size={14} />
            <span>{activeTab === "profile" ? "Workspace" : "Profile & Settings"}</span>
          </button>

          <button
            onClick={handleSignOut}
            className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-2"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex flex-1 flex-col lg:flex-row">
        
        {/* Left Sidebar: EXCLUSIVELY STAFF FIELD DESK (NO ROLE PORTALS!) */}
        <aside className="w-full lg:w-64 bg-[#0a101d] border-b lg:border-b-0 lg:border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            
            {/* Active Desk Badge */}
            <div className="p-3.5 bg-blue-950/60 border border-blue-500/30 rounded-2xl space-y-1">
              <span className="text-[9px] font-black uppercase text-blue-400 tracking-wider block">
                ACTIVE FIELD AUTHORITY
              </span>
              <h2 className="text-sm font-black text-white">Staff Operational Desk</h2>
              <span className="text-[10px] text-slate-400 block truncate">{profile?.email}</span>
            </div>

            {/* Exclusive Staff Navigation Menu */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold uppercase text-slate-500 px-3 block mb-2">
                STAFF MODULES
              </span>

              <button
                onClick={() => { setActiveTab("dashboard"); setActiveSubModule("overview"); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
                  activeTab === "dashboard" && activeSubModule === "overview"
                    ? "bg-blue-600 text-white shadow-md border border-blue-400/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <FileText size={15} />
                <span>Overview Dashboard</span>
              </button>

              <button
                onClick={() => { setActiveTab("dashboard"); setActiveSubModule("workflows"); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
                  activeTab === "dashboard" && activeSubModule === "workflows"
                    ? "bg-blue-600 text-white shadow-md border border-blue-400/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Layers size={15} />
                <span>Field Workflows & Surveys</span>
              </button>

              <button
                onClick={() => { setActiveTab("dashboard"); setActiveSubModule("gis"); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
                  activeTab === "dashboard" && activeSubModule === "gis"
                    ? "bg-blue-600 text-white shadow-md border border-blue-400/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Map size={15} />
                <span>GIS Resource Map</span>
              </button>

              <button
                onClick={() => { setActiveTab("dashboard"); setActiveSubModule("training"); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
                  activeTab === "dashboard" && activeSubModule === "training"
                    ? "bg-blue-600 text-white shadow-md border border-blue-400/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Award size={15} />
                <span>Training & Certifications</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-1">
            <span className="text-[9px] uppercase font-bold text-slate-500 block">AUTHENTICATED IDENTITY</span>
            <span className="text-xs font-bold text-slate-300 block truncate">{profile?.email}</span>
            <span className="text-[10px] text-blue-400/80 font-medium block">nirrmpt.org verified</span>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          
          {/* Sub-Header Banner */}
          <div className="p-5 bg-[#0f172a] border border-slate-800 rounded-2xl flex items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-400">
                <Briefcase size={22} />
              </div>
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">NIRRMPT PORTAL</span>
                <h2 className="text-base font-black text-white">Staff Operational Desk</h2>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-white transition"
            >
              <RefreshCw size={14} className={`text-amber-400 ${refreshing ? "animate-spin" : ""}`} />
              <span>{refreshing ? "Syncing..." : "Refresh Feed"}</span>
            </button>
          </div>

          {/* Toast Notification */}
          {actionSuccess && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-emerald-300 text-xs">
              <CheckCircle2 size={16} />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* VIEW 1: PROFILE */}
          {activeTab === "profile" ? (
            <div className="p-6 bg-[#0f172a] border border-slate-800 rounded-3xl space-y-6 max-w-2xl">
              <div>
                <h2 className="text-lg font-bold text-white">User Profile & Operational Settings</h2>
                <p className="text-xs text-slate-400">Manage your field credentials and department division assignment.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-400 bg-slate-800 overflow-hidden flex items-center justify-center">
                    {profileAvatar ? <img src={profileAvatar} alt="Avatar" className="w-full h-full object-cover" /> : <User size={32} className="text-slate-500" />}
                  </div>
                  <label className="cursor-pointer px-3.5 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-white border border-slate-700">
                    Upload Picture
                    <input type="file" accept="image/*" onChange={handleProfileAvatarChange} className="hidden" />
                  </label>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Officer Name</label>
                  <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white" />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Department Division</label>
                  <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-semibold">
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <button onClick={() => { setActionSuccess("Profile settings updated successfully."); setTimeout(() => setActionSuccess(null), 4000); }} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow">
                  Save Profile Configuration
                </button>
              </div>
            </div>
          ) : activeSubModule === "training" ? (
            /* VIEW 2: TRAINING */
            <div className="space-y-6">
              <div className="p-6 bg-[#0f172a] border border-slate-800 rounded-3xl">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Capacity Building Directorate</span>
                <h3 className="text-xl font-black text-white mt-1">Staff Training & Workshop Certifications</h3>
                <p className="text-xs text-slate-400 mt-1">Enroll in official NIRRMPT environmental certifications, spatial mapping workshops, and regulatory compliance masterclasses.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainingPrograms.map((prog) => (
                  <div key={prog.id} className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg">
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-emerald-400 font-bold">{prog.seatsLeft} Seats Left</span>
                        <span className="text-slate-500 font-mono text-[11px]">{prog.id}</span>
                      </div>
                      <h4 className="text-base font-bold text-white leading-snug">{prog.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{prog.description}</p>
                      <div className="text-xs text-slate-300 pt-2 border-t border-slate-800/80 space-y-1">
                        <div>📅 {prog.date}</div>
                        <div>📍 {prog.location}</div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button onClick={() => { setSelectedProgram(prog); setRegistrationSuccessId(null); }} className="w-full py-2.5 bg-[#004d2c] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition">
                        Select & Register
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedProgram && (
                <div className="p-6 bg-[#0f172a] border-2 border-emerald-500/40 rounded-3xl space-y-4 shadow-2xl">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-400">Selected Module</span>
                      <h4 className="text-lg font-bold text-white">{selectedProgram.title}</h4>
                    </div>
                    <button onClick={() => setSelectedProgram(null)} className="text-slate-400 hover:text-white"><X size={18} /></button>
                  </div>

                  {registrationSuccessId ? (
                    <div className="p-4 bg-emerald-950/60 border border-emerald-500/30 rounded-2xl space-y-2 text-emerald-300">
                      <h4 className="font-bold text-sm">Enrollment Generated Successfully!</h4>
                      <p className="text-xs">Your official registration tracking token is: <strong className="text-white font-mono bg-slate-950 px-2 py-0.5 rounded">{registrationSuccessId}</strong></p>
                      <button onClick={() => setSelectedProgram(null)} className="mt-2 px-4 py-1.5 bg-[#004d2c] text-white rounded-lg text-xs font-bold">Done</button>
                    </div>
                  ) : (
                    <form onSubmit={handleTrainingRegisterSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Full Name *</label>
                        <input required name="fullName" value={trainingFormData.fullName} onChange={handleTrainingInputChange} placeholder="Dr. Chidi Okafor" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Official Email *</label>
                        <input required type="email" name="email" value={trainingFormData.email} onChange={handleTrainingInputChange} placeholder="field.staff@nirrmpt.org" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white" />
                      </div>
                      <div className="sm:col-span-2">
                        <button type="submit" disabled={isRegistering} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow">
                          {isRegistering ? "Processing..." : "Confirm Enrollment & Generate Token"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          ) : activeSubModule === "workflows" ? (
            /* VIEW 3: WORKFLOWS */
            <div className="space-y-6">
              <div className="p-6 bg-[#0f172a] border border-slate-800 rounded-3xl space-y-4">
                <h3 className="text-lg font-bold text-white">Active Field Surveys & Inspection Telemetry</h3>
                <p className="text-xs text-slate-400">Assigned environmental survey tasks across designated sectors and conservation blocks.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {surveysList.map((survey) => (
                    <div key={survey.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs font-bold text-emerald-400">{survey.id}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300">{survey.status}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{survey.title}</h4>
                      <p className="text-xs text-slate-400">{survey.subtitle}</p>
                      <p className="text-xs text-slate-500 bg-[#0f172a] p-2.5 rounded-xl border border-slate-800/80">{survey.full_content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* VIEW 4: OVERVIEW DASHBOARD */
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cardConfig.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.key}
                      onClick={() => { setSelectedCard(card.key as any); setSearchQuery(""); setExpandedRecordId(null); }}
                      className="p-5 bg-[#0f172a] border border-slate-800 hover:border-amber-400/40 rounded-2xl cursor-pointer space-y-2 transition shadow-lg"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
                        <Icon size={16} style={{ color: card.color }} />
                      </div>
                      <p className="text-2xl font-black text-white">{card.val}</p>
                      <span className="text-xs text-amber-300 font-semibold block">{card.note}</span>
                    </div>
                  );
                })}
              </div>

              {/* Quick Field Entry Actions */}
              <div className="p-6 bg-[#0f172a] border border-slate-800 rounded-3xl space-y-3 shadow-xl">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Field Entry Directives</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={() => setActiveModal("news")} className="p-4 bg-slate-950 border border-slate-800 hover:border-amber-400/50 rounded-2xl text-amber-300 font-bold text-xs flex items-center gap-3 transition">
                    <PenTool size={18} />
                    <span>Submit Field News Draft</span>
                  </button>
                  <button onClick={() => setActiveModal("gallery")} className="p-4 bg-slate-950 border border-slate-800 hover:border-amber-400/50 rounded-2xl text-amber-300 font-bold text-xs flex items-center gap-3 transition">
                    <Upload size={18} />
                    <span>Upload Field Photography Assets</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Floating Chat Trigger */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-full flex items-center gap-2 shadow-2xl transition border border-amber-300/40"
      >
        <MessageSquare size={16} />
        <span>Staff & Field Desk Chat</span>
      </button>

      {/* Live Chat Modal Drawer */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 h-[480px] bg-[#0f172a] border border-slate-700 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
          <div className="p-3 bg-[#020617] border-b border-slate-800 flex justify-between items-center">
            <span className="text-xs font-bold text-white">NIRRMPT Staff Live Desk</span>
            <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white"><X size={16} /></button>
          </div>

          <div className="p-2 bg-[#090d16] border-b border-slate-800 flex gap-2">
            <button onClick={() => { setChatMode("private"); setActiveTarget(PRIVATE_CONTACTS[0]); }} className={`flex-1 py-1 rounded text-[10px] font-bold ${chatMode === "private" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}>Private Chat</button>
            <button onClick={() => { setChatMode("group"); setActiveTarget(GROUP_CHANNELS[0]); }} className={`flex-1 py-1 rounded text-[10px] font-bold ${chatMode === "group" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}>Group Forum</button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {filteredChatMessages.map((msg) => (
              <div key={msg.id} className={`max-w-[80%] ${msg.sender === profileName ? "ml-auto" : "mr-auto"}`}>
                <div className="text-[9px] text-slate-500 mb-0.5">{msg.sender} • {msg.timestamp}</div>
                <div className={`p-2.5 rounded-xl text-xs ${msg.sender === profileName ? "bg-amber-500 text-slate-950 font-medium" : "bg-slate-800 text-white"}`}>{msg.text}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-2.5 bg-[#020617] border-t border-slate-800 flex gap-2">
            <input type="text" placeholder={`Message ${activeTarget}...`} value={chatMessageInput} onChange={(e) => setChatMessageInput(e.target.value)} className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400" />
            <button type="submit" className="px-3 py-1.5 bg-amber-500 text-slate-950 rounded-lg font-bold"><Send size={14} /></button>
          </form>
        </div>
      )}

      {/* Record Inspection Overlay */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 w-full max-w-xl max-h-[80vh] rounded-3xl p-6 space-y-4 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white capitalize">{cardConfig.find((c) => c.key === selectedCard)?.label} Records</h3>
              <button onClick={() => setSelectedCard(null)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <input type="text" placeholder="Search record..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none" />

            <div className="overflow-y-auto space-y-2 flex-1">
              {getActiveList().map((item) => (
                <div key={item.id} onClick={() => setExpandedRecordId(expandedRecordId === item.id ? null : item.id)} className="p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-amber-400/40 space-y-1">
                  <div className="flex justify-between text-xs font-bold text-white">
                    <span>{item.title}</span>
                    <span className="text-amber-400 text-[10px]">{item.approval_status || item.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{item.subtitle}</p>
                  {expandedRecordId === item.id && item.full_content && (
                    <p className="text-[11px] text-slate-300 pt-2 border-t border-slate-800/80">{item.full_content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: News / Gallery */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">{activeModal === "news" ? "Submit Field News Draft" : "Upload Field Media Asset"}</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white"><X size={16} /></button>
            </div>

            {activeModal === "news" ? (
              <form onSubmit={handleNewsSubmit} className="space-y-3">
                <input required placeholder="Report Title" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none" />
                <textarea required rows={4} placeholder="Report Content..." value={newsContent} onChange={(e) => setNewsContent(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none" />
                <button type="submit" disabled={submitting} className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow">{submitting ? "Submitting..." : "Submit Draft"}</button>
              </form>
            ) : (
              <form onSubmit={handleGallerySubmit} className="space-y-3">
                <input required placeholder="Asset Caption" value={mediaCaption} onChange={(e) => setMediaCaption(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none" />
                <input required type="file" accept="image/*,video/*" onChange={(e) => setMediaFile(e.target.files ? e.target.files[0] : null)} className="w-full text-xs text-slate-400 file:bg-slate-800 file:text-amber-300 file:border-0 file:rounded-lg file:py-1 file:px-2.5 cursor-pointer" />
                <button type="submit" disabled={submitting} className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow">{submitting ? "Uploading..." : "Upload Asset"}</button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}