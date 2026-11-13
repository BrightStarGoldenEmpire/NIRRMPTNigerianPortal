import React, { ReactNode } from "react";
import { isFeatureEnabled } from "@/lib/feature-flags";

interface FeatureGateProps {
  flagKey: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export default async function FeatureGate({
  flagKey,
  children,
  fallback = null,
}: FeatureGateProps) {
  const enabled = await isFeatureEnabled(flagKey);

  if (!enabled) {
    return (
      fallback || (
        <div className="border border-amber-200 bg-amber-50/70 p-6 rounded-lg text-slate-700 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <span className="h-3 w-3 rounded-full bg-amber-500 animate-pulse"></span>
            <h4 className="font-semibold text-amber-900 text-sm tracking-wide uppercase">
              Phase 2 Enterprise Module Gated
            </h4>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            This module is reserved for deployment under the NIRRMPT Phase 2 Rollout. It
            is currently locked by system policy and can be authorized via the Super Admin
            Control Center.
          </p>
        </div>
      )
    );
  }

  return <>{children}</>;
}