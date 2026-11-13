"use client";

import React, { useState } from "react";
import {
  FileCheck2,
  ShieldCheck,
  Search,
  Building2,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  BadgeAlert,
  Loader2,
  Download,
} from "lucide-react";

interface PermitCategory {
  id: string;
  code: string;
  title: string;
  statutoryFee: string;
  duration: string;
  description: string;
  prerequisites: string[];
}

const PERMIT_CATEGORIES: PermitCategory[] = [
  {
    id: "prm-01",
    code: "NIR-PRM-ECO",
    title: "Ecological Resource Extraction & Soil Access Permit",
    statutoryFee: "₦150,000",
    duration: "Annual Validity",
    description: "Statutory authorization for commercial sampling, resource harvesting, or industrial earth-moving in designated conservation zones.",
    prerequisites: ["Approved EIA Baseline Report", "CAC Business Registration", "Community Consent Compact"],
  },
  {
    id: "prm-02",
    code: "NIR-PRM-BIO",
    title: "Bio-Remediation Field Operations Clearance Permit",
    statutoryFee: "₦200,000",
    duration: "24-Month Project License",
    description: "Required for oil spill clean-up operators, chemical remediation contractors, and ecological restoration taskforces.",
    prerequisites: ["NOSDRA / Federal Clean-up License", "Bio-Inoculant Lab Test Certificate", "Field Disposal Plan"],
  },
  {
    id: "prm-03",
    code: "NIR-PRM-DIS",
    title: "Industrial Effluent & Watershed Discharge Permit",
    statutoryFee: "₦350,000",
    duration: "Triennial Renewal",
    description: "Authorization governing industrial facilities releasing treated water into coastal or inland river basins.",
    prerequisites: ["Effluent Treatment Plant (ETP) Audit", "Continuous IoT Sensor Installation", "Heavy Metal Profiling"],
  },
  {
    id: "prm-04",
    code: "NIR-PRM-FOR",
    title: "Forestry Reserve & Mangrove Canopy Clearance License",
    statutoryFee: "₦180,000",
    duration: "Seasonal Clearance",
    description: "Legal clearance permitting selective vegetative management, infrastructure right-of-way, or agroforestry access.",
    prerequisites: ["Biodiversity Offsetting Plan", "State Forestry Clearance Letter", "GPS Survey Polygons"],
  },
];

