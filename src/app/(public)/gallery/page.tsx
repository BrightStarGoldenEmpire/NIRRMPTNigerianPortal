"use client";

import React, { useState } from 'react';
import { Image as ImageIcon, Video, Eye, Download, X, Filter, Sparkles, MapPin } from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  category: 'Satellite Imagery' | 'Field Inspections' | 'Summits' | 'Infrastructure';
  date: string;
  location: string;
  mediaType: 'image' | 'video';
  thumbnailColor: string;
  caption: string;
}

const MEDIA_ITEMS: MediaItem[] = [
  {
    id: "gal-1",
    title: "High-Res Satellite Scan of Niger Delta Wetlands",
    category: "Satellite Imagery",
    date: "September 2026",
    location: "Rivers State Belt",
    mediaType: "image",
    thumbnailColor: "#064e3b",
    caption: "False-color infrared composite capturing mangrove canopy health and water turbidity levels across coastal sectors."
  },
  {
    id: "gal-2",
    title: "Automated IoT Telemetry Sensor Deployment",
    category: "Field Inspections",
    date: "August 2026",
    location: "Port Harcourt Monitoring Zone",
    mediaType: "image",
    thumbnailColor: "#0284c7",
    caption: "Field engineers installing solar-powered soil moisture and atmospheric surveillance probes."
  },
  {
    id: "gal-3",
    title: "Executive Governing Council Meeting",
    category: "Summits",
    date: "July 2026",
    location: "Abuja Executive Hub",
    mediaType: "image",
    thumbnailColor: "#334155",
    caption: "Director-General Prof. Adeleke O. Danjuma addressing state delegates during the annual ecological technology forum."
  },
  {
    id: "gal-4",
    title: "NIRRMPT Central Geospatial Data Control Center",
    category: "Infrastructure",
    date: "September 2026",
    location: "Federal Headquarters",
    mediaType: "image",
    thumbnailColor: "#0f766e",
    caption: "Primary operations room displaying live satellite feeds and RESTful API network traffic metrics."
  }
];

export default function GalleryPage() {
  const [filter, setFilter] = useState('All');
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);

  const categories = ['All', 'Satellite Imagery', 'Field Inspections', 'Summits', 'Infrastructure'];

  const filteredMedia = MEDIA_ITEMS.filter(item => filter === 'All' || item.category === filter);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", color: "#0f172a", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      
      {/* Header Banner */}
      <div style={{ backgroundColor: "#062319", color: "#ffffff", padding: "60px 24px", borderBottom: "4px solid #10b981" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", borderRadius: "20px", padding: "4px 14px", color: "#34d399", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "16px" }}>
            <ImageIcon size={14} />
            <span>Official Media Repository</span>
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>
            Geospatial & Field Media Gallery
          </h1>
          <p style={{ fontSize: "16px", color: "#94a3b8", maxWidth: "700px", margin: 0, lineHeight: "1.6" }}>
            High-resolution imagery, satellite renders, field deployment photography, and infrastructure archives.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        
        {/* Category Filters */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", marginBottom: "32px", paddingBottom: "4px" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                border: "none",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                backgroundColor: filter === cat ? "#062319" : "#ffffff",
                color: filter === cat ? "#ffffff" : "#475569",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          {filteredMedia.map(item => (
            <div 
              key={item.id} 
              onClick={() => setActiveMedia(item)}
              style={{ backgroundColor: "#ffffff", borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", transition: "transform 0.2s ease" }}
            >
              <div style={{ backgroundColor: item.thumbnailColor, height: "180px", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", position: "relative" }}>
                <ImageIcon size={48} />
                <span style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: "rgba(15, 23, 42, 0.7)", color: "#ffffff", fontSize: "10px", fontWeight: "bold", padding: "4px 8px", borderRadius: "4px" }}>
                  {item.category}
                </span>
              </div>

              <div style={{ padding: "16px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "bold", color: "#0f172a", margin: "0 0 6px 0", lineHeight: "1.4" }}>{item.title}</h4>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#64748b" }}>
                  <MapPin size={12} style={{ color: "#059669" }} />
                  <span>{item.location} • {item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeMedia && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", maxWidth: "700px", width: "100%", overflow: "hidden", position: "relative", color: "#ffffff" }}>
            
            <button 
              onClick={() => setActiveMedia(null)}
              style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <X size={20} />
            </button>

            <div style={{ backgroundColor: activeMedia.thumbnailColor, height: "320px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ImageIcon size={96} style={{ color: "rgba(255,255,255,0.3)" }} />
            </div>

            <div style={{ padding: "24px" }}>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: "#34d399", backgroundColor: "rgba(16, 185, 129, 0.2)", padding: "4px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                {activeMedia.category}
              </span>
              <h3 style={{ fontSize: "20px", fontWeight: "bold", margin: "12px 0 8px 0" }}>{activeMedia.title}</h3>
              <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.6", margin: "0 0 16px 0" }}>{activeMedia.caption}</p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid #1e293b", fontSize: "12px", color: "#64748b" }}>
                <span>Location: {activeMedia.location}</span>
                <button 
                  onClick={() => alert("Downloading official high-resolution media asset...")}
                  style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#10b981", color: "#020617", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}
                >
                  <Download size={14} /> Download Asset
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}