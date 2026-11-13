"use client";

import React, { useState } from "react";
import {
  FolderKanban,
  MapPin,
  TrendingUp,
  Activity,
  Layers,
  Search,
  CheckCircle2,
  Calendar,
  Building2,
  ExternalLink,
  X,
  ShieldCheck,
} from "lucide-react";

interface Project {
  id: string;
  code: string;
  title: string;
  sector: "Watershed & Aquifer" | "Reforestation & Mangrove" | "Soil Remediation" | "Renewable Ag-Tech";
  zone: "South-South" | "North-West" | "South-East" | "North-East" | "North-Central" | "South-West";
  state: string;
  lga: string;
  status: "Active Deployment" | "Monitoring Phase" | "Completed";
  progress: number;
  commenced: string;
  targetCompletion: string;
  leadAgency: string;
  impactMetric: string;
  budgetAllocated: string;
  description: string;
  deliverables: string[];
}

const PROJECTS: Project[] = [
  {
    id: "PRJ-01",
    code: "NIR-MNG-2026",
    title: "Niger Delta Coastal Mangrove Ecosystem Recovery Initiative",
    sector: "Reforestation & Mangrove",
    zone: "South-South",
    state: "Rivers State",
    lga: "Degema & Gokana LGAs",
    status: "Active Deployment",
    progress: 74,
    commenced: "March 2025",
    targetCompletion: "December 2026",
    leadAgency: "NIRRMPT Directorate of Marine Conservation",
    impactMetric: "1,450 Hectares Restored / 82% Root Viability",
    budgetAllocated: "Statutory Ecological Fund Intervention",
    description:
      "A strategic coastal conservation operation deploying bio-remediation buffers and multispectral satellite monitoring to revive oil-impacted mangrove estuaries across the Niger Delta coastline.",
    deliverables: [
      "Propagation of 500,000 native red mangrove (Rhizophora racemosa) saplings",
      "Continuous soil salinity and heavy metal telemetry every 4 hours",
      "Training and stipends for 280 community field wardens and fishermen",
      "Establishment of permanent GPS ground-truthing sentinel stations",
    ],
  },
  {
    id: "PRJ-02",
    code: "NIR-SLT-2026",
    title: "Sahelian Green Belt Agroforestry & Desertification Buffer",
    sector: "Reforestation & Mangrove",
    zone: "North-West",
    state: "Kano & Jigawa States",
    lga: "Danbatta & Birniwa LGAs",
    status: "Active Deployment",
    progress: 62,
    commenced: "July 2025",
    targetCompletion: "August 2027",
    leadAgency: "NIRRMPT Arid Zones & Soil Protection Wing",
    impactMetric: "3,200 Hectares Protected / 18 Shelterbelts",
    budgetAllocated: "Federal Climate Resilience Intervention",
    description:
      "Large-scale regional intervention countering sand dune migration through deep-root drought-resistant acacia buffers, moisture-retention soil conditioning, and micro-catchment irrigation.",
    deliverables: [
      "Construction of 18 windbreak vegetative corridors across agrarian borders",
      "Installation of 24 solar-powered groundwater aquifer telemetry wells",
      "Deployment of drought-resistant organic mycorrhizal soil inoculants",
      "Local farmer cooperative regenerative yield certification program",
    ],
  },
  {
    id: "PRJ-03",
    code: "NIR-GUL-2026",
    title: "Eastern Basin Gully Erosion Stabilization & Hydrological Control",
    sector: "Watershed & Aquifer",
    zone: "South-East",
    state: "Anambra & Imo States",
    lga: "Orumba North & Ideato South LGAs",
    status: "Active Deployment",
    progress: 88,
    commenced: "January 2025",
    targetCompletion: "May 2027",
    leadAgency: "National Erosion & Watershed Taskforce",
    impactMetric: "12 Catastrophic Chasms Stabilized",
    budgetAllocated: "Inter-MDA Watershed Infrastructure Grant",
    description:
      "Geotechnical stabilization employing stepped gabion terracing, vetiver grass root reinforcement, and automated runoff diversion to protect critical transport corridors and farmlands.",
    deliverables: [
      "Engineered concrete runoff dissipation chutes and stepped retaining berms",
      "Biological soil stabilization over 45 kilometers of active ravine edges",
      "Early warning telemetry sensors connected to Civil Protection command",
      "Re-vegetation of adjoining arable buffer zones",
    ],
  },
  {
    id: "PRJ-04",
    code: "NIR-AQU-2027",
    title: "Benue Trough Deep Aquifer Protection & Hydro-Quality Network",
    sector: "Watershed & Aquifer",
    zone: "North-Central",
    state: "Benue & Nasarawa States",
    lga: "Makurdi & Doma LGAs",
    status: "Monitoring Phase",
    progress: 95,
    commenced: "August 2024",
    targetCompletion: "March 2027",
    leadAgency: "NIRRMPT Hydro-Geology Division",
    impactMetric: "88 Deep Wells Monitored / Zero Leachate",
    budgetAllocated: "Federal Clean Waterway Initiative",
    description:
      "Deployment of real-time IoT water quality sensors across critical subterranean river basins to safeguard drinking water supplies against chemical leachate and industrial runoff.",
    deliverables: [
      "88 telemetry probe stations transmitting real-time pH and mineral data",
      "Public groundwater security GIS map published for municipal planners",
      "Statutory compliance enforcement for chemical manufacturers in the corridor",
    ],
  },
];