export default function PermitsPortalPage() {
  const [activeTab, setActiveTab] = useState<"apply" | "track" | "guidelines">("apply");
  const [selectedCategory, setSelectedCategory] = useState<PermitCategory>(PERMIT_CATEGORIES[0]);

  // Form State
  const [submitting, setSubmitting] = useState(false);
  const [applicationToken, setApplicationToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    cacNumber: "",
    contactPerson: "",
    email: "",
    phone: "",
    state: "Rivers State",
    lga: "",
    siteCoordinates: "",
    projectScope: "",
  });

  // Tracking State
  const [trackingQuery, setTrackingQuery] = useState("");
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const code = `PRM-NIRRMPT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmitting(false);
      setApplicationToken(code);
    }, 1200);
  };

  const handleTrackPermit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingQuery.trim()) return;

    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setTrackingResult({
        code: trackingQuery.toUpperCase(),
        company: "West African Energy & Ecological Services Ltd",
        type: "Bio-Remediation Field Operations Clearance Permit",
        status: "UNDER_DIRECTORATE_VETTING",
        submissionDate: "October 18, 2026",
        stage: "Stage 3 of 4: Physical Field Inspection Scheduled",
        assignedOfficer: "Engr. K. Chinedu (Zone 4 Lead)",
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-[#004d2c] text-xs font-bold tracking-wider uppercase">
            <ShieldCheck size={16} />
            <span>Federal Statutory Regulatory Compliance Desk</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Permits & Environmental Compliance Portal
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Apply for statutory resource extraction permits, bio-remediation clearances, and industrial discharge licenses under federal environmental mandates.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center border-b border-slate-200">
          <div className="inline-flex gap-2 p-1.5 bg-slate-200/70 rounded-2xl">
            <button
              onClick={() => setActiveTab("apply")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "apply"
                  ? "bg-[#004d2c] text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Submit New Application
            </button>
            <button
              onClick={() => setActiveTab("track")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "track"
                  ? "bg-[#004d2c] text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Track Application Status
            </button>
            <button
              onClick={() => setActiveTab("guidelines")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "guidelines"
                  ? "bg-[#004d2c] text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Statutory Fee Schedule
            </button>
          </div>
        </div>

        {/* TAB 1: SUBMIT NEW APPLICATION */}
        {activeTab === "apply" && (
          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
            {applicationToken ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-[#004d2c] mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Application Transmitted Successfully!</h2>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your permit dossier has been queued for Directorate technical evaluation. Keep your application tracking token safe:
                </p>
                <div className="font-mono text-lg font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-6 py-2.5 rounded-xl inline-block">
                  {applicationToken}
                </div>
                <p className="text-xs text-slate-500">
                  Confirmation and statutory fee invoicing directives have been dispatched to <strong>{formData.email}</strong>.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setApplicationToken(null);
                      setFormData({
                        companyName: "",
                        cacNumber: "",
                        contactPerson: "",
                        email: "",
                        phone: "",
                        state: "Rivers State",
                        lga: "",
                        siteCoordinates: "",
                        projectScope: "",
                      });
                    }}
                    className="px-6 py-2.5 bg-[#004d2c] text-white rounded-xl text-xs font-bold shadow"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Applicant Entity & Project Details</h3>
                  <p className="text-xs text-slate-500 mt-0.5">All applications are vetted against NDPR statutory disclosure standards.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company / Corporate Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Marine & Ecological Ltd"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#004d2c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">CAC / RC Registration Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="RC-1294819"
                      value={formData.cacNumber}
                      onChange={(e) => setFormData({ ...formData, cacNumber: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#004d2c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Authorized Contact Officer *</label>
                    <input
                      type="text"
                      required
                      placeholder="Engr. David Okon"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#004d2c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Official Corporate Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="compliance@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#004d2c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Permit Class Requested *</label>
                    <select
                      value={selectedCategory.code}
                      onChange={(e) => {
                        const found = PERMIT_CATEGORIES.find((c) => c.code === e.target.value);
                        if (found) setSelectedCategory(found);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#004d2c]"
                    >
                      {PERMIT_CATEGORIES.map((cat) => (
                        <option key={cat.code} value={cat.code}>
                          {cat.code} – {cat.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Operational State *</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#004d2c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Operational Scope & Environmental Safeguards *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe exact operational boundaries, chemical mitigation measures, and equipment deployment..."
                    value={formData.projectScope}
                    onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#004d2c]"
                  />
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs text-[#004d2c]">
                  <div>
                    <span className="font-bold block uppercase tracking-wide">Statutory Fee for Selected Category:</span>
                    <span className="font-mono font-black text-sm">{selectedCategory.statutoryFee} ({selectedCategory.duration})</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600">Payable upon technical vetting approval</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#004d2c] hover:bg-[#003820] text-white font-bold py-3 rounded-xl text-xs shadow-md transition"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                  <span>{submitting ? "Transmitting Permit Dossier..." : "Submit Formal Permit Application"}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: APPLICATION TRACKER */}
        {activeTab === "track" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <form onSubmit={handleTrackPermit} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Verify Permit Application Progress</h3>
              <p className="text-xs text-slate-500">Enter your statutory tracking number (e.g. PRM-NIRRMPT-2026-0891).</p>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="PRM-NIRRMPT-2026-XXXX"
                  value={trackingQuery}
                  onChange={(e) => setTrackingQuery(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#004d2c]"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="px-6 py-2.5 bg-[#004d2c] text-white rounded-xl text-xs font-bold shadow hover:bg-[#003820] transition"
                >
                  {searching ? "Searching..." : "Track"}
                </button>
              </div>
            </form>

            {trackingResult && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {trackingResult.code}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mt-2">{trackingResult.company}</h4>
                    <p className="text-xs text-slate-500">{trackingResult.type}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    UNDER VETTING
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Phase:</span>
                    <span className="font-bold text-slate-900">{trackingResult.stage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Inspector:</span>
                    <span className="font-bold text-slate-900">{trackingResult.assignedOfficer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Submitted On:</span>
                    <span className="font-bold text-slate-900">{trackingResult.submissionDate}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STATUTORY GUIDELINES */}
        {activeTab === "guidelines" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PERMIT_CATEGORIES.map((cat) => (
              <div key={cat.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      {cat.code}
                    </span>
                    <span className="text-sm font-black text-[#004d2c]">{cat.statutoryFee}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{cat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{cat.description}</p>
                  
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Mandatory Prerequisites:</span>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                      {cat.prerequisites.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-400 font-mono">Validity: {cat.duration}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}