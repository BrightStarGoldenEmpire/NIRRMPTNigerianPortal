"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SuperAdminDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(data || { email: session.user.email, role: 'super_admin' });
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center space-x-3 text-slate-300 text-xs py-10">
        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span>Loading Executive Telemetry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Panel */}
      <div className="p-6 bg-slate-900/90 border border-emerald-500/40 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Tier-1 Authority • DG & System Core
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white">
          Super Admin Governance Command
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Authenticated Officer: <span className="text-slate-200 font-semibold">{profile?.email}</span>
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'System Uptime', val: '99.99%', note: 'Zero active outages', accent: 'border-emerald-500/30' },
          { label: 'Active User Sessions', val: '1,420', note: 'Across all directorates', accent: 'border-blue-500/30' },
          { label: 'Security Telemetry', val: '0 Threats', note: 'Firewall & Auth Guard OK', accent: 'border-amber-500/30' },
          { label: 'Database Utilization', val: '12.4 GB', note: '45% allocated storage', accent: 'border-purple-500/30' },
        ].map((card, idx) => (
          <div key={idx} className={`p-5 bg-slate-900/80 border ${card.accent} rounded-2xl space-y-1 shadow-md`}>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{card.label}</span>
            <div className="text-xl sm:text-2xl font-black text-white">{card.val}</div>
            <span className="text-[11px] text-emerald-400 font-medium block">{card.note}</span>
          </div>
        ))}
      </div>

      {/* Management Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
            Role Access Control & Provisioning
          </h2>
          <p className="text-xs text-slate-400">Manage institutional staff tiers, demote/promote operational accounts, and reset security tokens.</p>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-400 font-mono">
            RBAC Status: <span className="text-emerald-400">Enforced via Supabase RLS Policy</span>
          </div>
        </div>

        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
            System Infrastructure Logs
          </h2>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-950 rounded-lg text-slate-300 border border-slate-800/60 flex justify-between">
              <span>[AUTH] Session renewed for DG Officer</span>
              <span className="text-slate-500">Just now</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg text-slate-300 border border-slate-800/60 flex justify-between">
              <span>[DB] Automated snapshot completed</span>
              <span className="text-slate-500">12m ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}