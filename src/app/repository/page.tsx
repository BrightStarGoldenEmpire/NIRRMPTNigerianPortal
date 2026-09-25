"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

interface Publication {
  id: string;
  title: string;
  category: "policy" | "journal" | "manual" | "gis";
  author: string;
  date: string;
  fileSize: string;
}

const publicationData: Publication[] = [
  { id: "pub-1", title: "National Framework for Regenerative Soil Management (2026)", category: "policy", author: "NIRRMPT Research Directorate", date: "August 2026", fileSize: "4.2 MB" },
  { id: "pub-2", title: "Bioremediation of Crude-Impacted Coastal Ecosystems in Niger Delta", category: "journal", author: "Dr. Amina Bello et al.", date: "July 2026", fileSize: "8.1 MB" },
  { id: "pub-3", title: "GIS Mapping Protocols for Federal Land & Mineral Assets", category: "gis", author: "Engr. David Okon", date: "June 2026", fileSize: "12.5 MB" },
  { id: "pub-4", title: "Statutory Environmental Impact Assessment Guidelines (EIA v3)", category: "manual", author: "EIA Compliance Bureau", date: "May 2026", fileSize: "2.8 MB" },
];

export default function RepositoryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredPublications = useMemo(() => {
    return publicationData.filter((doc) => {
      const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
      const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) || doc.author.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <main className="container" style={{ paddingTop: "2rem", paddingBottom: "3rem" }}>
      <div className="section-header">
        <h1 className="section-title">Digital Scientific Repository</h1>
        <p className="section-desc">Searchable publications, peer-reviewed journals, and regulatory standards.</p>
      </div>

      {/* Dynamic Filter & Search Control Panel */}
      <div style={{ background: "white", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--gray-200)", marginBottom: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", alignItems: "center" }}>
          
          {/* Dynamic Text Filter */}
          <input
            type="text"
            placeholder="Search titles, authors, or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--gray-300)", borderRadius: "var(--radius-sm)", fontSize: "0.9rem", outline: "none" }}
          />

          {/* Category Selector */}
          <div className="filter-bar">
            {[
              { key: "all", label: "All Docs" },
              { key: "policy", label: "Policy" },
              { key: "journal", label: "Journals" },
              { key: "gis", label: "GIS Manuals" },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`filter-btn ${selectedCategory === cat.key ? "active" : ""}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Results Grid */}
      {filteredPublications.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredPublications.map((doc) => (
            <div key={doc.id} className="grid-card" style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span style={{ background: "var(--primary)", color: "white", fontSize: "0.7rem", padding: "3px 8px", borderRadius: 4, fontWeight: 700, textTransform: "uppercase" }}>
                  {doc.category}
                </span>
                <h3 style={{ fontSize: "1.1rem", color: "var(--dark)", marginTop: "6px" }}>{doc.title}</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--gray-600)" }}>Author: {doc.author} | Date: {doc.date}</p>
              </div>
              <button className="btn btn-primary" onClick={() => alert(`Downloading ${doc.title} (${doc.fileSize})...`)}>
                <i className="fa-solid fa-download"></i> PDF ({doc.fileSize})
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "3rem 1rem", background: "white", borderRadius: "var(--radius-md)", border: "1px dashed var(--gray-300)" }}>
          <i className="fa-solid fa-folder-open" style={{ fontSize: "2.5rem", color: "var(--gray-300)", marginBottom: "1rem" }}></i>
          <h3>No Publications Found</h3>
          <p style={{ color: "var(--gray-600)", fontSize: "0.88rem" }}>Try adjusting your search terms or active filters.</p>
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <Link href="/" className="btn btn-outline">&larr; Return to Public Gateway</Link>
      </div>
    </main>
  );
}