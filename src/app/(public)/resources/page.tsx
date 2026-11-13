"use client";

import React, { useState } from "react";
import {
  Database,
  Filter,
  Search,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Sparkles,
  TreePine,
  Droplets,
  Mountain,
} from "lucide-react";

interface Resource {
  id: string;
  name: string;
  resourceType: "Forestry & Mangrove" | "Deep Aquifer" | "Soil Conservation Reserve" | "Mineral Buffer";
  state: string;
  lga: string;
  status: "ACTIVE" | "PROTECTED" | "CRITICAL" | "DEPLETED";
  monitoringAgency: string;
  lastSurvey: string;
  coordinates: string;
}

const INITIAL_RESOURCES: Resource[] = [
  {
    id: "res-01",
    name: "Sombreiro River Alluvial Aquifer Reserve",
    resourceType: "Deep Aquifer",
    state: "Rivers State",
    lga: "Ahoada East",
    status: "PROTECTED",
    monitoringAgency: "NIRRMPT Hydro-Geology Division",
    lastSurvey: "Oct 2026",
    coordinates: "4.8211° N, 6.6492° E",
  },
  {
    id: "res-02",
    name: "Baturiya Wetland Migratory & Peat Reserve",
    resourceType: "Forestry & Mangrove",
    state: "Jigawa State",
    lga: "Kiri Kasama",
    status: "PROTECTED",
    monitoringAgency: "Federal Biodiversity Taskforce",
    lastSurvey: "Sep 2026",
    coordinates: "12.5183° N, 10.4833° E",
  },
  {
    id: "res-03",
    name: "Oban Biome Tropical Rainforest Basin",
    resourceType: "Forestry & Mangrove",
    state: "Cross River State",
    lga: "Akamkpa",
    status: "ACTIVE",
    monitoringAgency: "National Park Service / NIRRMPT",
    lastSurvey: "Nov 2026",
    coordinates: "5.3167° N, 8.5833° E",
  },
  {
    id: "res-04",
    name: "Agulu-Nanka Escarpment Erosion Catchment",
    resourceType: "Soil Conservation Reserve",
    state: "Anambra State",
    lga: "Anaocha",
    status: "CRITICAL",
    monitoringAgency: "National Watershed Command",
    lastSurvey: "Oct 2026",
    coordinates: "6.1333° N, 7.0333° E",
  },
  {
    id: "res-05",
    name: "Kainji Lake Basin Subsurface Recharge Corridor",
    resourceType: "Deep Aquifer",
    state: "Niger State",
    lga: "Borgu",
    status: "ACTIVE",
    monitoringAgency: "Water Resources Taskforce",
    lastSurvey: "Aug 2026",
    coordinates: "9.8333° N, 4.5833° E",
  },
];

export default function ResourcesDatabasePage() {
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const states = ["All", "Rivers State", "Jigawa State", "Cross River State", "Anambra State", "Niger State"];
  const resourceTypes = ["All", "Forestry & Mangrove", "Deep Aquifer", "Soil Conservation Reserve", "Mineral Buffer"];

  const filtered = INITIAL_RESOURCES.filter((res) => {
    const matchState = selectedState === "All" || res.state === selectedState;
    const matchType = selectedType === "All" || res.resourceType === selectedType;
    const matchSearch =
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.lga.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.monitoringAgency.toLowerCase().includes(searchQuery.toLowerCase());
    return matchState && matchType && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase">
            <Database size={16} />
            <span>National Resource Inventory · Phase 2</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Regenerative Resource Database
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Statutory registry of gazetted forest reserves, aquifers, mangrove corridors, and soil conservation zones categorized by State, LGA, and environmental protection status.
          </p>
        </div>

        {/* Filter Controls (State, LGA & Resource Type) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by asset name or LGA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">State:</span>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                {resourceTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resource Cards Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-emerald-500/40 transition shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 rounded">
                    {item.resourceType}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.status === "PROTECTED"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                        : item.status === "CRITICAL"
                        ? "bg-rose-950 text-rose-300 border border-rose-500/30"
                        : "bg-amber-950 text-amber-300"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">{item.name}</h3>

                <div className="space-y-1 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-emerald-400" />
                    <span>{item.lga}, <strong>{item.state}</strong></span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 pl-4">{item.coordinates}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between items-center">
                <span>Agency: <strong className="text-slate-400">{item.monitoringAgency}</strong></span>
                <span>{item.lastSurvey}</span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-500 bg-slate-900 rounded-2xl border border-slate-800">
              No regenerative resources match this state and category filter.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}