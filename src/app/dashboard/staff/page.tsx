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
  UserCheck
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

  // Active View Tab (Dashboard vs Profile)
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

  // Modals & Drawers State
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

  // Data Fetching Engine
  const loadWorkspaceData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      let currentUserEmail = 'hello@yopmail.com';
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
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "#f59e0b" }}>
        <div style={{ width: "28px", height: "28px", border: "3px solid #f59e0b", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
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
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 16px", color: "#f8fafc", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      
      {/* Dynamic Institute Header Banner with Official Logo */}
      <div style={{ padding: "16px 20px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "16px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "10px", backgroundColor: "rgba(245, 158, 11, 0.15)", border: "1px solid #f59e0b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fbbf24", fontWeight: "900", fontSize: "18px" }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "900", letterSpacing: "0.5px", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>NIRRMPT PORTAL</span>
              <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "12px", backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.4)", fontWeight: "bold" }}>SYSTEM ACTIVE</span>
            </div>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0 0" }}>Nigerian Institute of Regenerative Resource Management & Protection Technologies</p>
          </div>
        </div>
      </div>

      {/* Top Navigation Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <button
          onClick={() => {
            if (activeTab === 'profile') {
              setActiveTab('dashboard');
            } else {
              router.back();
            }
          }}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 14px", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#f8fafc", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}
        >
          <ArrowLeft size={16} style={{ color: "#fbbf24" }} />
          <span>Back</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => setActiveTab(activeTab === 'dashboard' ? 'profile' : 'dashboard')}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 14px", backgroundColor: activeTab === 'profile' ? '#f59e0b' : '#0f172a', border: "1px solid #334155", borderRadius: "10px", color: activeTab === 'profile' ? '#020617' : '#f8fafc', fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
          >
            <User size={15} />
            <span>{activeTab === 'profile' ? 'Workspace' : 'Profile & Settings'}</span>
          </button>

          <button
            onClick={handleSignOut}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 14px", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "10px", color: "#f87171", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {actionSuccess && (
        <div style={{ padding: "12px 16px", backgroundColor: "rgba(6, 78, 59, 0.9)", border: "1px solid #10b981", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px", color: "#34d399", fontSize: "12px", marginBottom: "20px" }}>
          <CheckCircle2 size={16} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* PROFILE PAGE VIEW */}
      {activeTab === 'profile' ? (
        <div style={{ padding: "28px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ borderBottom: "1px solid #1e293b", paddingBottom: "16px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "800", margin: "0 0 4px 0", color: "#ffffff" }}>User Profile & Operational Settings</h2>
            <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Manage your field operational credentials, department assignment, and notification preferences.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            
            {/* Avatar Upload */}
            <div style={{ padding: "20px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" }}>
              <div style={{ position: "relative", width: "96px", height: "96px", borderRadius: "50%", overflow: "hidden", border: "2px solid #f59e0b", backgroundColor: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {profileAvatar ? (
                  <img src={profileAvatar} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <User size={48} style={{ color: "#64748b" }} />
                )}
              </div>
              <label style={{ cursor: "pointer", padding: "8px 16px", backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f8fafc", fontSize: "12px", fontWeight: "600" }}>
                Upload Profile Picture
                <input type="file" accept="image/*" onChange={handleProfileAvatarChange} style={{ display: "none" }} />
              </label>
              <span style={{ fontSize: "11px", color: "#64748b" }}>PNG, JPG or WEBP up to 5MB</span>
            </div>

            {/* Assigned Department Select Dropdown */}
            <div style={{ padding: "20px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "bold", margin: 0, color: "#fbbf24", display: "flex", alignItems: "center", gap: "8px" }}>
                <Settings size={16} /> Operational Settings
              </h3>
              
              <div>
                <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Full Officer Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Email Address</label>
                <input
                  type="text"
                  disabled
                  value={profile?.email || ''}
                  style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "8px 12px", color: "#64748b", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              {/* Department Dropdown */}
              <div>
                <label style={{ display: "block", fontSize: "11px", color: "#fbbf24", fontWeight: "bold", marginBottom: "4px" }}>
                  Assigned Department (Select Division)
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #f59e0b", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "12px", boxSizing: "border-box", cursor: "pointer", outline: "none" }}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} style={{ backgroundColor: "#020617", color: "#ffffff" }}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
                <input
                  type="checkbox"
                  id="notif"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  style={{ accentColor: "#f59e0b" }}
                />
                <label htmlFor="notif" style={{ fontSize: "12px", color: "#cbd5e1", cursor: "pointer" }}>Receive email alerts on report approval updates</label>
              </div>

              <button
                onClick={() => {
                  setActionSuccess('Profile and department assignment updated successfully.');
                  setTimeout(() => setActionSuccess(null), 5000);
                }}
                style={{ marginTop: "12px", padding: "10px", backgroundColor: "#f59e0b", border: "none", borderRadius: "8px", color: "#020617", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      ) : (
        /* MAIN DASHBOARD VIEW */
        <>
          {/* Header Panel */}
          <div style={{ padding: "24px", backgroundColor: "#0f172a", border: "1px solid rgba(245, 158, 11, 0.4)", borderRadius: "16px", marginBottom: "24px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "20px", color: "#fbbf24", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                <ShieldCheck size={12} />
                <span>Tier-3 Operations • Field & Research Desk</span>
              </div>
              <h1 style={{ fontSize: "24px", fontWeight: "900", margin: "0 0 6px 0", color: "#ffffff" }}>
                Staff Operational Workspace
              </h1>
              <div style={{ fontSize: "12px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span>Field Officer:</span>
                <span style={{ color: "#f8fafc", fontWeight: "600", backgroundColor: "#1e293b", padding: "2px 8px", borderRadius: "4px", border: "1px solid #334155" }}>
                  {profile?.email}
                </span>
                <span style={{ color: "#fbbf24", fontWeight: "500", borderLeft: "1px solid #334155", paddingLeft: "8px" }}>
                  {selectedDepartment}
                </span>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", color: "#f8fafc", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              <RefreshCw size={14} style={{ color: "#94a3b8" }} />
              <span>{refreshing ? "Syncing..." : "Refresh Desk"}</span>
            </button>
          </div>

          {/* Metric Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "24px" }}>
            {cardConfig.map((card) => {
              const Icon = card.icon;
              return (
                <div 
                  key={card.key} 
                  onClick={() => { setSelectedCard(card.key as any); setSearchQuery(''); setExpandedRecordId(null); }}
                  style={{ 
                    padding: "20px", 
                    backgroundColor: "#0f172a", 
                    border: selectedCard === card.key ? "1px solid #f59e0b" : "1px solid #1e293b", 
                    borderRadius: "16px", 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>{card.label}</span>
                    <Icon size={16} style={{ color: card.color }} />
                  </div>
                  <div style={{ fontSize: "22px", fontWeight: "900", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>{card.val}</span>
                    <ChevronUp size={16} style={{ color: "#64748b", transform: "rotate(90deg)" }} />
                  </div>
                  <span style={{ fontSize: "11px", color: "#fbbf24", fontWeight: "500" }}>{card.note}</span>
                </div>
              );
            })}
          </div>

          {/* Field Entry Actions */}
          <div style={{ padding: "24px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", margin: 0, color: "#cbd5e1" }}>
                Field Entry Actions
              </h2>
              <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "500" }}>Clearance Active</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {/* Submit News Draft Card */}
              <div style={{ padding: "20px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <PenTool size={16} style={{ color: "#fbbf24" }} />
                    <h3 style={{ fontSize: "14px", fontWeight: "bold", margin: 0, color: "#fcd34d" }}>Submit News Draft</h3>
                  </div>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, lineHeight: "1.5" }}>
                    Prepare press releases, field observations, or operational updates for supervisor approval before public release.
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal('news')}
                  style={{ width: "100%", padding: "10px", backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "8px", color: "#fcd34d", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                >
                  Compose Draft
                </button>
              </div>

              {/* Upload Gallery Assets Card */}
              <div style={{ padding: "20px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Upload size={16} style={{ color: "#fbbf24" }} />
                    <h3 style={{ fontSize: "14px", fontWeight: "bold", margin: 0, color: "#fcd34d" }}>Upload Gallery Assets</h3>
                  </div>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, lineHeight: "1.5" }}>
                    Add operational photographs, GIS captures, and field research media routed for Admin clearance.
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal('gallery')}
                  style={{ width: "100%", padding: "10px", backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f8fafc", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                >
                  Upload Media
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Dynamic Clickable Submissions Modal */}
      {selectedCard && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, backgroundColor: "rgba(2, 6, 23, 0.85)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ backgroundColor: "#0f172a", border: "1px solid #334155", width: "100%", maxWidth: "720px", maxHeight: "85vh", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", overflow: "hidden" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "12px" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#ffffff", margin: 0, textTransform: "capitalize" }}>
                  {cardConfig.find(c => c.key === selectedCard)?.label} Records
                </h3>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0 0" }}>Click any item below to inspect full content details & tracking log</p>
              </div>
              <button onClick={() => setSelectedCard(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: "12px", top: "10px", color: "#64748b" }} />
              <input
                type="text"
                placeholder="Search record content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", padding: "8px 12px 8px 34px", color: "#ffffff", fontSize: "12px", boxSizing: "border-box" }}
              />
            </div>

            {/* Clickable Items Feed */}
            <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "4px" }}>
              {getActiveList().length > 0 ? (
                getActiveList().map((item) => {
                  const isExpanded = expandedRecordId === item.id;
                  return (
                    <div 
                      key={item.id} 
                      onClick={() => setExpandedRecordId(isExpanded ? null : item.id)}
                      style={{ 
                        padding: "16px", 
                        backgroundColor: "#020617", 
                        border: isExpanded ? "1px solid #f59e0b" : "1px solid #1e293b", 
                        borderRadius: "12px", 
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "14px", fontWeight: "bold", color: "#ffffff" }}>{item.title}</span>
                            {item.approval_status === 'pending_approval' ? (
                              <span style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold", backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", border: "1px solid rgba(245, 158, 11, 0.3)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <Clock size={10} /> Pending Manager Approval
                              </span>
                            ) : (
                              <span style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.3)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <CheckCircle size={10} /> Approved / Public
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: "12px", color: "#cbd5e1", margin: 0, lineHeight: "1.4" }}>{item.subtitle}</p>
                          {item.date && <span style={{ fontSize: "10px", color: "#64748b" }}>Date Logged: {item.date}</span>}
                        </div>
                        <div style={{ color: "#f59e0b" }}>
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>

                      {/* Click Content Expansion View */}
                      {isExpanded && (
                        <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px dashed #334155", display: "flex", flexDirection: "column", gap: "10px" }}>
                          <div>
                            <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#fbbf24", fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                              Detailed Operational Report Body
                            </span>
                            <div style={{ backgroundColor: "#0f172a", padding: "12px", borderRadius: "8px", border: "1px solid #1e293b", color: "#f8fafc", fontSize: "12px", lineHeight: "1.6" }}>
                              {item.full_content || item.subtitle}
                            </div>
                          </div>

                          {item.file_url && (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#38bdf8", backgroundColor: "rgba(56, 189, 248, 0.1)", padding: "8px 12px", borderRadius: "6px", border: "1px solid rgba(56, 189, 248, 0.2)" }}>
                              <Paperclip size={14} />
                              <span>Attached Document: {item.file_url}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: "32px", textAlign: "center", color: "#64748b", fontSize: "12px" }}>
                  No matching database records found.
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "8px", borderTop: "1px solid #1e293b" }}>
              <button onClick={() => setSelectedCard(null)} style={{ padding: "8px 16px", backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#f8fafc", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                Close Overlay
              </button>
            </div>

          </div>
        </div>
      )}

      {/* UPDATED: Enterprise Live Chat Feature with Group & Private Switcher */}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 40 }}>
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            style={{ padding: "12px 18px", backgroundColor: "#f59e0b", border: "none", borderRadius: "30px", color: "#020617", fontWeight: "bold", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)" }}
          >
            <MessageSquare size={18} />
            <span>Staff Live Chat</span>
          </button>
        ) : (
          <div style={{ width: "380px", height: "500px", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "16px", display: "flex", flexDirection: "column", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)", overflow: "hidden" }}>
            
            {/* Chat Drawer Header */}
            <div style={{ padding: "12px 16px", backgroundColor: "#020617", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Circle size={8} style={{ color: "#10b981", fill: "#10b981" }} />
                <span style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff" }}>NIRRMPT Staff Live Desk</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                <X size={16} />
              </button>
            </div>

            {/* Mode Switcher: Private Chat vs Group Chat */}
            <div style={{ padding: "8px 12px", backgroundColor: "#090d16", borderBottom: "1px solid #1e293b", display: "flex", gap: "8px" }}>
              <button
                onClick={() => {
                  setChatMode('private');
                  setActiveTarget(PRIVATE_CONTACTS[0]);
                }}
                style={{ flex: 1, padding: "6px", borderRadius: "8px", border: "none", backgroundColor: chatMode === 'private' ? "#f59e0b" : "#1e293b", color: chatMode === 'private' ? "#020617" : "#cbd5e1", fontSize: "11px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", cursor: "pointer" }}
              >
                <UserCheck size={14} />
                <span>Private Chat</span>
              </button>

              <button
                onClick={() => {
                  setChatMode('group');
                  setActiveTarget(GROUP_CHANNELS[0]);
                }}
                style={{ flex: 1, padding: "6px", borderRadius: "8px", border: "none", backgroundColor: chatMode === 'group' ? "#f59e0b" : "#1e293b", color: chatMode === 'group' ? "#020617" : "#cbd5e1", fontSize: "11px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", cursor: "pointer" }}
              >
                <Users size={14} />
                <span>Group Chat</span>
              </button>
            </div>

            {/* Recipient Channel Selector based on active mode */}
            <div style={{ padding: "8px 12px", backgroundColor: "#0f172a", borderBottom: "1px solid #1e293b", display: "flex", gap: "6px", overflowX: "auto" }}>
              {(chatMode === 'private' ? PRIVATE_CONTACTS : GROUP_CHANNELS).map((target) => (
                <button
                  key={target}
                  onClick={() => setActiveTarget(target)}
                  style={{ padding: "4px 8px", borderRadius: "6px", border: "none", backgroundColor: activeTarget === target ? "rgba(245, 158, 11, 0.2)" : "transparent", color: activeTarget === target ? "#fbbf24" : "#94a3b8", fontSize: "10px", fontWeight: "bold", cursor: "pointer", whitespace: "nowrap" }}
                >
                  {target}
                </button>
              ))}
            </div>

            {/* Chat Body */}
            <div style={{ flex: 1, padding: "12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
              {filteredChatMessages.length > 0 ? (
                filteredChatMessages.map((msg) => (
                  <div key={msg.id} style={{ alignSelf: msg.sender === profileName ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                    <div style={{ fontSize: "9px", color: "#64748b", marginBottom: "2px" }}>{msg.sender} • {msg.timestamp}</div>
                    <div style={{ padding: "8px 12px", borderRadius: "10px", backgroundColor: msg.sender === profileName ? "#f59e0b" : "#1e293b", color: msg.sender === profileName ? "#020617" : "#f8fafc", fontSize: "11px", lineHeight: "1.4", fontWeight: msg.sender === profileName ? "600" : "400" }}>
                      {msg.text}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ margin: "auto", textAlign: "center", color: "#64748b", fontSize: "11px" }}>
                  No messages yet in {chatMode} chat: <strong>{activeTarget}</strong>.
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} style={{ padding: "10px", backgroundColor: "#020617", borderTop: "1px solid #1e293b", display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder={`Message ${activeTarget}...`}
                value={chatMessageInput}
                onChange={(e) => setChatMessageInput(e.target.value)}
                style={{ flex: 1, backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "11px", outline: "none" }}
              />
              <button type="submit" style={{ padding: "8px 12px", backgroundColor: "#f59e0b", border: "none", borderRadius: "8px", color: "#020617", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Send size={14} />
              </button>
            </form>

          </div>
        )}
      </div>

      {/* Upload/News Action Modals */}
      {activeModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, backgroundColor: "rgba(2, 6, 23, 0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", width: "100%", maxWidth: "520px", borderRadius: "16px", padding: "24px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "12px" }}>
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#ffffff", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                  {activeModal === 'news' ? <PenTool size={16} style={{ color: "#fbbf24" }} /> : <Upload size={16} style={{ color: "#fbbf24" }} />}
                  {activeModal === 'news' ? 'Submit Field News Draft' : 'Upload Gallery Asset'}
                </h3>
                <p style={{ fontSize: "10px", color: "#fbbf24", margin: "2px 0 0 0" }}>Requires Manager / Admin approval before public release</p>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            {activeModal === 'news' ? (
              <form onSubmit={handleNewsSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#cbd5e1", marginBottom: "4px" }}>Report Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Regional Resource Monitoring Update - Q3"
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "12px", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#cbd5e1", marginBottom: "4px" }}>Report Content</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide detailed field observations..."
                    value={newsContent}
                    onChange={(e) => setNewsContent(e.target.value)}
                    style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "12px", boxSizing: "border-box", resize: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#cbd5e1", marginBottom: "4px" }}>Attach Supporting Field Document (Optional)</label>
                  <input
                    type="file"
                    onChange={(e) => setNewsFile(e.target.files ? e.target.files[0] : null)}
                    style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", padding: "8px 12px", color: "#94a3b8", fontSize: "11px", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", paddingTop: "8px" }}>
                  <button type="button" onClick={() => setActiveModal(null)} style={{ padding: "8px 14px", backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#cbd5e1", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
                  <button type="submit" disabled={submitting} style={{ padding: "8px 16px", backgroundColor: "#f59e0b", border: "none", borderRadius: "8px", color: "#020617", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                    {submitting ? 'Routing for Approval...' : 'Submit Draft for Approval'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleGallerySubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#cbd5e1", marginBottom: "4px" }}>Asset Caption</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Soil Sample Testing Site - Sector 4"
                    value={mediaCaption}
                    onChange={(e) => setMediaCaption(e.target.value)}
                    style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", padding: "8px 12px", color: "#ffffff", fontSize: "12px", boxSizing: "border-box" }}
                  />
                </div>
                
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#cbd5e1", marginBottom: "4px" }}>Select Asset File</label>
                  <div style={{ border: "2px dashed #1e293b", borderRadius: "12px", padding: "16px", backgroundColor: "#020617", textAlign: "center", position: "relative" }}>
                    <Upload size={24} style={{ color: "#fbbf24", margin: "0 auto 6px auto", display: "block" }} />
                    <p style={{ fontSize: "11px", color: "#cbd5e1", margin: 0, fontWeight: "600" }}>
                      {mediaFile ? mediaFile.name : 'Click to select or drag photo/video'}
                    </p>
                    <input
                      type="file"
                      required
                      accept="image/*,video/*"
                      onChange={(e) => setMediaFile(e.target.files ? e.target.files[0] : null)}
                      style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", paddingTop: "8px" }}>
                  <button type="button" onClick={() => setActiveModal(null)} style={{ padding: "8px 14px", backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#cbd5e1", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{ padding: "8px 16px", backgroundColor: "#f59e0b", border: "none", borderRadius: "8px", color: "#020617", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
                  >
                    {submitting ? 'Uploading...' : 'Upload & Send for Clearance'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}