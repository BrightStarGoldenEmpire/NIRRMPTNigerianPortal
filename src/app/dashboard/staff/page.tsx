"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
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
  ShieldCheck,
  Search,
  ArrowLeft,
  LogOut,
  User,
  Settings,
  Paperclip,
  Clock,
  CheckCircle,
  MessageSquare,
  Send,
  Building2,
  ChevronDown,
  ChevronUp,
  Circle,
  Users,
  UserCheck,
  LayoutDashboard,
  Briefcase,
  Layers,
  Map
} from 'lucide-react';

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
  approval_status?: 'pending_approval' | 'approved' | 'rejected';
  full_content?: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  target: string;
  text: string;
  timestamp: string;
  chatType: 'private' | 'group';
}

const DEPARTMENTS = [
  "Environmental Protection & Monitoring",
  "GIS & Remote Sensing Division",
  "Hydrological & Water Resources",
  "Regenerative Agriculture & Soil Conservation",
  "Forestry & Biodiversity Reserves",
  "Directorate Operations & Administration",
  "Research & Technology Integration"
];

const PRIVATE_CONTACTS = [
  "Admin Portal",
  "Field Team Lead",
  "GIS Operations Lead",
  "Senior Hydrologist"
];

const GROUP_CHANNELS = [
  "General Staff Forum",
  "GIS Emergency Channel",
  "Field Ops Directive Group"
];

