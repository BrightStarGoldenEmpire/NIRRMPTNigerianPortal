"use client";

import React, { useState } from "react";
import {
  Map,
  Layers,
  MapPin,
  Activity,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  Filter,
  RefreshCw,
  Compass,
  Radio,
  SlidersHorizontal,
  Info,
} from "lucide-react";

interface GISPoint {
  id: string;
  code: string;
  name: string;
  category: "mangrove" | "aquifer" | "soil" | "forest" | "erosion";
  state: string;
  lga: string;
  coordinates: { lat: number; lng: number };
  status: "PROTECTED" | "ACTIVE_MONITORING" | "CRITICAL_RISK";
  telemetry: {
    moisturePercent: number;
    phLevel: number;
    salinityPpm: number;
    ndviVegetationIndex: number;
    lastSensorPing: string;
  };
  details: string;
}

const GIS_STATIONS: GISPoint[] = [
  {
    id: "gis-01",
    code: "GIS-SS-089",
    name: "Niger Delta Estuary Mangrove Sanctuary (Sector 4)",
    category: "mangrove",
    state: "Rivers State",
    lga: "Degema LGA",
    coordinates: { lat: 4.7497, lng: 6.7583 },
    status: "ACTIVE_MONITORING",
    telemetry: {
      moisturePercent: 88,
      phLevel: 6.8,
      salinityPpm: 1420,
      ndviVegetationIndex: 0.78,
      lastSensorPing: "3 mins ago",
    },
    details: "Automated bio-barrier telemetry detecting post-remediation vegetative recovery in Rhizophora mangrove belts.",
  },
  {
    id: "gis-02",
    code: "GIS-NW-042",
    name: "Sahelian Green Belt Shelterbelt Reserve (Block B)",
    category: "forest",
    state: "Kano State",
    lga: "Danbatta LGA",
    coordinates: { lat: 12.4333, lng: 8.5167 },
    status: "PROTECTED",
    telemetry: {
      moisturePercent: 24,
      phLevel: 7.4,
      salinityPpm: 210,
      ndviVegetationIndex: 0.44,
      lastSensorPing: "8 mins ago",
    },
    details: "Dune stabilization corridor planted with deep-rooted Acacia senegal mitigating southward desert migration.",
  },
  {
    id: "gis-03",
    code: "GIS-NC-114",
    name: "Benue Subterranean Deep Aquifer Basin",
    category: "aquifer",
    state: "Benue State",
    lga: "Makurdi LGA",
    coordinates: { lat: 7.7333, lng: 8.5333 },
    status: "PROTECTED",
    telemetry: {
      moisturePercent: 95,
      phLevel: 7.1,
      salinityPpm: 140,
      ndviVegetationIndex: 0.82,
      lastSensorPing: "1 min ago",
    },
    details: "Subterranean potable water catchment with IoT sensors monitoring heavy metal leachate runoff.",
  },
  {
    id: "gis-04",
    code: "GIS-SE-076",
    name: "Orumba Ravine & Gully Stabilization Sector",
    category: "erosion",
    state: "Anambra State",
    lga: "Orumba North LGA",
    coordinates: { lat: 6.0333, lng: 7.1333 },
    status: "CRITICAL_RISK",
    telemetry: {
      moisturePercent: 62,
      phLevel: 5.9,
      salinityPpm: 85,
      ndviVegetationIndex: 0.36,
      lastSensorPing: "Just now",
    },
    details: "Stepped gabion retention walls and bio-engineering vetiver grass stabilizing active gully chasm edges.",
  },
  {
    id: "gis-05",
    code: "GIS-SW-019",
    name: "Omo Forest Biosphere Conservation Basin",
    category: "soil",
    state: "Ogun State",
    lga: "Ijebu East LGA",
    coordinates: { lat: 6.8333, lng: 4.35 },
    status: "PROTECTED",
    telemetry: {
      moisturePercent: 76,
      phLevel: 6.5,
      salinityPpm: 95,
      ndviVegetationIndex: 0.89,
      lastSensorPing: "12 mins ago",
    },
    details: "Ancient tropical rainforest soils protected under strict conservation and carbon-sink monitoring.",
  },
];

