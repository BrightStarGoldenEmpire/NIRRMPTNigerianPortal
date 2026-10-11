"use client";

import React, { useState } from 'react';
import { Search, Calendar, ArrowRight, X, Newspaper, ChevronRight } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  content: string;
  featured?: boolean;
}

const ARTICLES: Article[] = [
  {
    id: "news-1",
    title: "NIRRMPT Launches Phase 2 Satellite Ecological Tracking System",
    category: "Press Release",
    date: "September 24, 2026",
    readTime: "4 min read",
    featured: true,
    summary: "Federal mandate expands automated remote sensing capabilities across the Niger Delta and northern ecological monitoring belts.",
    content: "The Nigerian Institute of Regenerative Resource Management & Protection Technologies (NIRRMPT) has officially commissioned its expanded Phase 2 satellite ecological tracking infrastructure. The upgrade integrates automated IoT sensor clusters with high-resolution satellite telemetry, enabling real-time detection of illegal deforestation, pipeline encroachments, and soil degradation. Director-General Prof. Adeleke O. Danjuma highlighted that this deployment establishes a transparent, NDPR-compliant data backbone for inter-agency intervention."
  },
  {
    id: "news-2",
    title: "Inter-MDA API Network Reaches 100% Portal Compliance",
    category: "Digital Governance",
    date: "September 18, 2026",
    readTime: "3 min read",
    summary: "RESTful integration across 142 R&D projects enables real-time environmental data sharing with ministry partners.",
    content: "NIRRMPT has completed the full synchronization of its RESTful Inter-MDA API Network. This milestone guarantees seamless, secure transmission of environmental compliance metrics, land audit records, and ecological risk ratings between NIRRMPT and state-level ministries. All telemetry streams are encrypted and compliant with federal NDPR privacy standards."
  },
  {
    id: "news-3",
    title: "Regional Directorate Operational Audit in Rivers State Concluded",
    category: "Field Operations",
    date: "September 10, 2026",
    readTime: "5 min read",
    summary: "Field desk inspectors complete thorough assessment of coastal mangrove restoration zones.",
    content: "Field desk teams deployed across Port Harcourt and surrounding coastal belts have concluded the Q3 mangrove regeneration audit. Using real-time geospatial tagging, inspectors mapped over 1,200 hectares of restored tidal flora. Detailed reports are now accessible via the Directorate Operations dashboard."
  },
  {
    id: "news-4",
    title: "Governing Council Approves 2027 Regenerative Technology Roadmap",
    category: "Policy",
    date: "August 28, 2026",
    readTime: "6 min read",
    summary: "Strategic policy framework focuses on AI-driven soil remediation and drone-assisted afforestation.",
    content: "Following executive deliberations chaired by the Governing Council, NIRRMPT has published its policy charter for 2027. Key priorities include deploying autonomous drone fleets for seed distribution in arid zones and establishing local R&D hubs for soil biochemistry analysis."
  }
];

