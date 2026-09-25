import React from 'react';

export default function TopGovernmentBar() {
  return (
    <div className="w-full bg-slate-950 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-2 text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <div className="flex items-center space-x-2">
          <span className="bg-emerald-800 text-white font-bold px-2 py-0.5 rounded text-[10px] sm:text-xs">
            NG
          </span>
          <span className="font-medium text-slate-300 text-center sm:text-left">
            Federal Republic of Nigeria • Official Institutional Portal
          </span>
        </div>
        <div className="flex items-center space-x-4 text-slate-400 text-xs">
          <span className="hidden md:inline">Identity Protection Secured</span>
          <span className="text-emerald-500 font-semibold">SSO Tier-1 Active</span>
        </div>
      </div>
    </div>
  );
}