export default function ProjectsShowcasePage() {
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const sectors = [
    "All",
    "Watershed & Aquifer",
    "Reforestation & Mangrove",
    "Soil Remediation",
    "Renewable Ag-Tech",
  ];

  const filteredProjects = PROJECTS.filter((project) => {
    const matchesSector = selectedSector === "All" || project.sector === selectedSector;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.lga.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-[#004d2c] text-xs font-bold tracking-wider uppercase">
            <FolderKanban size={15} />
            <span>Statutory National Projects Registry</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            NIRRMPT Ecological Initiatives & Field Deployments
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Live national registry tracking public capital interventions, mangrove bio-remediation,
            desertification buffers, and water protection projects across Nigeria.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by title, state, or LGA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#004d2c]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedSector === sec
                    ? "bg-[#004d2c] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header Tags */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-emerald-50 text-[#004d2c] border border-emerald-200">
                    {proj.code}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                      {proj.zone}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      {proj.status}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Execution Progress</span>
                    <span className="text-emerald-700">{proj.progress}% Completed</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#004d2c] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                {/* Meta Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-emerald-700 shrink-0" />
                    <span className="truncate">{proj.lga}, {proj.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-emerald-700 shrink-0" />
                    <span>Target: {proj.targetCompletion}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <TrendingUp size={14} className="text-emerald-700 shrink-0" />
                    <span className="font-bold text-slate-800">Impact: {proj.impactMetric}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center">
                <span className="text-xs text-slate-500 truncate max-w-[200px]">
                  {proj.leadAgency}
                </span>
                <button
                  onClick={() => setActiveProject(proj)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#004d2c] hover:bg-[#003820] text-white shadow-sm transition"
                >
                  View Full Audit Dossier
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Project Dossier */}
        {activeProject && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 border border-slate-200">
              <button
                onClick={() => setActiveProject(null)}
                className="absolute right-6 top-6 text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>

              <div>
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                  {activeProject.code}
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-3">
                  {activeProject.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Location: <strong>{activeProject.lga}, {activeProject.state} ({activeProject.zone})</strong>
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Lead Directorate:</span>
                  <span className="font-bold text-slate-800">{activeProject.leadAgency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Impact Assessment:</span>
                  <span className="font-bold text-emerald-700">{activeProject.impactMetric}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Funding Mechanism:</span>
                  <span className="font-bold text-slate-800">{activeProject.budgetAllocated}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Verified Technical Deliverables
                </h4>
                <div className="space-y-2">
                  {activeProject.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  onClick={() => setActiveProject(null)}
                  className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}