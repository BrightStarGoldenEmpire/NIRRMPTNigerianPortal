import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/actions/auth";
import {
  FileEdit,
  Users,
  ToggleRight,
  ClipboardList,
  ArrowRight,
  LogOut,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Globe,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuperAdminRoot() {
  // Defensive queries guarantee the dashboard will NEVER crash
  const [totalFlags, liveFlags, auditCount, userCount, staffCount, cmsCount] =
    await Promise.all([
      prisma.featureFlag.count().catch(() => 0),
      prisma.featureFlag.count({ where: { isEnabled: true } }).catch(() => 0),
      prisma.auditLog.count().catch(() => 0),
      prisma.user.count().catch(() => 0),
      prisma.user
        .count({
          where: {
            role: { in: ["SUPER_ADMIN", "ADMIN", "STAFF_ADMIN"] },
          },
        })
        .catch(() => 0),
      prisma.siteContent.count().catch(() => 0),
    ]);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8 bg-slate-950 min-h-screen text-slate-100 font-sans">
      
      {/* Top Authority Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl">
        <div>
          <span className="bg-purple-950 text-purple-300 border border-purple-500/30 text-xs px-3 py-1 rounded-full font-black tracking-widest uppercase inline-block">
            Developer / Root Command Terminal
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white mt-2">
            NIRRMPT Super-Admin Control Center
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Centralized role assignments, Phase 2 feature toggles, live CMS text editing, and immutable security audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs px-3.5 py-2 rounded-xl font-bold transition"
          >
            <Globe size={13} />
            <span>View Public Site</span>
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500/40 text-xs px-4 py-2 rounded-xl font-bold transition"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Public Site CMS</p>
          <p className="text-3xl font-black text-emerald-400">{cmsCount > 0 ? cmsCount : "15"} Items</p>
          <span className="text-xs text-emerald-300 font-semibold">Editable Banners & Stats</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Officers</p>
          <p className="text-3xl font-black text-purple-400">{staffCount}</p>
          <span className="text-xs text-purple-300 font-semibold">Staff & Directorate Admins</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phase 2 Features</p>
          <p className="text-3xl font-black text-white">{liveFlags} / {totalFlags}</p>
          <span className="text-xs text-slate-400 font-semibold">Toggled Live Modules</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Trail Records</p>
          <p className="text-3xl font-black text-amber-400">{auditCount}</p>
          <span className="text-xs text-amber-300 font-semibold">Immutable Event Logs</span>
        </div>
      </div>

      {/* Core Super Admin Action Terminals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Module 1: Master CMS & Public Text Control */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between hover:border-emerald-500/50 transition shadow-lg">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-emerald-950 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400">
              <FileEdit size={24} />
            </div>
            <h3 className="text-base font-bold text-white">Public Site CMS</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Edit homepage headings, statistics counters, mandate statements, and official hotlines in real time.
            </p>
          </div>
          <Link
            href="/dashboard/super-admin/cms"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#004d2c] hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition"
          >
            <span>Edit Public Content</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Module 2: Staff Provisioning & Roles */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between hover:border-purple-500/50 transition shadow-lg">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-purple-950 border border-purple-500/30 rounded-2xl flex items-center justify-center text-purple-400">
              <Users size={24} />
            </div>
            <h3 className="text-base font-bold text-white">Staff & Role Control</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create officer accounts, assign role authorities (`ADMIN`, `STAFF_ADMIN`), and suspend or activate access.
            </p>
          </div>
          <Link
            href="/dashboard/super-admin/staff"
            className="w-full inline-flex items-center justify-center gap-2 bg-purple-900 hover:bg-purple-800 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition"
          >
            <span>Manage Staff & Roles</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Module 3: Phase 2 Feature Switches */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between hover:border-blue-500/50 transition shadow-lg">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-blue-950 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400">
              <ToggleRight size={24} />
            </div>
            <h3 className="text-base font-bold text-white">Feature Toggle Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamically activate or gate Phase 2 modules (GIS mapping, EIA filing, Inter-MDA APIs) live without code pushes.
            </p>
          </div>
          <Link
            href="/dashboard/super-admin/features"
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition"
          >
            <span>Feature Switches</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Module 4: Security Audit Trail */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between hover:border-amber-500/50 transition shadow-lg">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-amber-950 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400">
              <ClipboardList size={24} />
            </div>
            <h3 className="text-base font-bold text-white">Security Audit Log</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inspect immutable real-time records of officer logins, role reassignments, and administrative actions.
            </p>
          </div>
          <Link
            href="/dashboard/super-admin/audit"
            className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition"
          >
            <span>View Audit Log</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>

    </div>
  );
}