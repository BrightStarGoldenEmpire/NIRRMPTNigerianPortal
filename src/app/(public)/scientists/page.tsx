"use client";

import React, { useState } from "react";
import {
  Microscope,
  Search,
  Mail,
  GraduationCap,
  BookOpen,
  Award,
  ExternalLink,
  Building2,
  X,
  FileText,
  BadgeCheck,
} from "lucide-react";

interface Scientist {
  id: string;
  fullName: string;
  title: string;
  rank: "Principal Research Fellow" | "Senior Research Fellow" | "Lead Scientist" | "Adjunct Fellow";
  department: string;
  division: "Soil Remediation" | "GIS & Spatial Analytics" | "Hydrology & Watersheds" | "Marine Ecology" | "Policy & Law";
  qualifications: string;
  email: string;
  specialization: string[];
  activeProjects: string;
  publicationsCount: number;
  bio: string;
  recentPublications: string[];
}

const SCIENTISTS: Scientist[] = [
  {
    id: "sci-01",
    fullName: "Prof. Kenneth O. Okafor",
    title: "Director of Ecological Science & Bio-Remediation",
    rank: "Lead Scientist",
    department: "Regenerative Agriculture & Soil Conservation",
    division: "Soil Remediation",
    qualifications: "Ph.D. Soil Microbial Ecology (Ibadan), FESN, FNIRRMPT",
    email: "k.okafor@nirrmpt.org",
    specialization: ["Microbiome Inoculation", "Heavy Metal Bio-Remediation", "Topsoil Carbon Sequestration"],
    activeProjects: "Niger Delta Coastal Estuary Soil Detoxification Telemetry",
    publicationsCount: 42,
    bio: "Pioneering researcher with over 22 years of field experience in developing native biological inoculants to restore crude-oil devastated farmlands across sub-Saharan Africa.",
    recentPublications: [
      "Microbial Enzymatic Kinetics in Saline Hydrocarbon-Impacted Soils (2025)",
      "Organic Nitrogen Fixation in Degraded Coastal Mangrove Substrata (2024)",
      "National Guidelines for Rapid Ecological Soil Quality Screening (2023)",
    ],
  },
  {
    id: "sci-02",
    fullName: "Dr. Amina Abubakar",
    title: "Chief Geospatial & Satellite Telemetry Lead",
    rank: "Principal Research Fellow",
    department: "GIS & Remote Sensing Division",
    division: "GIS & Spatial Analytics",
    qualifications: "Ph.D. Geomatics & Satellite Photogrammetry (ABU), MNSE, FESN",
    email: "a.abubakar@nirrmpt.org",
    specialization: ["Satellite Remote Sensing", "Multispectral LiDAR Processing", "Aquifer Depletion Modeling"],
    activeProjects: "Sahelian Green Belt Desertification Buffer Telemetry",
    publicationsCount: 31,
    bio: "Specializes in integrating high-resolution Sentinel-2 and Landsat multispectral radar imagery to model real-time desert encroachment patterns and mangrove canopy changes.",
    recentPublications: [
      "Predictive Deep-Learning Models for Semi-Arid Dune Encroachment in Northern Nigeria (2025)",
      "Multi-Temporal Synthetic Aperture Radar for Subsurface Aquifer Detection (2024)",
      "Autonomous Telemetry Frameworks for National Conservation Reserves (2023)",
    ],
  },
  {
    id: "sci-03",
    fullName: "Dr. Emmanuel Etuk",
    title: "Head of Environmental Permitting & Impact Auditing",
    rank: "Principal Research Fellow",
    department: "Environmental Compliance & Permitting",
    division: "Marine Ecology",
    qualifications: "Ph.D. Marine Hydrobiology (Port Harcourt), FNIRRMPT, MEIA",
    email: "e.etuk@nirrmpt.org",
    specialization: ["EIA Protocol Auditing", "Estuarine Fishery Recovery", "Benthic Fauna Profiling"],
    activeProjects: "Sector 4 Coastal Wetland Benthic Viability Survey",
    publicationsCount: 28,
    bio: "Statutory environmental compliance auditor with extensive consultation experience in petroleum sector decommissioning, benthic baseline surveys, and regulatory EIA enforcement.",
    recentPublications: [
      "Standard Operating Procedures for Statutory Nigerian EIA Auditing (2026)",
      "Macroinvertebrate Biodiversity Indices in Post-Spill Estuaries (2024)",
      "Benthic Microplastics Concentration in Brackish Water Basins (2023)",
    ],
  },
  {
    id: "sci-04",
    fullName: "Dr. Fatima Zahra Bello",
    title: "Senior Hydrologist & Watershed Dynamics Fellow",
    rank: "Senior Research Fellow",
    department: "Hydrological & Water Resources",
    division: "Hydrology & Watersheds",
    qualifications: "Ph.D. Hydro-Geology (Strathclyde), MEI, COREN",
    email: "f.bello@nirrmpt.org",
    specialization: ["Subterranean Leachate Control", "Groundwater Hydro-Dynamics", "River Basin Modeling"],
    activeProjects: "Benue Trough Subterranean Aquifer Monitoring Network",
    publicationsCount: 19,
    bio: "Focuses on preserving national subterranean potable water aquifers through automated real-time sensor stations detecting heavy-ion leachate from industrial runoff.",
    recentPublications: [
      "Hydrogeochemical Mapping of Alluvial Aquifers in Agricultural Watersheds (2025)",
      "Isotope Tracing of Chemical Runoff in Karst Subterranean Systems (2024)",
      "Sensor Network Architectures for Continuous River Basin Water Audits (2023)",
    ],
  },
  {
    id: "sci-05",
    fullName: "Barr. Florence Danjuma",
    title: "Senior Research Fellow in Environmental Jurisprudence",
    rank: "Senior Research Fellow",
    department: "Directorate of Policy & Legal Affairs",
    division: "Policy & Law",
    qualifications: "LL.M. Environmental Law (London), BL, Notary Public",
    email: "f.danjuma@nirrmpt.org",
    specialization: ["Statutory Regulatory Law", "Community Ecological Compacts", "FOI Environmental Disclosure"],
    activeProjects: "Statutory Guidelines for National Environmental Dispute Arbitration",
    publicationsCount: 14,
    bio: "Expert legal analyst addressing corporate environmental liability, statutory community access to environmental documentation, and international transboundary conservation pacts.",
    recentPublications: [
      "Judicial Enforcement of Statutory Remediation Orders under Nigerian Law (2025)",
      "The Freedom of Information Act as a Catalyst for Environmental Compliance (2024)",
      "Balancing Extractive Concessions with Indigenous Riparian Rights (2023)",
    ],
  },
];