export default function GISInteractiveMapPage() {
  const [selectedStation, setSelectedStation] = useState<GISPoint>(GIS_STATIONS[0]);
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>("All");

  // Layer Visibility Toggles (Audit Item #27)
  const [activeLayers, setActiveLayers] = useState({
    mangrove: true,
    aquifer: true,
    soil: true,
    forest: true,
    erosion: true,
  });

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev [layer] }));
  };

  const states = ["All", "Rivers State", "Kano State", "Benue State", "Anambra State", "Ogun State"];

  const filteredStations = GIS_STATIONS.filter((station) => {
    const isLayerActive = activeLayers[station.category];
    const isStateMatch = selectedStateFilter === "All" || station.state === selectedStateFilter;
    return isLayerActive && isStateMatch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-2">
              <Compass size={14} />
              <span>National Geospatial Telemetry Portal (Phase 2 Engine)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Interactive GIS Natural Resource Map
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Live spatial telemetry covering coastal mangrove reserves, inland aquifers, gully corridors, and arid soil buffers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              <Radio size={14} className="animate-pulse" />
              <span>5 Stations Online</span>
            </span>
          </div>
        </div>

        {/* Layer Toggles & State Filters Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Layer Toggle Pills */}
          <div className="space-y-2 w-full lg:w-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers size={13} className="text-emerald-400" />
              <span>GIS Layer Controls (Audit Item #27)</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "mangrove", label: "Coastal Mangroves", color: "emerald" },
                { key: "aquifer", label: "Deep Aquifers", color: "cyan" },
                { key: "forest", label: "Forest Shelterbelts", color: "amber" },
                { key: "erosion", label: "Gully Erosion Risks", color: "rose" },
                { key: "soil", label: "Conservation Soils", color: "purple" },
              ].map((layer) => {
                const isActive = activeLayers[layer.key as keyof typeof activeLayers];
                return (
                  <button
                    key={layer.key}
                    onClick={() => toggleLayer(layer.key as keyof typeof activeLayers)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isActive
                        ? "bg-[#004d2c] border-emerald-500/50 text-white shadow-sm"
                        : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                    <span>{layer.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* State / Geopolitical Filter */}
          <div className="space-y-2 w-full lg:w-auto self-end">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Filter size={13} className="text-emerald-400" />
              <span>Filter by State</span>
            </span>
            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs font-semibold text-white px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Main Map Viewport & Telemetry Inspector Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Vector Map Canvas Viewport (2 Cols) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[500px]">
            
            {/* Map Grid Backdrop & Coordinate Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

            <div className="flex justify-between items-center z-10">
              <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800">
                WGS84 Nigeria Geodetic Bounds (4°N - 14°N / 2°E - 15°E)
              </span>
              <span className="text-xs font-mono text-emerald-400">
                LIVE GPS TELEMETRY
              </span>
            </div>

            {/* Simulated Interactive Station Markers Canvas */}
            <div className="relative w-full h-80 my-auto flex items-center justify-center">
              {filteredStations.map((station, idx) => {
                const isSelected = selectedStation.id === station.id;
                // Distribute pins across interactive container
                const leftPositions = ["25%", "65%", "55%", "35%", "20%"];
                const topPositions = ["75%", "20%", "45%", "60%", "68%"];

                return (
                  <button
                    key={station.id}
                    onClick={() => setSelectedStation(station)}
                    style={{
                      left: leftPositions[idx % leftPositions.length],
                      top: topPositions[idx % topPositions.length],
                    }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl transition-all duration-300 z-20 group ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950 scale-125 shadow-[0_0_25px_rgba(16,185,129,0.8)]"
                        : "bg-slate-800 text-white hover:bg-[#004d2c] hover:scale-110"
                    }`}
                  >
                    <MapPin size={18} />
                    <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-slate-950 border border-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {station.code} ({station.state})
                    </span>
                  </button>
                );
              })}

              <div className="text-center text-slate-600 font-mono text-xs select-none pointer-events-none">
                [ Federal Cartographic Survey & Spatial Raster Telemetry Overlay ]
              </div>
            </div>

            {/* Bottom Status Ticker */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 z-10 pt-4 border-t border-slate-800/80">
              <span>Selected Station: <strong className="text-white">{selectedStation.code}</strong></span>
              <span>Coordinates: {selectedStation.coordinates.lat}° N, {selectedStation.coordinates.lng}° E</span>
            </div>
          </div>

          {/* Station Telemetry Details Inspector (1 Col) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  {selectedStation.code}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    selectedStation.status === "PROTECTED"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                      : selectedStation.status === "CRITICAL_RISK"
                      ? "bg-rose-950 text-rose-300 border border-rose-500/30 animate-pulse"
                      : "bg-amber-950 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {selectedStation.status}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white leading-snug">
                  {selectedStation.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin size={12} className="text-emerald-400" />
                  <span>{selectedStation.lga}, {selectedStation.state}</span>
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {selectedStation.details}
              </p>

              {/* Live Telemetry Sensors Grid */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Activity size={13} className="text-emerald-400" />
                  <span>Live Sensor Telemetry</span>
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Soil Moisture</span>
                    <span className="text-lg font-black text-white">{selectedStation.telemetry.moisturePercent}%</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">pH Acidity</span>
                    <span className="text-lg font-black text-emerald-400">{selectedStation.telemetry.phLevel}</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Salinity Index</span>
                    <span className="text-lg font-black text-amber-400">{selectedStation.telemetry.salinityPpm} ppm</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">NDVI Canopy</span>
                    <span className="text-lg font-black text-white">{selectedStation.telemetry.ndviVegetationIndex}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center font-mono">
              <span>Ping: {selectedStation.telemetry.lastSensorPing}</span>
              <span className="text-emerald-400 font-bold">CALIBRATED</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}