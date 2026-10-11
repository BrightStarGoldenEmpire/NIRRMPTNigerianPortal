'use client';

import { useState } from 'react';
import { toggleFeatureFlag } from '@/app/actions/cms';

export default function DeveloperEngineDashboard() {
  const [featureFlags, setFeatureFlags] = useState({
    gisMapping: true,
    permitWorkflows: false,
    spatialAnalytics: true,
    publicResearchPortal: true,
  });

  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleToggle = async (key: keyof typeof featureFlags) => {
    const nextState = !featureFlags[key];
    setLoadingKey(key);
    setStatusMessage('');

    // Call server action to update flag and log audit entry
    const res = await toggleFeatureFlag(key, nextState);

    if (res.success) {
      setFeatureFlags((prev) => ({ ...prev, [key]: nextState }));
      setStatusMessage(`Successfully updated '${key}' to ${nextState ? 'ENABLED' : 'DISABLED'}`);
    } else {
      setStatusMessage(`Failed to update '${key}': ${res.error}`);
    }
    setLoadingKey(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 font-sans">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Developer Engine Command Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          NIRRMPT Enterprise System Control & Phase 1 / Phase 2 Flag Engine
        </p>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-medium">
          {statusMessage}
        </div>
      )}

      {/* Health & Engine Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Engine Health
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">Operational</div>
          <p className="text-xs text-slate-500 mt-1">Next.js 16 • Supabase Pooler Active</p>
        </div>

        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Backup Engine Snapshot
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">Prisma JSON</div>
          <p className="text-xs text-slate-500 mt-1">Local Windows Snapshot Engine Live</p>
        </div>

        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Compliance Status
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">NDPR Compliant</div>
          <p className="text-xs text-slate-500 mt-1">Audit Trail & RBAC Gating Enforced</p>
        </div>
      </div>

      {/* Feature Flag Toggle Panel */}
      <section className="p-6 bg-white border rounded-lg shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Phase 1 & Phase 2 Module Flags
          </h2>
          <p className="text-sm text-slate-500">
            Dynamically control enterprise feature availability without downtime.
          </p>
        </div>

        <div className="divide-y border-t border-b">
          {Object.entries(featureFlags).map(([key, enabled]) => (
            <div key={key} className="py-4 flex items-center justify-between">
              <div>
                <span className="font-mono text-sm text-slate-800 font-semibold">{key}</span>
                <p className="text-xs text-slate-500 capitalize">
                  Module Status: {enabled ? 'Active' : 'Gated'}
                </p>
              </div>

              <button
                onClick={() => handleToggle(key as keyof typeof featureFlags)}
                disabled={loadingKey === key}
                className={`px-4 py-2 text-xs font-bold rounded transition-colors ${
                  enabled
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                } disabled:opacity-50`}
              >
                {loadingKey === key
                  ? 'Updating...'
                  : enabled
                  ? 'Disable Module'
                  : 'Enable Module'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}