export default function NewsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const categories = ['All Categories', 'Press Release', 'Digital Governance', 'Field Operations', 'Policy'];

  const filteredArticles = ARTICLES.filter(art => {
    const matchesCategory = activeCategory === 'All Categories' || art.category === activeCategory;
    const matchesSearch = art.title.toLowerCase().includes(search.toLowerCase()) || 
                          art.summary.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = ARTICLES.find(art => art.featured);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", color: "#0f172a", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      
      {/* Header Banner */}
      <div style={{ backgroundColor: "#062319", color: "#ffffff", padding: "60px 24px", borderBottom: "4px solid #10b981" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", borderRadius: "20px", padding: "4px 14px", color: "#34d399", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "16px" }}>
            <Newspaper size={14} />
            <span>Official News & Public Bulletins</span>
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>
            Newsroom & Policy Updates
          </h1>
          <p style={{ fontSize: "16px", color: "#94a3b8", maxWidth: "700px", margin: 0, lineHeight: "1.6" }}>
            Official announcements, ecological research charters, press releases, and national environmental technology updates from NIRRMPT.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        
        {/* Search & Category Tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "32px", backgroundColor: "#ffffff", padding: "16px 20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
          
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  backgroundColor: activeCategory === cat ? "#062319" : "#f1f5f9",
                  color: activeCategory === cat ? "#ffffff" : "#475569",
                  transition: "all 0.2s ease"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ position: "relative", minWidth: "280px" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search news & press..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px 9px 36px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                outline: "none",
                backgroundColor: "#f8fafc"
              }}
            />
          </div>
        </div>

        {/* Featured Hero Article */}
        {featured && activeCategory === 'All Categories' && !search && (
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", marginBottom: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
            <div style={{ backgroundColor: "#0b3b2b", padding: "40px", display: "flex", flexDirection: "column", justifyContent: "center", color: "#ffffff" }}>
              <span style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", backgroundColor: "#10b981", color: "#020617", padding: "4px 10px", borderRadius: "4px", width: "fit-content", marginBottom: "16px" }}>
                Featured Announcement
              </span>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "12px", lineHeight: "1.3" }}>
                {featured.title}
              </h2>
              <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.6", marginBottom: "24px" }}>
                {featured.summary}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: "12px", color: "#6ee7b7", marginBottom: "24px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Calendar size={14} /> {featured.date}</span>
                <span>•</span>
                <span>{featured.readTime}</span>
              </div>
              <button 
                onClick={() => setSelectedArticle(featured)}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#10b981", color: "#020617", padding: "12px 20px", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", border: "none", cursor: "pointer", width: "fit-content" }}
              >
                Read Full Release <ArrowRight size={16} />
              </button>
            </div>
            <div style={{ backgroundColor: "#062319", padding: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
              <Newspaper size={120} style={{ color: "rgba(16, 185, 129, 0.2)" }} />
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
          {filteredArticles.map(art => (
            <div 
              key={art.id} 
              style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#059669", backgroundColor: "#ecfdf5", padding: "4px 8px", borderRadius: "4px" }}>
                    {art.category}
                  </span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>{art.date}</span>
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: "bold", color: "#0f172a", marginBottom: "10px", lineHeight: "1.4" }}>
                  {art.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.6", marginBottom: "20px" }}>
                  {art.summary}
                </p>
              </div>

              <div style={{ paddingTop: "16px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>{art.readTime}</span>
                <button 
                  onClick={() => setSelectedArticle(art)}
                  style={{ background: "none", border: "none", color: "#059669", fontWeight: "bold", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  Read Article <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
            <Newspaper size={48} style={{ margin: "0 auto 16px auto", color: "#cbd5e1" }} />
            <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>No articles found</h3>
            <p style={{ fontSize: "14px" }}>Try adjusting your search terms or category filter.</p>
          </div>
        )}

      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", maxWidth: "700px", width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "36px", position: "relative", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <button 
              onClick={() => setSelectedArticle(null)}
              style={{ position: "absolute", top: "20px", right: "20px", background: "#f1f5f9", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#475569" }}
            >
              <X size={20} />
            </button>

            <span style={{ fontSize: "12px", fontWeight: "700", color: "#059669", backgroundColor: "#ecfdf5", padding: "4px 10px", borderRadius: "4px", textTransform: "uppercase" }}>
              {selectedArticle.category}
            </span>

            <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "16px 0 12px 0", lineHeight: "1.3" }}>
              {selectedArticle.title}
            </h2>

            <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#64748b", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0" }}>
              <span>Published: {selectedArticle.date}</span>
              <span>•</span>
              <span>{selectedArticle.readTime}</span>
            </div>

            <div style={{ fontSize: "15px", color: "#334155", lineHeight: "1.8", whiteSpace: "pre-line" }}>
              {selectedArticle.content}
            </div>

            <div style={{ marginTop: "32px", paddingTop: "20px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>NIRRMPT Official Publication</span>
              <button 
                onClick={() => setSelectedArticle(null)}
                style={{ padding: "10px 20px", backgroundColor: "#062319", color: "#ffffff", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", border: "none", cursor: "pointer" }}
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}