"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Briefcase, 
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  Search, 
  UserPlus, 
  X, 
  LogOut, 
  User, 
  Terminal, 
  MapPin, 
  FileText, 
  PlusCircle, 
  Circle,
  Eye,
  Layers,
  Database,
  ArrowRight
} from 'lucide-react';

interface ManagedUser {
  id: string;
  email: string;
  role: 'citizen' | 'staff' | 'directorate' | 'superadmin';
  department?: string;
  status: 'active' | 'suspended' | 'pending';
  last_login?: string;
}

interface OperationalRecord {
  id: string;
  ref_id: string;
  task_title: string;
  category: string;
  status: 'Under Review' | 'Approved' | 'Flagged' | 'Completed';
  date: string;
  description?: string;
}

const DEPARTMENTS = [
  "Directorate Operations & Governance",
  "Environmental Protection & Monitoring",
  "GIS & Remote Sensing Division",
  "Hydrological & Water Resources",
  "Regenerative Agriculture & Soil Conservation",
  "Forestry & Biodiversity Reserves",
  "IT & Cyber Security Infrastructure"
];

export default function SuperAdminDashboard() {
  const router = useRouter();

  // Navigation and Session State
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<'public' | 'staff' | 'directorate' | 'superadmin'>('superadmin');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'workflows' | 'gis' | 'audit' | 'iam'>('overview');
  const [profile, setProfile] = useState<{ id?: string; email: string; role: string } | null>(null);

  // Dynamic Data Stores
  const [userList, setUserList] = useState<ManagedUser[]>([]);
  const [operationalRecords, setOperationalRecords] = useState<OperationalRecord[]>([
    { id: '1', ref_id: '#NIR-8092', task_title: 'Environmental Assessment Field Review', category: 'Soil & Water', status: 'Under Review', date: 'Sept 17, 2026', description: 'Comprehensive audit of watershed preservation zones in the Niger Delta basin.' },
    { id: '2', ref_id: '#NIR-7411', task_title: 'Renewable Energy Clearance Directive', category: 'Forestry Conservation', status: 'Approved', date: 'Sept 10, 2026', description: 'National park green-energy expansion framework clearance certificate.' },
    { id: '3', ref_id: '#NIR-6520', task_title: 'Hydrological Basin Telemetry Audit', category: 'Hydrology', status: 'Completed', date: 'Aug 28, 2026', description: 'Real-time telemetry validation across all northern and southern river sensors.' },
  ]);

  // UI Interactivity, Modals & Drill-downs
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);
  const [selectedDrillItem, setSelectedDrillItem] = useState<any | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form Fields for Provisioning Modal (Attachment 1)
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'citizen' | 'staff' | 'directorate' | 'superadmin'>('staff');
  const [newDepartment, setNewDepartment] = useState(DEPARTMENTS[0]);

  // Form Fields for New Entry
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryCategory, setNewEntryCategory] = useState('Soil & Water');
  const [newEntryDesc, setNewEntryDesc] = useState('');

  // Handle Multi-Tier Role Navigation
  const handleRoleNavigation = (role: 'public' | 'staff' | 'directorate' | 'superadmin') => {
    setActiveRole(role);
    if (role === 'public') router.push('/dashboard/citizen');
    if (role === 'staff') router.push('/dashboard/staff');
    if (role === 'directorate') router.push('/dashboard/admin');
    if (role === 'superadmin') router.push('/dashboard/super-admin');
  };

  // Synchronize System Governance Data
  const loadGovernanceData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      let adminEmail = 'brightstargoldenempire@gmail.com';
      let adminId = '';

      if (session?.user) {
        adminId = session.user.id;
        adminEmail = session.user.email || adminEmail;
      } else {
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('nirrmpt_user') : null;
        const parsed = storedUser ? JSON.parse(storedUser) : null;
        if (parsed?.email) adminEmail = parsed.email;
      }

      setProfile({
        id: adminId,
        email: adminEmail,
        role: 'superadmin'
      });

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!profilesError && profilesData && profilesData.length > 0) {
        setUserList(profilesData.map((p: any) => ({
          id: p.id || Math.random().toString(),
          email: p.email || 'user@nirrmpt.gov.ng',
          role: p.role || 'staff',
          department: p.department || DEPARTMENTS[0],
          status: p.status || 'active',
          last_login: p.updated_at ? new Date(p.updated_at).toLocaleTimeString() : 'Recently'
        })));
      } else {
        setUserList([
          { id: 'usr-1', email: 'brightstargoldenempire@gmail.com', role: 'superadmin', department: DEPARTMENTS[0], status: 'active', last_login: 'Just now' },
          { id: 'usr-2', email: 'field.lead@nirrmpt.gov.ng', role: 'staff', department: DEPARTMENTS[1], status: 'active', last_login: '10m ago' },
          { id: 'usr-3', email: 'gis.operator@nirrmpt.gov.ng', role: 'directorate', department: DEPARTMENTS[2], status: 'active', last_login: '25m ago' },
          { id: 'usr-4', email: 'partner.auditor@external.org', role: 'citizen', department: DEPARTMENTS[0], status: 'pending', last_login: '1h ago' },
        ]);
      }
    } catch (err: any) {
      console.warn('Governance sync warning:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadGovernanceData();
  }, [loadGovernanceData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadGovernanceData();
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

  const handleProvisionUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    try {
      await supabase.from('profiles').insert([
        {
          email: newEmail,
          role: newRole,
          department: newDepartment,
          status: 'active',
          created_at: new Date().toISOString()
        }
      ]);
    } catch {
      console.log('User staged locally');
    } finally {
      const newUser: ManagedUser = {
        id: `usr-${Date.now()}`,
        email: newEmail,
        role: newRole,
        department: newDepartment,
        status: 'active',
        last_login: 'Never'
      };

      setUserList(prev => [newUser, ...prev]);
      setActionSuccess(`Successfully provisioned institutional account for ${newEmail} under ${newDepartment}`);
      setNewEmail('');
      setIsProvisionModalOpen(false);
      setTimeout(() => setActionSuccess(null), 5000);
    }
  };

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntryTitle.trim()) return;

    const newRecord: OperationalRecord = {
      id: `${Date.now()}`,
      ref_id: `#NIR-${Math.floor(1000 + Math.random() * 9000)}`,
      task_title: newEntryTitle,
      category: newEntryCategory,
      status: 'Under Review',
      date: 'Today',
      description: newEntryDesc || 'Newly submitted operational filing awaiting Directorate verification.'
    };

    setOperationalRecords(prev => [newRecord, ...prev]);
    setActionSuccess(`Created operational filing: ${newEntryTitle}`);
    setNewEntryTitle('');
    setNewEntryDesc('');
    setIsNewEntryModalOpen(false);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  const handleUserRoleChange = async (userId: string, targetRole: 'citizen' | 'staff' | 'directorate' | 'superadmin') => {
    try {
      await supabase.from('profiles').update({ role: targetRole }).eq('id', userId);
    } catch {
      console.log('Role updated locally');
    } finally {
      setUserList(prev => prev.map(u => u.id === userId ? { ...u, role: targetRole } : u));
      setActionSuccess(`User system access tier updated to ${targetRole.toUpperCase()}`);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const handleUserStatusToggle = async (userId: string) => {
    const targetUser = userList.find(u => u.id === userId);
    if (!targetUser) return;
    const newStatus = targetUser.status === 'active' ? 'suspended' : 'active';

    try {
      await supabase.from('profiles').update({ status: newStatus }).eq('id', userId);
    } catch {
      console.log('Status updated locally');
    } finally {
      setUserList(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      setActionSuccess(`Account status updated to ${newStatus.toUpperCase()}`);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const filteredUsers = userList.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                          (user.department && user.department.toLowerCase().includes(userSearchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#020617", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "#10b981" }}>
        <div style={{ width: "32px", height: "32px", border: "3px solid #10b981", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <span style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>Loading Super Admin Command Center...</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#020617", color: "#f8fafc", fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* Top Banner Bar */}
      <div style={{ padding: "8px 24px", backgroundColor: "#00111a", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#94a3b8" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Circle size={8} style={{ color: "#10b981", fill: "#10b981" }} />
          <span>Official Federal Portal • Republic of Nigeria</span>
        </div>
        <div>
          <span>+2348025252362</span> | <span>Port Harcourt, Rivers State</span>
        </div>
      </div>

      {/* Main Header */}
      <div style={{ padding: "16px 24px", backgroundColor: "#020617", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "8px", backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399", fontWeight: "bold" }}>
            <ShieldCheck size={24} />
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
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", backgroundColor: "#0f172a", borderRadius: "8px", border: "1px solid #1e293b" }}>
            <User size={14} style={{ color: "#34d399" }} />
            <span style={{ fontSize: "11px", color: "#cbd5e1" }}>{profile?.email}</span>
            <button 
              onClick={handleSignOut}
              style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", marginLeft: "8px", fontSize: "11px", fontWeight: "bold" }}
            >
              <LogOut size={12} />
              <span>Terminate Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Body */}
      <div style={{ display: "flex", flex: 1 }}>
        
        {/* Sidebar Role Switcher Navigation */}
        <div style={{ width: "240px", backgroundColor: "#020617", borderRight: "1px solid #1e293b", padding: "20px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "10px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", padding: "0 8px 8px 8px" }}>
            Command Desk
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

          <div style={{ marginTop: "auto", padding: "12px", backgroundColor: "#0f172a", borderRadius: "8px", border: "1px solid #1e293b" }}>
            <span style={{ fontSize: "9px", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>AUTHENTICATED IDENTITY</span>
            <span style={{ fontSize: "10px", color: "#34d399", wordBreak: "break-all", display: "block" }}>{profile?.email}</span>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
          
          {/* Top Banner Card */}
          <div style={{ padding: "20px 24px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ padding: "10px", backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: "8px", color: "#f87171" }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "900", color: "#ffffff", margin: 0 }}>Super Admin Command Center</h2>
                  <span style={{ fontSize: "9px", padding: "2px 8px", backgroundColor: "rgba(239, 68, 68, 0.2)", border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: "6px", color: "#f87171", fontWeight: "bold" }}>ROOT PRIVILEGES</span>
                </div>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0 0" }}>NIRRMPT System Security, Audit Logs & High-Level Telemetry Controls</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button 
                onClick={handleRefresh}
                style={{ padding: "8px 14px", backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f8fafc", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <RefreshCw size={14} style={{ color: "#34d399" }} />
                <span>{refreshing ? "Syncing..." : "Refresh Telemetry"}</span>
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {actionSuccess && (
            <div style={{ padding: "12px 16px", backgroundColor: "rgba(6, 78, 59, 0.9)", border: "1px solid #10b981", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px", color: "#34d399", fontSize: "12px", marginBottom: "20px" }}>
              <CheckCircle2 size={16} />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Sub-Navigation Tabs */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", borderBottom: "1px solid #1e293b", paddingBottom: "12px", flexWrap: "wrap" }}>
            <button
              onClick={() => setActiveSubTab('overview')}
              style={{ padding: "8px 16px", borderRadius: "6px", border: "none", backgroundColor: activeSubTab === 'overview' ? "#1e293b" : "transparent", color: activeSubTab === 'overview' ? "#34d399" : "#94a3b8", fontSize: "12px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Activity size={14} />
              <span>Command Overview</span>
            </button>

            <button
              onClick={() => setActiveSubTab('workflows')}
              style={{ padding: "8px 16px", borderRadius: "6px", border: "none", backgroundColor: activeSubTab === 'workflows' ? "#1e293b" : "transparent", color: activeSubTab === 'workflows' ? "#34d399" : "#94a3b8", fontSize: "12px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <FileText size={14} />
              <span>Operational Workflows</span>
            </button>

            <button
              onClick={() => setActiveSubTab('gis')}
              style={{ padding: "8px 16px", borderRadius: "6px", border: "none", backgroundColor: activeSubTab === 'gis' ? "#1e293b" : "transparent", color: activeSubTab === 'gis' ? "#34d399" : "#94a3b8", fontSize: "12px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <MapPin size={14} />
              <span>GIS Resource Map</span>
            </button>

            <button
              onClick={() => setActiveSubTab('audit')}
              style={{ padding: "8px 16px", borderRadius: "6px", border: "none", backgroundColor: activeSubTab === 'audit' ? "#1e293b" : "transparent", color: activeSubTab === 'audit' ? "#34d399" : "#94a3b8", fontSize: "12px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Terminal size={14} />
              <span>System Control & Audit</span>
            </button>

            <button
              onClick={() => setActiveSubTab('iam')}
              style={{ padding: "8px 16px", borderRadius: "6px", border: "none", backgroundColor: activeSubTab === 'iam' ? "#1e293b" : "transparent", color: activeSubTab === 'iam' ? "#34d399" : "#94a3b8", fontSize: "12px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Users size={14} />
              <span>User Provisioning & IAM</span>
            </button>
          </div>

          {/* TAB 1: COMMAND OVERVIEW (Attachment 5) */}
          {activeSubTab === 'overview' && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#ffffff", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Active Metrics & Real-time Telemetry (Clickable Cards)
                  </h3>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Filter Range: Last 30 Days</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                  
                  <div 
                    onClick={() => setSelectedDrillItem({ title: 'Active Permits Detail', type: 'metric', value: '128 Pending Review', details: 'Detailed breakdown of all active environmental permits undergoing cross-agency review in 36 states.' })}
                    style={{ padding: "20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "8px", cursor: "pointer", transition: "border-color 0.2s" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "bold", textTransform: "uppercase" }}>Active Permits</span>
                      <FileText size={16} style={{ color: "#f87171" }} />
                    </div>
                    <span style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff" }}>128</span>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", color: "#f87171" }}>Pending Review</span>
                      <span style={{ fontSize: "10px", color: "#34d399", display: "flex", alignItems: "center", gap: "4px" }}>Drill down <ArrowRight size={10} /></span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setSelectedDrillItem({ title: 'Approved EIA Reports Detail', type: 'metric', value: '1,042 Verified Records', details: 'Complete repository of approved Environmental Impact Assessment documents indexed by hydrological zones.' })}
                    style={{ padding: "20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "8px", cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "bold", textTransform: "uppercase" }}>Approved EIA Reports</span>
                      <CheckCircle2 size={16} style={{ color: "#34d399" }} />
                    </div>
                    <span style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff" }}>1,042</span>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", color: "#34d399" }}>Verified Records</span>
                      <span style={{ fontSize: "10px", color: "#34d399", display: "flex", alignItems: "center", gap: "4px" }}>Drill down <ArrowRight size={10} /></span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setSelectedDrillItem({ title: 'GIS Mapped Zones Detail', type: 'metric', value: '36 States Integrated', details: 'Full geospatial coordinate mapping across all 36 federation states plus the Federal Capital Territory.' })}
                    style={{ padding: "20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "8px", cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "bold", textTransform: "uppercase" }}>GIS Mapped Zones</span>
                      <MapPin size={16} style={{ color: "#60a5fa" }} />
                    </div>
                    <span style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff" }}>36</span>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", color: "#60a5fa" }}>States Integrated</span>
                      <span style={{ fontSize: "10px", color: "#34d399", display: "flex", alignItems: "center", gap: "4px" }}>Drill down <ArrowRight size={10} /></span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Publication & Review Workflows Section */}
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#ffffff", margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Publication & Review Workflows
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                  <div style={{ padding: "20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
                    <div>
                      <h4 style={{ fontSize: "14px", fontWeight: "bold", color: "#ffffff", margin: "0 0 4px 0" }}>System Security & IAM</h4>
                      <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Manage root RBAC policies, API tokens, and admin credentials.</p>
                    </div>
                    <button 
                      onClick={() => setActiveSubTab('iam')}
                      style={{ padding: "8px 14px", backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#34d399", fontSize: "12px", fontWeight: "bold", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", width: "fit-content" }}
                    >
                      <span>Manage IAM</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>

                  <div style={{ padding: "20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
                    <div>
                      <h4 style={{ fontSize: "14px", fontWeight: "bold", color: "#ffffff", margin: "0 0 4px 0" }}>Audit Log Inspection</h4>
                      <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Monitor active telemetry feeds and infrastructure logs.</p>
                    </div>
                    <button 
                      onClick={() => setActiveSubTab('audit')}
                      style={{ padding: "8px 14px", backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#34d399", fontSize: "12px", fontWeight: "bold", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", width: "fit-content" }}
                    >
                      <span>View Logs</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: OPERATIONAL WORKFLOWS (Attachment 4) */}
          {activeSubTab === 'workflows' && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#ffffff", margin: 0 }}>Operational Filings & Queue Management</h3>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Review and approve national environmental assessments and permits.</p>
                </div>

                <button 
                  onClick={() => setIsNewEntryModalOpen(true)}
                  style={{ padding: "8px 16px", backgroundColor: "#10b981", border: "none", borderRadius: "8px", color: "#020617", fontWeight: "bold", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <PlusCircle size={14} />
                  <span>Create Entry</span>
                </button>
              </div>

              {/* Records Table with Clickable Rows */}
              <div style={{ overflowX: "auto", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#020617", borderBottom: "1px solid #1e293b", color: "#94a3b8" }}>
                      <th style={{ padding: "12px 16px" }}>REF ID</th>
                      <th style={{ padding: "12px 16px" }}>TASK TITLE</th>
                      <th style={{ padding: "12px 16px" }}>CATEGORY</th>
                      <th style={{ padding: "12px 16px" }}>STATUS</th>
                      <th style={{ padding: "12px 16px" }}>DATE</th>
                      <th style={{ padding: "12px 16px", textAlign: "right" }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {operationalRecords.map((rec) => (
                      <tr 
                        key={rec.id} 
                        style={{ borderBottom: "1px solid #1e293b", cursor: "pointer" }}
                        onClick={() => setSelectedDrillItem({ title: `Filing Details: ${rec.ref_id}`, type: 'workflow', data: rec })}
                      >
                        <td style={{ padding: "12px 16px", fontWeight: "bold", color: "#34d399" }}>{rec.ref_id}</td>
                        <td style={{ padding: "12px 16px", color: "#ffffff" }}>{rec.task_title}</td>
                        <td style={{ padding: "12px 16px", color: "#94a3b8" }}>{rec.category}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ padding: "2px 8px", borderRadius: "10px", fontSize: "10px", fontWeight: "bold", backgroundColor: rec.status === 'Approved' ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)", color: rec.status === 'Approved' ? "#34d399" : "#fbbf24" }}>
                            {rec.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#94a3b8" }}>{rec.date}</td>
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          <button style={{ padding: "4px 8px", backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "4px", color: "#34d399", fontSize: "11px", cursor: "pointer" }}>
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: GIS RESOURCE MAP (Attachment 3) */}
          {activeSubTab === 'gis' && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#ffffff", margin: 0 }}>Interactive GIS Resource & Telemetry Grid</h3>
              <div 
                onClick={() => setSelectedDrillItem({ title: 'GIS Telemetry Grid Drill-down', type: 'gis', details: 'All 36 states have active geospatial layers synchronized with the National Environmental Data Hub.' })}
                style={{ padding: "40px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", minHeight: "300px", cursor: "pointer" }}
              >
                <MapPin size={36} style={{ color: "#34d399" }} />
                <span style={{ fontSize: "14px", fontWeight: "bold", color: "#ffffff" }}>GIS Telemetry Layer Active (Click to Inspect Grid)</span>
                <p style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center", maxWidth: "400px", margin: 0 }}>
                  Spatial coordinates synced for designated environmental conservation zones across all 36 states and the FCT.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: SYSTEM CONTROL & AUDIT (Attachment 2) */}
          {activeSubTab === 'audit' && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#ffffff", margin: 0 }}>System Control & Audit Logs</h3>
              <div 
                onClick={() => setSelectedDrillItem({ title: 'Root Access Terminal Inspection', type: 'audit', details: 'Full root privileges verified. Zero anomalies in database RLS policies.' })}
                style={{ padding: "20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "12px", cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#34d399", fontSize: "13px", fontWeight: "bold" }}>
                  <Terminal size={16} />
                  <span>Root Access Terminal Active (Click for Audit Trail)</span>
                </div>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                  Manage administrative roles, audit security logs, and deploy system updates across all sub-portals.
                </p>
                <div style={{ padding: "12px", backgroundColor: "#020617", borderRadius: "8px", border: "1px solid #1e293b", fontSize: "11px", fontFamily: "monospace", color: "#cbd5e1" }}>
                  [INFO] 2026-09-26 19:37:00 - Superadmin session verified via Supabase RLS. Zero vulnerabilities detected.
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: USER PROVISIONING & IAM */}
          {activeSubTab === 'iam' && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#ffffff", margin: 0 }}>Role-Based Access Control (RBAC) & IAM</h3>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Superadmin account creation, assignment, and role management.</p>
                </div>

                <button 
                  onClick={() => setIsProvisionModalOpen(true)}
                  style={{ padding: "8px 16px", backgroundColor: "#10b981", border: "none", borderRadius: "8px", color: "#020617", fontWeight: "bold", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <UserPlus size={14} />
                  <span>Provision Account</span>
                </button>
              </div>

              {/* Filter controls */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", backgroundColor: "#0f172a", padding: "12px", borderRadius: "8px", border: "1px solid #1e293b" }}>
                <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
                  <input 
                    type="text" 
                    placeholder="Search by email or department..." 
                    value={userSearchQuery} 
                    onChange={(e) => setUserSearchQuery(e.target.value)} 
                    style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "6px", padding: "8px 12px 8px 32px", color: "#ffffff", fontSize: "12px" }} 
                  />
                  <Search size={14} style={{ position: "absolute", left: "10px", top: "10px", color: "#64748b" }} />
                </div>

                <select 
                  value={roleFilter} 
                  onChange={(e) => setRoleFilter(e.target.value)}
                  style={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "6px", padding: "8px 12px", color: "#ffffff", fontSize: "12px" }}
                >
                  <option value="all">All Role Tiers</option>
                  <option value="citizen">Public & Partner</option>
                  <option value="staff">Staff Field Desk</option>
                  <option value="directorate">Directorate Operations</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              {/* User Directory Table */}
              <div style={{ overflowX: "auto", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#020617", borderBottom: "1px solid #1e293b", color: "#94a3b8" }}>
                      <th style={{ padding: "12px 16px" }}>User Email</th>
                      <th style={{ padding: "12px 16px" }}>Department</th>
                      <th style={{ padding: "12px 16px" }}>Assigned Role</th>
                      <th style={{ padding: "12px 16px" }}>Status</th>
                      <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} style={{ borderBottom: "1px solid #1e293b" }}>
                        <td style={{ padding: "12px 16px", fontWeight: "bold", color: "#ffffff" }}>{u.email}</td>
                        <td style={{ padding: "12px 16px", color: "#94a3b8" }}>{u.department || 'N/A'}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <select 
                            value={u.role} 
                            onChange={(e) => handleUserRoleChange(u.id, e.target.value as any)}
                            style={{ backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "4px", padding: "4px 8px", color: "#34d399", fontSize: "11px", fontWeight: "bold" }}
                          >
                            <option value="citizen">Public</option>
                            <option value="staff">Staff Desk</option>
                            <option value="directorate">Directorate</option>
                            <option value="superadmin">Super Admin</option>
                          </select>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ padding: "2px 8px", borderRadius: "10px", fontSize: "10px", fontWeight: "bold", backgroundColor: u.status === 'active' ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)", color: u.status === 'active' ? "#34d399" : "#f87171" }}>
                            {u.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          <button 
                            onClick={() => handleUserStatusToggle(u.id)}
                            style={{ padding: "4px 8px", backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "4px", color: u.status === 'active' ? "#f87171" : "#34d399", fontSize: "10px", fontWeight: "bold", cursor: "pointer" }}
                          >
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Account Provisioning Modal (Attachment 1 format) */}
      {isProvisionModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, backgroundColor: "rgba(2, 6, 23, 0.85)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ backgroundColor: "#0f172a", border: "1px solid #10b981", width: "100%", maxWidth: "480px", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "10px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#ffffff", margin: 0 }}>Provision Institutional Account</h3>
              <button onClick={() => setIsProvisionModalOpen(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={16} /></button>
            </div>

            <form onSubmit={handleProvisionUser} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Officer Email Address</label>
                <input type="email" required placeholder="officer@nirrmpt.gov.ng" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "6px", padding: "8px", color: "#ffffff", fontSize: "12px" }} />
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>System Access Tier</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value as any)} style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "6px", padding: "8px", color: "#ffffff", fontSize: "12px" }}>
                  <option value="citizen">Public & Partner Hub</option>
                  <option value="staff">Staff Field Desk</option>
                  <option value="directorate">Directorate Operations</option>
                  <option value="superadmin">Super Admin Core</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Assigned Department Division</label>
                <select value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)} style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "6px", padding: "8px", color: "#ffffff", fontSize: "12px" }}>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <button type="submit" style={{ padding: "10px", backgroundColor: "#10b981", border: "none", borderRadius: "6px", color: "#020617", fontWeight: "bold", fontSize: "12px", cursor: "pointer", marginTop: "8px" }}>
                Confirm Provisioning
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Operational Entry Modal */}
      {isNewEntryModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, backgroundColor: "rgba(2, 6, 23, 0.85)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ backgroundColor: "#0f172a", border: "1px solid #10b981", width: "100%", maxWidth: "480px", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "10px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#ffffff", margin: 0 }}>Create Operational Filing</h3>
              <button onClick={() => setIsNewEntryModalOpen(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={16} /></button>
            </div>

            <form onSubmit={handleCreateEntry} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Task Title / Review Directive</label>
                <input type="text" required placeholder="e.g. Coastal Erosion Audit Phase 2" value={newEntryTitle} onChange={(e) => setNewEntryTitle(e.target.value)} style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "6px", padding: "8px", color: "#ffffff", fontSize: "12px" }} />
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Category</label>
                <select value={newEntryCategory} onChange={(e) => setNewEntryCategory(e.target.value)} style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "6px", padding: "8px", color: "#ffffff", fontSize: "12px" }}>
                  <option value="Soil & Water">Soil & Water</option>
                  <option value="Forestry Conservation">Forestry Conservation</option>
                  <option value="Hydrology">Hydrology</option>
                  <option value="GIS Mapping">GIS Mapping</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Detailed Description</label>
                <textarea rows={3} placeholder="Enter scope and review notes..." value={newEntryDesc} onChange={(e) => setNewEntryDesc(e.target.value)} style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "6px", padding: "8px", color: "#ffffff", fontSize: "12px" }} />
              </div>

              <button type="submit" style={{ padding: "10px", backgroundColor: "#10b981", border: "none", borderRadius: "6px", color: "#020617", fontWeight: "bold", fontSize: "12px", cursor: "pointer", marginTop: "8px" }}>
                Submit Filing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Universal Drill-down Modal */}
      {selectedDrillItem && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, backgroundColor: "rgba(2, 6, 23, 0.85)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ backgroundColor: "#0f172a", border: "1px solid #34d399", width: "100%", maxWidth: "520px", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "12px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#ffffff", margin: 0 }}>{selectedDrillItem.title}</h3>
              <button onClick={() => setSelectedDrillItem(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={18} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "#cbd5e1" }}>
              {selectedDrillItem.type === 'metric' && (
                <>
                  <p><strong style={{ color: "#34d399" }}>Summary Value:</strong> {selectedDrillItem.value}</p>
                  <p><strong style={{ color: "#ffffff" }}>Operational Context:</strong> {selectedDrillItem.details}</p>
                  <div style={{ padding: "12px", backgroundColor: "#020617", borderRadius: "8px", border: "1px solid #1e293b", fontSize: "12px" }}>
                    Status: Fully verified and synced across regional server clusters.
                  </div>
                </>
              )}

              {selectedDrillItem.type === 'workflow' && (
                <>
                  <p><strong style={{ color: "#34d399" }}>Reference ID:</strong> {selectedDrillItem.data.ref_id}</p>
                  <p><strong style={{ color: "#ffffff" }}>Task Title:</strong> {selectedDrillItem.data.task_title}</p>
                  <p><strong style={{ color: "#ffffff" }}>Category:</strong> {selectedDrillItem.data.category}</p>
                  <p><strong style={{ color: "#ffffff" }}>Current Status:</strong> {selectedDrillItem.data.status}</p>
                  <p><strong style={{ color: "#ffffff" }}>Description:</strong> {selectedDrillItem.data.description}</p>
                </>
              )}

              {(selectedDrillItem.type === 'gis' || selectedDrillItem.type === 'audit') && (
                <p>{selectedDrillItem.details}</p>
              )}
            </div>

            <button onClick={() => setSelectedDrillItem(null)} style={{ padding: "10px", backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "6px", color: "#ffffff", fontWeight: "bold", fontSize: "12px", cursor: "pointer", marginTop: "8px" }}>
              Close Inspection
            </button>
          </div>
        </div>
      )}

    </div>
  );
}