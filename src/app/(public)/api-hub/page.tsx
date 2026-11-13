"use client";

import React, { useState } from "react";
import {
  Terminal,
  Key,
  ShieldCheck,
  Code2,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Cpu,
  Layers,
  Database,
  Globe,
  Radio,
  Lock,
} from "lucide-react";

interface ApiEndpoint {
  method: "GET" | "POST";
  path: string;
  category: "Resources" | "Spatial Telemetry" | "Compliance & EIA" | "Federated MDAs";
  title: string;
  description: string;
  responseSample: string;
}

const ENDPOINTS: ApiEndpoint[] = [
  {
    method: "GET",
    path: "/api/v1/mda/resources",
    category: "Resources",
    title: "National Regenerative Resource Registry",
    description: "Returns verified active conservation sites, soil basins, and protected coastal zones across all 36 States and the FCT.",
    responseSample: `{
  "success": true,
  "statusCode": 200,
  "timestamp": "2026-11-07T14:32:00Z",
  "data": [
    {
      "id": "res-901",
      "name": "Niger Delta Mangrove Basin",
      "state": "Rivers State",
      "lga": "Degema",
      "status": "PROTECTED",
      "coordinates": { "lat": 4.7497, "lng": 6.7583 }
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/mda/gis/telemetry",
    category: "Spatial Telemetry",
    title: "Live IoT Sensor & GIS Coordinates Feed",
    description: "Stream real-time vegetative canopy NDVI, soil moisture, and pH telemetry from field-deployed sentinel sensors.",
    responseSample: `{
  "stationCode": "GIS-SS-089",
  "telemetry": {
    "soilMoisture": "88%",
    "phAcidity": 6.8,
    "salinityIndex": "1420 ppm",
    "ndviCanopy": 0.78
  },
  "sensorStatus": "CALIBRATED_ONLINE"
}`,
  },
  {
    method: "POST",
    path: "/api/v1/mda/eia/verify",
    category: "Compliance & EIA",
    title: "Statutory EIA Filing & Certificate Verification",
    description: "Enables sister enforcement bodies (NESREA / NOSDRA) to validate environmental certificates in real time.",
    responseSample: `{
  "verificationToken": "EIA-NG-2026-0891",
  "status": "STATUTORY_APPROVED",
  "developer": "Apex Ecological Engineering Ltd",
  "authorizedOfficer": "Dr. Emmanuel Etuk, FNIRRMPT",
  "validUntil": "2028-11-30"
}`,
  },
  {
    method: "GET",
    path: "/api/v1/mda/compliance/stats",
    category: "Federated MDAs",
    title: "National Ecological Inter-Agency KPI Summary",
    description: "High-level consolidated environmental telemetry metrics for National Planning, Budget, and Executive Council review.",
    responseSample: `{
  "totalVerifiedProjects": 142,
  "ndprComplianceScore": "100%",
  "monitoredStatesCount": 36,
  "activeInterventionHectares": 12850
}`,
  },
];

export default function ApiHubPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(ENDPOINTS[0]);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [apiKeyGenerated, setApiKeyGenerated] = useState<string | null>(null);
  const [mdaAgencyName, setMdaAgencyName] = useState("");

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mdaAgencyName.trim()) return;
    const token = `mda_live_${Math.random().toString(36).substring(2, 12)}_${Date.now().toString(36)}`;
    setApiKeyGenerated(token);
  };

  const handleCopy = (text: string, type: "key" | "code") => {
    navigator.clipboard.writeText(text);
    if (type === "key") {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase">
            <Cpu size={16} />
            <span>Federal Inter-Agency Data Exchange</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Inter-MDA REST API Gateway & Hub
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Standardized, NDPR-compliant data exchange protocol connecting the Federal Ministry of Environment,
            NESREA, NOSDRA, NiMet, and state environmental protection boards in real time.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "OAuth2 & API Key Auth", desc: "Mutual TLS and 256-bit token signatures", icon: Lock, color: "text-emerald-400" },
            { title: "RESTful JSON Standards", desc: "Strict OpenAPI 3.1 compliant schemas", icon: Code2, color: "text-cyan-400" },
            { title: "High-Throughput Pool", desc: "99.98% SLA across federal networks", icon: Radio, color: "text-amber-400" },
            { title: "NDPR Data Privacy", desc: "Encrypted statutory compliance pipeline", icon: ShieldCheck, color: "text-rose-400" },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <Icon size={20} className={item.color} />
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* API Interactive Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Endpoint Directory */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Production Endpoints (v1)
            </span>
            <div className="space-y-2">
              {ENDPOINTS.map((ep) => {
                const isSelected = selectedEndpoint.path === ep.path;
                return (
                  <button
                    key={ep.path}
                    onClick={() => setSelectedEndpoint(ep)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-[#004d2c]/30 border-emerald-500/50 shadow-md"
                        : "bg-slate-900 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`text-[10px] font-mono font-black px-2 py-0.5 rounded ${
                          ep.method === "GET"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-950 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 truncate">{ep.path}</span>
                    </div>
                    <div className="text-xs font-bold text-white">{ep.title}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Endpoint Documentation & JSON Viewer (2 Cols) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                    {selectedEndpoint.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">{selectedEndpoint.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    HTTP/2 · REST
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedEndpoint.description}
              </p>

              {/* URL Preview */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between font-mono text-xs">
                <span className="text-emerald-400 font-bold mr-2">{selectedEndpoint.method}</span>
                <span className="text-slate-300 truncate flex-1">
                  https://nirrmpt.org{selectedEndpoint.path}
                </span>
                <span className="text-slate-500 text-[11px] shrink-0 ml-2">Bearer Token</span>
              </div>

              {/* JSON Payload Sample */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold flex items-center gap-1.5">
                    <Terminal size={14} className="text-emerald-400" />
                    <span>200 OK Response Schema</span>
                  </span>
                  <button
                    onClick={() => handleCopy(selectedEndpoint.responseSample, "code")}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition"
                  >
                    {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedCode ? "Copied" : "Copy JSON"}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 border border-slate-800 p-4 rounded-2xl overflow-x-auto text-[11px] font-mono text-emerald-300/90 leading-relaxed max-h-64">
                  {selectedEndpoint.responseSample}
                </pre>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-500 flex justify-between items-center">
              <span>Rate Limit: 2,500 req / min</span>
              <span className="text-emerald-400 font-mono">STATUS: OPERATIONAL</span>
            </div>
          </div>

        </div>

        {/* Sandbox Key Provisioning Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Key size={14} />
              <span>Inter-Agency Sandbox Provisioning</span>
            </div>
            <h3 className="text-2xl font-black text-white">Generate Sister MDA Sandbox Token</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designated desk officers from registered ministries, departments, and agencies can generate an immediate
              read-only sandbox access token to test schema compliance against live NIRRMPT registries.
            </p>

            <form onSubmit={handleGenerateKey} className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="text"
                required
                placeholder="Enter MDA Name (e.g. Federal Ministry of Water Resources)"
                value={mdaAgencyName}
                onChange={(e) => setMdaAgencyName(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#004d2c] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md whitespace-nowrap"
              >
                Provision Token
              </button>
            </form>

            {apiKeyGenerated && (
              <div className="mt-4 p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block">Generated Sandbox Access Token</span>
                  <span className="font-mono text-xs text-white break-all">{apiKeyGenerated}</span>
                </div>
                <button
                  onClick={() => handleCopy(apiKeyGenerated, "key")}
                  className="px-3 py-1.5 bg-emerald-800/50 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1.5"
                >
                  {copiedKey ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedKey ? "Copied" : "Copy"}</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}