export default function StaffDashboard() {
  const router = useRouter();
  
  // Navigation & User State
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Active Sidebar Role Tab & Sub-module
  const [activeRole, setActiveRole] = useState<'public' | 'staff' | 'directorate' | 'superadmin'>('staff');
  const [activeSubModule, setActiveSubModule] = useState<'overview' | 'workflows' | 'gis'>('overview');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile'>('dashboard');

  // Profile Form States
  const [profileName, setProfileName] = useState('Staff Officer');
  const [selectedDepartment, setSelectedDepartment] = useState(DEPARTMENTS[0]);
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Dynamic Card Data Stores
  const [submissionsList, setSubmissionsList] = useState<DetailRecord[]>([]);
  const [surveysList, setSurveysList] = useState<DetailRecord[]>([]);
  const [mediaList, setMediaList] = useState<DetailRecord[]>([]);
  const [bulletinsList, setBulletinsList] = useState<DetailRecord[]>([]);

  // Modals & Overlay States
  const [selectedCard, setSelectedCard] = useState<'submissions' | 'surveys' | 'media' | 'bulletins' | null>(null);
  const [expandedRecordId, setExpandedRecordId] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<'news' | 'gallery' | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Live Chat Drawer State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState<'private' | 'group'>('private');
  const [activeTarget, setActiveTarget] = useState<string>(PRIVATE_CONTACTS[0]);
  const [chatMessageInput, setChatMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Admin Portal', target: 'Admin Portal', text: 'Welcome to NIRRMPT Operational Desk. Submit direct staff queries here.', timestamp: '09:00 AM', chatType: 'private' },
    { id: '2', sender: 'GIS Operations Lead', target: 'General Staff Forum', text: 'All field officers: Sector 4 GIS satellite sync completed.', timestamp: '10:15 AM', chatType: 'group' }
  ]);

  // Form Field Inputs
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsFile, setNewsFile] = useState<File | null>(null);
  const [mediaCaption, setMediaCaption] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  // Role Navigation Router
  const handleRoleNavigation = (role: 'public' | 'staff' | 'directorate' | 'superadmin') => {
    setActiveRole(role);
    if (role === 'public') router.push('/dashboard/citizen');
    if (role === 'staff') router.push('/dashboard/staff');
    if (role === 'directorate') router.push('/dashboard/admin');
    if (role === 'superadmin') router.push('/dashboard/superadmin');
  };

  // Data Fetching Engine
  const loadWorkspaceData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      let currentUserEmail = 'staff.officer@nirrmpt.gov.ng';
      let currentUserId = '';

      if (session?.user) {
        currentUserId = session.user.id;
        currentUserEmail = session.user.email || 'staff@nirrmpt.gov.ng';
      } else {
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('nirrmpt_user') : null;
        const parsed = storedUser ? JSON.parse(storedUser) : null;
        if (parsed?.email) currentUserEmail = parsed.email;
      }

      setProfile({
        id: currentUserId,
        email: currentUserEmail,
        role: 'staff',
        department: selectedDepartment
      });

      const [newsRes, surveysRes, mediaRes, bulletinsRes] = await Promise.allSettled([
        supabase.from('news_submissions').select('*').order('created_at', { ascending: false }),
        supabase.from('field_surveys').select('*').order('created_at', { ascending: false }),
        supabase.from('gallery_assets').select('*').order('created_at', { ascending: false }),
        supabase.from('internal_bulletins').select('*').order('created_at', { ascending: false })
      ]);

      if (newsRes.status === 'fulfilled' && newsRes.value.data && newsRes.value.data.length > 0) {
        setSubmissionsList(newsRes.value.data.map((item: any) => ({
          id: item.id,
          title: item.title || 'Untitled Field Report',
          subtitle: item.content?.substring(0, 90) + '...' || 'Pending operational report summary',
          full_content: item.content || 'No detailed content provided for this record.',
          status: item.status || 'pending',
          approval_status: item.approval_status || 'pending_approval',
          date: new Date(item.created_at || Date.now()).toLocaleDateString()
        })));
      } else {
        setSubmissionsList([
          { id: '1', title: 'Q3 Coastal Soil Degradation Assessment', subtitle: 'Detailed analysis of coastal erosion in Sector 4', full_content: 'Comprehensive field investigation conducted across Sector 4. High concentration of salinity detected in surface soil samples. Recommended emergency barrier deployment and mangrove re-vegetation.', status: 'published', approval_status: 'approved', date: '2026-09-15' },
          { id: '2', title: 'Hydrological Field Survey Draft', subtitle: 'River Basin water quality measurements', full_content: 'Water pH levels recorded at 6.4 with trace mineral sedimentation. Secondary testing scheduled for upstream tributaries.', status: 'pending', approval_status: 'pending_approval', date: '2026-09-17' },
          { id: '3', title: 'Vegetation Canopy Coverage Index', subtitle: 'Satellite validation ground truth data', full_content: 'Ground truth verification confirms 82% canopy density across designated forest reserves, aligning with Sentinel-2 satellite imagery.', status: 'published', approval_status: 'approved', date: '2026-09-10' },
          { id: '4', title: 'Ecosystem Regeneration Status Report', subtitle: 'Forestry reserve monitoring metrics', full_content: 'Preliminary biomass growth indices show a 14% yield recovery following seasonal conservation measures.', status: 'pending', approval_status: 'pending_approval', date: '2026-09-18' }
        ]);
      }

      if (surveysRes.status === 'fulfilled' && surveysRes.value.data && surveysRes.value.data.length > 0) {
        setSurveysList(surveysRes.value.data.map((item: any) => ({
          id: item.id,
          title: item.title || 'Assigned Field Survey',
          subtitle: item.location || 'Active Inspection Zone',
          full_content: `Location coordinates verified. Task scope: ${item.location || 'Sector Inspection'}`,
          status: item.status || 'Active',
          date: new Date(item.created_at || Date.now()).toLocaleDateString()
        })));
      } else {
        setSurveysList([
          { id: 's1', title: 'Niger Delta Mangrove Restoration Monitor', subtitle: 'Zone Delta-4 Field Sector', full_content: 'Active field survey tracking root survival rate in restored coastal zone.', status: 'Active', date: '2026-09-18' },
          { id: 's2', title: 'Soil Contamination GIS Sampling', subtitle: 'Zone North-2 Industrial Perimeter', full_content: 'Heavy metal heavy-ion analysis scheduled across 12 grid blocks.', status: 'Active', date: '2026-09-17' }
        ]);
      }

      if (mediaRes.status === 'fulfilled' && mediaRes.value.data && mediaRes.value.data.length > 0) {
        setMediaList(mediaRes.value.data.map((item: any) => ({
          id: item.id,
          title: item.caption || 'Field Photograph Asset',
          subtitle: item.url || 'Stored in encrypted cloud repository',
          full_content: `Media Asset Metadata: Author: ${item.author_email || 'Staff'}. File Path: ${item.url || 'Cloud Storage'}`,
          category: item.category || 'Field Captures',
          approval_status: item.approval_status || 'pending_approval',
          date: new Date(item.created_at || Date.now()).toLocaleDateString()
        })));
      } else {
        setMediaList([
          { id: 'm1', title: 'Sector 4 High-Res Wetland Drone Shot', subtitle: 'RAW High-Resolution Capture • 14.2 MB', full_content: 'Aerial multispectral imagery covering 45 hectares of degraded wetland.', category: 'Aerial', approval_status: 'approved', date: '2026-09-17' },
          { id: 'm2', title: 'Erosion Barrier Field Inspection', subtitle: 'Site Operations Photograph', full_content: 'High-resolution photo log documenting barrier structural integrity.', category: 'Inspection', approval_status: 'pending_approval', date: '2026-09-14' }
        ]);
      }

      if (bulletinsRes.status === 'fulfilled' && bulletinsRes.value.data && bulletinsRes.value.data.length > 0) {
        setBulletinsList(bulletinsRes.value.data.map((item: any) => ({
          id: item.id,
          title: item.subject || 'Directorate Bulletin',
          subtitle: item.body || 'Directive from central command',
          full_content: item.body || 'Directive details issued by NIRRMPT Directorate.',
          status: item.unread ? 'Unread' : 'Read',
          date: new Date(item.created_at || Date.now()).toLocaleDateString()
        })));
      } else {
        setBulletinsList([
          { id: 'b1', title: 'Revised Field Protocol Directive (NIRRMPT-2026)', subtitle: 'Mandatory updated safety procedure guidelines', full_content: 'All staff deployed in high-salinity field sectors must log real-time telemetry every 4 hours.', status: 'Unread', date: '2026-09-18' }
        ]);
      }

    } catch (err: any) {
      console.warn('Workspace sync warning:', err.message);
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
    try {
      await supabase.auth.signOut();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nirrmpt_user');
      }
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageInput.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: profileName || profile?.email || 'Staff Officer',
      target: activeTarget,
      text: chatMessageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chatType: chatMode
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatMessageInput('');
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) return;

    setSubmitting(true);
    let uploadedFileUrl = '';

    try {
      if (newsFile) {
        const fileExt = newsFile.name.split('.').pop();
        const filePath = `news-attachments/${Date.now()}.${fileExt}`;
        const { data } = await supabase.storage.from('portal-uploads').upload(filePath, newsFile);
        if (data) uploadedFileUrl = data.path;
      }

      const payload = {
        title: newsTitle,
        content: newsContent,
        author_id: profile?.id,
        author_email: profile?.email,
        status: 'pending_approval',
        approval_status: 'pending_approval',
        file_url: uploadedFileUrl,
        created_at: new Date().toISOString()
      };

      await supabase.from('news_submissions').insert([payload]);
    } catch {
      console.log('Queued locally for approval');
    } finally {
      const newRecord: DetailRecord = {
        id: Date.now().toString(),
        title: newsTitle,
        subtitle: newsContent.length > 90 ? newsContent.substring(0, 90) + '...' : newsContent,
        full_content: newsContent,
        status: 'Pending Review',
        approval_status: 'pending_approval',
        file_url: newsFile ? newsFile.name : undefined,
        date: new Date().toISOString().split('T')[0]
      };

      setSubmissionsList(prev => [newRecord, ...prev]);
      setActionSuccess('News draft submitted to Directorate/Admin for approval before public release.');
      setNewsTitle('');
      setNewsContent('');
      setNewsFile(null);
      setActiveModal(null);
      setSubmitting(false);
      setTimeout(() => setActionSuccess(null), 6000);
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaCaption.trim()) return;

    setSubmitting(true);
    let uploadedFileUrl = '';

    try {
      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop();
        const filePath = `gallery/${Date.now()}.${fileExt}`;
        const { data } = await supabase.storage.from('portal-uploads').upload(filePath, mediaFile);
        if (data) uploadedFileUrl = data.path;
      }

      await supabase.from('gallery_assets').insert([
        {
          caption: mediaCaption,
          url: uploadedFileUrl || 'local_staged_asset',
          author_email: profile?.email,
          approval_status: 'pending_approval',
          created_at: new Date().toISOString()
        }
      ]);
    } catch {
      console.log('Queued locally for manager approval');
    } finally {
      const newRecord: DetailRecord = {
        id: Date.now().toString(),
        title: mediaCaption,
        subtitle: mediaFile ? `Attached: ${mediaFile.name}` : 'Staged Asset',
        full_content: `Uploaded file asset: ${mediaFile ? mediaFile.name : 'Staged Asset'}. Pending Directorate clearance.`,
        category: 'Field Upload',
        approval_status: 'pending_approval',
        date: new Date().toISOString().split('T')[0]
      };

      setMediaList(prev => [newRecord, ...prev]);
      setActionSuccess('Media uploaded and submitted to Supervisor/Admin for approval before publishing.');
      setMediaCaption('');
      setMediaFile(null);
      setActiveModal(null);
      setSubmitting(false);
      setTimeout(() => setActionSuccess(null), 6000);
    }
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
      <div style={{ minHeight: "100vh", backgroundColor: "#020617", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "#f59e0b" }}>
        <div style={{ width: "32px", height: "32px", border: "3px solid #f59e0b", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <span style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>Loading Operational Workspace...</span>
      </div>
    );
  }

  const totalSubmissions = submissionsList.length;
  const publishedSubmissions = submissionsList.filter(i => i.approval_status === 'approved' || i.status === 'published').length;
  const pendingSubmissions = submissionsList.filter(i => i.approval_status === 'pending_approval' || i.status === 'pending').length;
  const activeSurveys = surveysList.length;
  const totalMedia = mediaList.length;
  const unreadBulletins = bulletinsList.filter(i => i.status === 'Unread').length;

  const cardConfig = [
    { key: 'submissions', label: 'My Submissions', val: `${totalSubmissions} Items`, note: `${publishedSubmissions} published, ${pendingSubmissions} pending approval`, icon: FileText, color: '#fbbf24' },
    { key: 'surveys', label: 'Assigned Field Surveys', val: `${activeSurveys} Active`, note: 'Resource monitoring active', icon: MapPin, color: '#34d399' },
    { key: 'media', label: 'Media Uploads', val: `${totalMedia} Assets`, note: 'Indexed in public gallery', icon: ImageIcon, color: '#60a5fa' },
    { key: 'bulletins', label: 'Internal Bulletins', val: `${unreadBulletins} Unread`, note: 'Directives from Directorate', icon: Bell, color: '#f87171' },
  ];

  const getActiveList = () => {
    let list: DetailRecord[] = [];
    if (selectedCard === 'submissions') list = submissionsList;
    if (selectedCard === 'surveys') list = surveysList;
    if (selectedCard === 'media') list = mediaList;
    if (selectedCard === 'bulletins') list = bulletinsList;

    if (!searchQuery.trim()) return list;
    return list.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredChatMessages = chatMessages.filter(msg => {
    if (msg.chatType !== chatMode) return false;
    return msg.target === activeTarget || msg.sender === activeTarget || msg.sender === profileName;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#020617", color: "#f8fafc", fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* Top Banner Bar */}
      <div style={{ padding: "8px 24px", backgroundColor: "#00111a", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#94a3b8" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Circle size={8} style={{ color: "#10b981", fill: "#10b981" }} />
          <span>Official Federal Portal - Republic of Nigeria</span>
        </div>
        <div>
          <span>+2348025252362</span> | <span>Port Harcourt, Rivers State</span>
        </div>
      </div>

      {/* Main Header with Navigation Tabs */}
      <div style={{ padding: "16px 24px", backgroundColor: "#020617", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "8px", backgroundColor: "rgba(245, 158, 11, 0.15)", border: "1px solid #f59e0b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fbbf24", fontWeight: "bold" }}>
            <Building2 size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: "900", color: "#ffffff", margin: 0, letterSpacing: "0.5px" }}>NIRRMPT Nigeria</h1>
            <p style={{ fontSize: "10px", color: "#64748b", margin: 0, letterSpacing: "0.5px" }}>REGENERATIVE RESOURCE MANAGEMENT & PROTECTION</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <button onClick={() => router.push('/')} style={{ background: "none", border: "none", color: "#cbd5e1", fontSize: "12px", cursor: "pointer" }}>Home</button>
          <button onClick={() => router.push('/about')} style={{ background: "none", border: "none", color: "#cbd5e1", fontSize: "12px", cursor: "pointer" }}>About Us</button>
          <button onClick={() => router.push('/leadership')} style={{ background: "none", border: "none", color: "#cbd5e1", fontSize: "12px", cursor: "pointer" }}>Leadership & Board</button>
          <button onClick={() => router.push('/departments')} style={{ background: "none", border: "none", color: "#cbd5e1", fontSize: "12px", cursor: "pointer" }}>Departments</button>
          <button onClick={() => router.push('/contact')} style={{ background: "none", border: "none", color: "#cbd5e1", fontSize: "12px", cursor: "pointer" }}>Contact</button>

          <button 
            onClick={() => setActiveTab(activeTab === 'dashboard' ? 'profile' : 'dashboard')}
            style={{ padding: "8px 16px", backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.4)", borderRadius: "8px", color: "#fbbf24", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          >
            <User size={14} />
            <span>{activeTab === 'profile' ? 'Workspace' : 'Profile & Settings'}</span>
          </button>

          <button 
            onClick={handleSignOut}
            style={{ padding: "8px 16px", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: "8px", color: "#f87171", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Layout Body */}
      <div style={{ display: "flex", flex: 1 }}>
        
        {/* Sidebar Role Navigator */}
        <div style={{ width: "240px", backgroundColor: "#020617", borderRight: "1px solid #1e293b", padding: "20px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "10px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", padding: "0 8px 8px 8px" }}>
            Role Portals
          </span>

          <button
            onClick={() => handleRoleNavigation('public')}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "none", backgroundColor: activeRole === 'public' ? "#10b981" : "transparent", color: activeRole === 'public' ? "#020617" : "#94a3b8", fontSize: "12px", fontWeight: "bold", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Users size={16} />
            <span>Public & Partner Hub</span>
          </button>

          <button
            onClick={() => handleRoleNavigation('staff')}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "none", backgroundColor: activeRole === 'staff' ? "#10b981" : "transparent", color: activeRole === 'staff' ? "#020617" : "#94a3b8", fontSize: "12px", fontWeight: "bold", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Briefcase size={16} />
            <span>Staff Field Desk</span>
          </button>

          <button
            onClick={() => handleRoleNavigation('directorate')}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "none", backgroundColor: activeRole === 'directorate' ? "#10b981" : "transparent", color: activeRole === 'directorate' ? "#020617" : "#94a3b8", fontSize: "12px", fontWeight: "bold", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Building2 size={16} />
            <span>Directorate Operations</span>
          </button>

          <button
            onClick={() => handleRoleNavigation('superadmin')}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "none", backgroundColor: activeRole === 'superadmin' ? "#10b981" : "transparent", color: activeRole === 'superadmin' ? "#020617" : "#94a3b8", fontSize: "12px", fontWeight: "bold", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <ShieldCheck size={16} />
            <span>Super Admin Core</span>
          </button>
        </div>

        {/* Content Panel Area */}
        <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
          
          {/* Sub-Header Banner */}
          <div style={{ padding: "16px 20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ padding: "8px", backgroundColor: "rgba(245, 158, 11, 0.15)", borderRadius: "8px", color: "#fbbf24" }}>
                <Briefcase size={20} />
              </div>
              <div>
                <span style={{ fontSize: "10px", color: "#fbbf24", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase" }}>NIRRMPT PORTAL</span>
                <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#ffffff", margin: 0 }}>Staff Operational Desk</h2>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f8fafc", fontSize: "12px", cursor: "pointer" }}
            >
              <RefreshCw size={14} style={{ color: "#fbbf24" }} />
              <span>{refreshing ? "Syncing..." : "Refresh"}</span>
            </button>
          </div>

          {/* Sub-Module Secondary Navigation */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", borderBottom: "1px solid #1e293b", paddingBottom: "12px" }}>
            <button
              onClick={() => setActiveSubModule('overview')}
              style={{ padding: "8px 14px", borderRadius: "6px", border: "none", backgroundColor: activeSubModule === 'overview' ? "#1e293b" : "transparent", color: activeSubModule === 'overview' ? "#38bdf8" : "#94a3b8", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
            >
              <LayoutDashboard size={14} />
              <span>Overview Dashboard</span>
            </button>

            <button
              onClick={() => setActiveSubModule('workflows')}
              style={{ padding: "8px 14px", borderRadius: "6px", border: "none", backgroundColor: activeSubModule === 'workflows' ? "#1e293b" : "transparent", color: activeSubModule === 'workflows' ? "#38bdf8" : "#94a3b8", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
            >
              <Layers size={14} />
              <span>Operational Workflows</span>
            </button>

            <button
              onClick={() => setActiveSubModule('gis')}
              style={{ padding: "8px 14px", borderRadius: "6px", border: "none", backgroundColor: activeSubModule === 'gis' ? "#1e293b" : "transparent", color: activeSubModule === 'gis' ? "#38bdf8" : "#94a3b8", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
            >
              <Map size={14} />
              <span>GIS Resource Map</span>
            </button>
          </div>

          {/* Toast Notification */}
          {actionSuccess && (
            <div style={{ padding: "12px 16px", backgroundColor: "rgba(6, 78, 59, 0.9)", border: "1px solid #10b981", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px", color: "#34d399", fontSize: "12px", marginBottom: "20px" }}>
              <CheckCircle2 size={16} />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Profile Tab View */}
          {activeTab === 'profile' ? (
            <div style={{ padding: "24px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", margin: "0 0 4px 0" }}>User Profile & Operational Settings</h2>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Manage your credentials and department assignment.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                <div style={{ padding: "20px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", border: "2px solid #f59e0b", backgroundColor: "#1e293b", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {profileAvatar ? <img src={profileAvatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <User size={40} style={{ color: "#64748b" }} />}
                  </div>
                  <label style={{ cursor: "pointer", padding: "8px 14px", backgroundColor: "#1e293b", borderRadius: "6px", color: "#ffffff", fontSize: "11px" }}>
                    Upload Picture
                    <input type="file" accept="image/*" onChange={handleProfileAvatarChange} style={{ display: "none" }} />
                  </label>
                </div>

                <div style={{ padding: "20px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Officer Name</label>
                    <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "6px", padding: "8px", color: "#ffffff", fontSize: "12px" }} />
                  </div>

                  <div>
                    <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Department Division</label>
                    <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #f59e0b", borderRadius: "6px", padding: "8px", color: "#ffffff", fontSize: "12px" }}>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <button onClick={() => { setActionSuccess('Profile updated successfully.'); setTimeout(() => setActionSuccess(null), 4000); }} style={{ padding: "8px", backgroundColor: "#f59e0b", border: "none", borderRadius: "6px", color: "#020617", fontWeight: "bold", fontSize: "12px", cursor: "pointer", marginTop: "8px" }}>
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Dashboard View */
            <>
              {/* Metric Cards Feed */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                {cardConfig.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div 
                      key={card.key}
                      onClick={() => { setSelectedCard(card.key as any); setSearchQuery(''); setExpandedRecordId(null); }}
                      style={{ padding: "16px", backgroundColor: "#0f172a", border: selectedCard === card.key ? "1px solid #f59e0b" : "1px solid #1e293b", borderRadius: "12px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "8px" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "bold" }}>{card.label}</span>
                        <Icon size={16} style={{ color: card.color }} />
                      </div>
                      <span style={{ fontSize: "20px", fontWeight: "900", color: "#ffffff" }}>{card.val}</span>
                      <span style={{ fontSize: "11px", color: "#fbbf24" }}>{card.note}</span>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions Panel */}
              <div style={{ padding: "20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "12px", fontWeight: "bold", color: "#94a3b8", margin: "0 0 12px 0", textTransform: "uppercase" }}>Field Entry Actions</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                  <button onClick={() => setActiveModal('news')} style={{ padding: "12px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", color: "#fcd34d", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <PenTool size={16} />
                    <span>Submit News Draft</span>
                  </button>

                  <button onClick={() => setActiveModal('gallery')} style={{ padding: "12px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", color: "#fcd34d", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <Upload size={16} />
                    <span>Upload Gallery Assets</span>
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Floating Live Chat Trigger Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 50, padding: "12px 20px", backgroundColor: "#f59e0b", border: "none", borderRadius: "30px", color: "#020617", fontWeight: "bold", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)" }}
      >
        <MessageSquare size={16} />
        <span>Staff & Department Live Chat</span>
      </button>

      {/* Live Chat Modal Drawer */}
      {isChatOpen && (
        <div style={{ position: "fixed", bottom: "70px", right: "24px", zIndex: 50, width: "360px", height: "480px", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "16px", display: "flex", flexDirection: "column", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.5)", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", backgroundColor: "#020617", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: "bold", color: "#ffffff" }}>NIRRMPT Staff Live Desk</span>
            <button onClick={() => setIsChatOpen(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={16} /></button>
          </div>

          <div style={{ padding: "8px 12px", backgroundColor: "#090d16", borderBottom: "1px solid #1e293b", display: "flex", gap: "8px" }}>
            <button onClick={() => { setChatMode('private'); setActiveTarget(PRIVATE_CONTACTS[0]); }} style={{ flex: 1, padding: "6px", borderRadius: "6px", border: "none", backgroundColor: chatMode === 'private' ? "#f59e0b" : "#1e293b", color: chatMode === 'private' ? "#020617" : "#cbd5e1", fontSize: "10px", fontWeight: "bold", cursor: "pointer" }}>Private Chat</button>
            <button onClick={() => { setChatMode('group'); setActiveTarget(GROUP_CHANNELS[0]); }} style={{ flex: 1, padding: "6px", borderRadius: "6px", border: "none", backgroundColor: chatMode === 'group' ? "#f59e0b" : "#1e293b", color: chatMode === 'group' ? "#020617" : "#cbd5e1", fontSize: "10px", fontWeight: "bold", cursor: "pointer" }}>Group Chat</button>
          </div>

          <div style={{ padding: "6px 12px", backgroundColor: "#0f172a", borderBottom: "1px solid #1e293b", display: "flex", gap: "6px", overflowX: "auto" }}>
            {(chatMode === 'private' ? PRIVATE_CONTACTS : GROUP_CHANNELS).map((target) => (
              <button key={target} onClick={() => setActiveTarget(target)} style={{ padding: "4px 8px", borderRadius: "4px", border: "none", backgroundColor: activeTarget === target ? "rgba(245, 158, 11, 0.2)" : "transparent", color: activeTarget === target ? "#fbbf24" : "#94a3b8", fontSize: "10px", cursor: "pointer", whitespace: "nowrap" }}>
                {target}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, padding: "12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
            {filteredChatMessages.map((msg) => (
              <div key={msg.id} style={{ alignSelf: msg.sender === profileName ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                <div style={{ fontSize: "9px", color: "#64748b" }}>{msg.sender} • {msg.timestamp}</div>
                <div style={{ padding: "8px 12px", borderRadius: "8px", backgroundColor: msg.sender === profileName ? "#f59e0b" : "#1e293b", color: msg.sender === profileName ? "#020617" : "#f8fafc", fontSize: "11px" }}>{msg.text}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} style={{ padding: "8px", backgroundColor: "#020617", borderTop: "1px solid #1e293b", display: "flex", gap: "6px" }}>
            <input type="text" placeholder={`Message ${activeTarget}...`} value={chatMessageInput} onChange={(e) => setChatMessageInput(e.target.value)} style={{ flex: 1, backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "6px", padding: "6px 10px", color: "#ffffff", fontSize: "11px" }} />
            <button type="submit" style={{ padding: "6px 10px", backgroundColor: "#f59e0b", border: "none", borderRadius: "6px", color: "#020617", cursor: "pointer" }}><Send size={14} /></button>
          </form>
        </div>
      )}

      {/* Record Inspection Overlay Modal */}
      {selectedCard && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, backgroundColor: "rgba(2, 6, 23, 0.85)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ backgroundColor: "#0f172a", border: "1px solid #334155", width: "100%", maxWidth: "680px", maxHeight: "80vh", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "8px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#ffffff", margin: 0, textTransform: "capitalize" }}>{cardConfig.find(c => c.key === selectedCard)?.label} Records</h3>
              <button onClick={() => setSelectedCard(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={18} /></button>
            </div>

            <input type="text" placeholder="Search record content..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "6px", padding: "8px", color: "#ffffff", fontSize: "12px" }} />

            <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
              {getActiveList().map((item) => (
                <div key={item.id} onClick={() => setExpandedRecordId(expandedRecordId === item.id ? null : item.id)} style={{ padding: "12px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff" }}>{item.title}</span>
                    <span style={{ fontSize: "10px", color: "#fbbf24" }}>{item.approval_status || 'Active'}</span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0 0" }}>{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Modals (News / Gallery) */}
      {activeModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, backgroundColor: "rgba(2, 6, 23, 0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", width: "100%", maxWidth: "480px", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "8px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#ffffff", margin: 0 }}>{activeModal === 'news' ? 'Submit Field News Draft' : 'Upload Gallery Asset'}</h3>
              <button onClick={() => setActiveModal(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={16} /></button>
            </div>

            {activeModal === 'news' ? (
              <form onSubmit={handleNewsSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input type="text" required placeholder="Report Title" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "6px", padding: "8px", color: "#ffffff", fontSize: "12px" }} />
                <textarea required rows={3} placeholder="Report Content" value={newsContent} onChange={(e) => setNewsContent(e.target.value)} style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "6px", padding: "8px", color: "#ffffff", fontSize: "12px" }} />
                <button type="submit" disabled={submitting} style={{ padding: "8px", backgroundColor: "#f59e0b", border: "none", borderRadius: "6px", color: "#020617", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}>{submitting ? 'Submitting...' : 'Submit Draft'}</button>
              </form>
            ) : (
              <form onSubmit={handleGallerySubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input type="text" required placeholder="Asset Caption" value={mediaCaption} onChange={(e) => setMediaCaption(e.target.value)} style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "6px", padding: "8px", color: "#ffffff", fontSize: "12px" }} />
                <input type="file" required accept="image/*,video/*" onChange={(e) => setMediaFile(e.target.files ? e.target.files[0] : null)} style={{ width: "100%", color: "#cbd5e1", fontSize: "11px" }} />
                <button type="submit" disabled={submitting} style={{ padding: "8px", backgroundColor: "#f59e0b", border: "none", borderRadius: "6px", color: "#020617", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}>{submitting ? 'Uploading...' : 'Upload Asset'}</button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}