"use client";

import React from "react";
import { Lock, FileText, Download, ShieldCheck, Building2, CheckCircle2 } from "lucide-react";

export default function StakeholderDocsPage() {
  const docs = [
    {
      title: "Inter-Agency Joint Ecological Defense Matrix (Q4)",
      mda: "Federal Ministry of Environment / NIRRMPT",
      security: "RESTRICTED TO SISTER MDAS",
      size: "4.2 MB",
      date: "Nov 2026",
    },
    {
      title: "Gulf of Guinea Estuary Soil Hydrocarbon Baseline",
      mda: "NOSDRA / NIRRMPT Joint Taskforce",
      security: "INTER-AGENCY SHARED",
      size: "9.8 MB",
      date: "Oct 2026",
    },
    {
      title: "Statutory Groundwater Protection Protocol v2.4",
      mda: "Ministry of Water Resources / NIRRMPT",
      security: "OFFICIAL TECHNICAL CLEARANCE",
      size: "3.5 MB",
      date: "Nov 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase">
            <Lock size={14} />
            <span>Classified Inter-Agency Repository · Audit Item #35</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Stakeholder Document Exchange Locker</h1>
          <p className="text-slate-400 text-sm">Encrypted exchange conduit for registered sister MDAs, accredited researchers, and federal oversight bodies.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 divide-y divide-slate-800 shadow-xl">
          {docs.map((doc, idx) => (
            <div key={idx} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 rounded">
                  {doc.security}
                </span>
                <h3 className="text-base font-bold text-white pt-1">{doc.title}</h3>
                <p className="text-xs text-slate-400">Coordinating Authority: {doc.mda}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-500">{doc.size}</span>
                <button
                  onClick={() => alert(`Accessing encrypted stakeholder document: ${doc.title}`)}
                  className="px-4 py-2 bg-[#004d2c] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition"
                >
                  <Download size={14} />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}