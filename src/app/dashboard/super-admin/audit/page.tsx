import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  ClipboardList,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  Search,
  Filter,
  Clock,
  User,
  Database,
  Calendar,
  Layers,
  Code,
  Activity,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuperAdminAuditPage() {
  // Query live immutable audit events directly from Supabase
  const logs = await prisma.auditLog.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
          role: true,
        },
      },
    },
  });

  const totalLogs = logs.length;
  const authLogs = logs.filter((l) => l.action.includes("AUTH") || l.action.includes("LOGIN")).length;
  const roleLogs = logs.filter((l) => l.action.includes("ROLE") || l.action.includes("STAFF")).length;
  const flagLogs = logs.filter((l) => l.action.includes("FLAG")).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10 font-sans space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <Link
              href="/dashboard/super-admin"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition mb-2"
            >
              <ArrowLeft size={14} /> Back to Super Admin Terminal
            </Link>
            <div className="flex items-center gap-2">
              <span className="bg-amber-950 text-amber-300 border border-amber-500/30 text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider inline-block">
                Statutory Forensic Trail
              </span>
            </div>
            <h1 className="text-3xl font-black text-white mt-1">
              Immutable System Security Audit Log
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Real-time telemetry recording staff provisioning, role reassignments, authentication successes, and Phase 2 feature switches.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/dashboard/super-admin/staff"
              className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition"
            >
              Staff & Role Control
            </Link>
            <Link
              href="/dashboard/super-admin/features"
              className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition"
            >
              Feature Switches
            </Link>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Recorded Events</p>
            <p className="text-3xl font-black text-white">{totalLogs}</p>
            <span className="text-xs text-emerald-400 font-semibold">Live Database Entries</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role & Staff Updates</p>
            <p className="text-3xl font-black text-purple-400">{roleLogs}</p>
            <span className="text-xs text-purple-300 font-semibold">RBAC Authority Changes</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Auth & Login Events</p>
            <p className="text-3xl font-black text-cyan-400">{authLogs}</p>
            <span className="text-xs text-cyan-300 font-semibold">Session Authentications</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Feature Toggle Logs</p>
            <p className="text-3xl font-black text-amber-400">{flagLogs}</p>
            <span className="text-xs text-amber-300 font-semibold">Phase 2 State Changes</span>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ClipboardList size={20} className="text-amber-400" />
                <span>Real-Time Audit Records ({logs.length})</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Statutory audit records cannot be edited or deleted once written to the database.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE TELEMETRY SYNC
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4">Timestamp (UTC)</th>
                  <th className="p-4">Action Trigger</th>
                  <th className="p-4">Target Entity</th>
                  <th className="p-4">Operator / Account</th>
                  <th className="p-4">Event Metadata Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {logs.map((log) => {
                  const isRoleAction = log.action.includes("ROLE") || log.action.includes("STAFF");
                  const isAuthAction = log.action.includes("AUTH") || log.action.includes("LOGIN");
                  const isSuspendAction = log.action.includes("SUSPEND");

                  return (
                    <tr key={log.id} className="hover:bg-slate-950/40 transition">
                      {/* Timestamp */}
                      <td className="p-4 text-slate-400 whitespace-nowrap text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-slate-500" />
                          <span>{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Action Badge */}
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                            isSuspendAction
                              ? "bg-rose-950 text-rose-300 border border-rose-500/30"
                              : isRoleAction
                              ? "bg-purple-950 text-purple-300 border border-purple-500/30"
                              : isAuthAction
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                              : "bg-slate-800 text-slate-300 border border-slate-700"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>

                      {/* Entity */}
                      <td className="p-4 text-slate-300 text-[11px]">
                        <span className="text-white font-bold">{log.entity}</span>
                        {log.entityId && (
                          <span className="block text-[10px] text-slate-500 truncate max-w-[140px]">
                            ID: {log.entityId}
                          </span>
                        )}
                      </td>

                      {/* Operator / User */}
                      <td className="p-4 text-[11px]">
                        {log.user ? (
                          <div>
                            <span className="text-white font-bold block">{log.user.fullName}</span>
                            <span className="text-slate-400 text-[10px]">{log.user.email}</span>
                            <span className="text-[9px] text-amber-400 block font-bold uppercase">{log.user.role}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Automated Engine</span>
                        )}
                      </td>

                      {/* Metadata JSON */}
                      <td className="p-4 text-[11px] max-w-xs">
                        {log.metadata ? (
                          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-[10px] text-emerald-400 overflow-x-auto max-h-24 leading-relaxed">
                            {JSON.stringify(log.metadata, null, 1)}
                          </div>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-sans">
                      No audit events recorded in the database yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}