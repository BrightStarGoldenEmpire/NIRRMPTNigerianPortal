"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  Search,
  BookOpen,
  Calendar,
} from "lucide-react";

interface RepositoryDocument {
  id: string;
  code: string;
  title: string;
  category: "Policy & Frameworks" | "EIA Guidelines" | "Research Publications" | "Annual Reports" | "Gazettes";
  fileSize: string;
  fileType: "PDF" | "DOCX";
  publishedDate: string;
  department: string;
  description: string;
}

const DOCUMENTS: RepositoryDocument[] = [
  {
    id: "doc-01",
    code: "NIR-POL-2026-01",
    title: "National Regenerative Resource Governance & Ecosystem Protection Policy",
    category: "Policy & Frameworks",
    fileSize: "4.8 MB",
    fileType: "PDF",
    publishedDate: "October 14, 2026",
    department: "Directorate of Policy & Planning",
    description: "Statutory framework governing public and private resource exploitation, biodiversity offset metrics, and ecological remediation standards.",
  },
  {
    id: "doc-02",
    code: "NIR-EIA-GD-2026",
    title: "Environmental Impact Assessment (EIA) Technical Procedural Guidelines",
    category: "EIA Guidelines",
    fileSize: "6.2 MB",
    fileType: "PDF",
    publishedDate: "September 28, 2026",
    department: "Environmental Compliance & Permitting",
    description: "Standard statutory guidelines for field verification, baseline soil/aquifer testing, and socio-ecological impact mitigation filings.",
  },
  {
    id: "doc-03",
    code: "NIR-RSH-2026-09",
    title: "Coastal Mangrove Soil Bio-Remediation Telemetry Report (Sector 4)",
    category: "Research Publications",
    fileSize: "8.1 MB",
    fileType: "PDF",
    publishedDate: "August 19, 2026",
    department: "GIS & Remote Sensing Division",
    description: "Multi-year empirical field study analyzing root survival indices and salinity normalization across restored mangrove estuaries.",
  },
  {
    id: "doc-04",
    code: "NIR-REP-2025-AR",
    title: "NIRRMPT Annual Environmental Telemetry & Audit Dossier (2025)",
    category: "Annual Reports",
    fileSize: "12.4 MB",
    fileType: "PDF",
    publishedDate: "January 15, 2026",
    department: "Office of the Lead Architect",
    description: "Consolidated national progress telemetry across 36 states, including watershed security metrics, soil degradation maps, and statutory intervention logs.",
  },
  {
    id: "doc-05",
    code: "NIR-GAZ-2026-FED",
    title: "Statutory Gazette: Protected Wetland Sanctuaries Designation Act",
    category: "Gazettes",
    fileSize: "2.6 MB",
    fileType: "PDF",
    publishedDate: "March 04, 2026",
    department: "Legal Affairs & FOI Desk",
    description: "Federal Republic of Nigeria legal notice officially designating critical river basins and aquifer zones as protected natural assets.",
  },
];

export default function RepositoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "All",
    "Policy & Frameworks",
    "EIA Guidelines",
    "Research Publications",
    "Annual Reports",
    "Gazettes",
  ];

  const filteredDocs = DOCUMENTS.filter((doc) => {
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-[#004d2c] text-xs font-bold tracking-wider uppercase">
            <BookOpen size={16} />
            <span>Official Digital Archive</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            NIRRMPT Document & Research Repository
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Statutory environmental frameworks, technical field guidelines, scientific research whitepapers, and official federal gazettes available for public download.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, code, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#004d2c]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#004d2c] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-slate-50/80 transition-colors">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-[#004d2c] border border-emerald-200">
                    {doc.code}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                    {doc.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar size={12} />
                    {doc.publishedDate}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
                  {doc.description}
                </p>

                <div className="text-xs text-slate-400">
                  Authority: <span className="font-semibold text-slate-700">{doc.department}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
                  {doc.fileType} • {doc.fileSize}
                </span>
                <button
                  onClick={() => alert(`Initiating direct download for: ${doc.title}`)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#004d2c] hover:bg-[#003820] text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  <Download size={14} />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div className="py-16 text-center text-slate-400 text-sm">
              No official documents match your search filter.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}