export default function ScientistsPage() {
  const [selectedDivision, setSelectedDivision] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeScientist, setActiveScientist] = useState<Scientist | null>(null);

  const divisions = [
    "All",
    "Soil Remediation",
    "GIS & Spatial Analytics",
    "Hydrology & Watersheds",
    "Marine Ecology",
    "Policy & Law",
  ];

  const filteredScientists = SCIENTISTS.filter((sci) => {
    const matchesDivision = selectedDivision === "All" || sci.division === selectedDivision;
    const matchesSearch =
      sci.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sci.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sci.specialization.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      sci.qualifications.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDivision && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-[#004d2c] text-xs font-bold tracking-wider uppercase">
            <Microscope size={16} />
            <span>Statutory National Research Directorate</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Scientific Council & Research Fellows
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Leading scientific investigators, remote sensing analysts, and ecological legal fellows driving national regenerative resource protection across Nigeria.
          </p>
        </div>

        {/* Search & Division Filter */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by scientist name, field, or degree..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#004d2c]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {divisions.map((div) => (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedDivision === div
                    ? "bg-[#004d2c] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {div}
              </button>
            ))}
          </div>
        </div>

        {/* Scientists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScientists.map((sci) => (
            <div
              key={sci.id}
              className="bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#004d2c] border border-emerald-200">
                    {sci.division}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {sci.publicationsCount} Papers
                  </span>
                </div>

                {/* Name & Credentials */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {sci.fullName}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                    {sci.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 font-mono">
                    {sci.qualifications}
                  </p>
                </div>

                {/* Specialization Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                  {sci.specialization.map((spec, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Active Focus */}
                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700 block text-[11px]">Primary Research Focus:</span>
                  <span className="text-[11px] text-slate-600">{sci.activeProjects}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between">
                <a
                  href={`mailto:${sci.email}`}
                  className="text-xs text-slate-500 hover:text-[#004d2c] flex items-center gap-1 font-mono"
                >
                  <Mail size={13} />
                  <span>Contact</span>
                </a>
                <button
                  onClick={() => setActiveScientist(sci)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#004d2c] hover:bg-[#003820] text-white shadow-sm transition"
                >
                  Full Scientific Dossier
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredScientists.length === 0 && (
          <div className="py-16 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
            No scientific fellows match your query.
          </div>
        )}

        {/* Modal: Full Academic Dossier */}
        {activeScientist && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 border border-slate-200">
              <button
                onClick={() => setActiveScientist(null)}
                className="absolute right-6 top-6 text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  <BadgeCheck size={14} />
                  Verified NIRRMPT Research Fellow
                </span>
                <h2 className="text-2xl font-black text-slate-900 pt-2">
                  {activeScientist.fullName}
                </h2>
                <p className="text-xs font-semibold text-emerald-700">
                  {activeScientist.title} • {activeScientist.department}
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  {activeScientist.qualifications}
                </p>
              </div>

              {/* Bio */}
              <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
                  Academic & Field Biography
                </h4>
                {activeScientist.bio}
              </div>

              {/* Selected Publications */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText size={15} className="text-[#004d2c]" />
                  Selected Peer-Reviewed Publications & Monographs
                </h4>
                <div className="space-y-2">
                  {activeScientist.recentPublications.map((pub, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-slate-700 p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2"
                    >
                      <BookOpen size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                      <span>{pub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs font-mono text-slate-500">
                  Official Liaison: {activeScientist.email}
                </span>
                <button
                  onClick={() => setActiveScientist(null)}
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