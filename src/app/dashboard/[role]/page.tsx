"use client";

import React, { use, useState } from "react";
import {
  ShieldAlert,
  Gauge,
  Users,
  Globe,
  FileText,
  MapPin,
  CheckCircle2,
  Clock,
  PlusCircle,
  Database,
  Activity,
  UserCheck,
  Newspaper,
  Calendar,
  LifeBuoy,
  Radio,
  UploadCloud,
  Bell,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
} from "lucide-react";

export default function DynamicDashboardPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  // Normalize parameters to match both super-admin and super_admin routes
  const rawRole = resolvedParams.role || "citizen";
  const role = rawRole.replace("-", "_");
  const [activeTab, setActiveTab] = useState("overview");

  const portalThemes: Record<
    string,
    {
      title: string;
      badge: string;
      subtitle: string;
      icon: typeof ShieldAlert;
      color: string;
      bg: string;
      border: string;
      metrics: Array<{ label: string; value: string; subtext: string; icon: typeof Activity }>;
      workflows: Array<{ title: string; desc: string; icon: typeof FileText; action: string }>;
    }
  > = {
    super_admin: {
      title: "Super Admin Command Center",
      badge: "ROOT PRIVILEGES",
      subtitle: "NIRRMPT System Security, Audit Logs & High-Level Telemetry Controls",
      icon: ShieldAlert,
      color: "#fb7185",
      bg: "rgba(244, 63, 94, 0.15)",
      border: "rgba(244, 63, 94, 0.3)",
      metrics: [
        { label: "ACTIVE PERMITS", value: "128", subtext: "Pending Review", icon: Clock },
        { label: "APPROVED EIA REPORTS", value: "1,042", subtext: "Verified Records", icon: CheckCircle2 },
        { label: "GIS MAPPED ZONES", value: "36", subtext: "States Integrated", icon: MapPin },
      ],
      workflows: [
        { title: "System Security & IAM", desc: "Manage root RBAC policies, API tokens, and admin credentials.", icon: Database, action: "Manage IAM" },
        { title: "Audit Log Inspection", desc: "Monitor active telemetry feeds and infrastructure logs.", icon: ShieldCheck, action: "View Logs" },
      ],
    },
    admin: {
      title: "Directorate Management Operations",
      badge: "TIER-2 OVERSIGHT • DIRECTORATE LEAD",
      subtitle: "Review press releases, coordinate regional summits, and manage support desk queues.",
      icon: Gauge,
      color: "#fbbf24",
      bg: "rgba(245, 158, 11, 0.15)",
      border: "rgba(245, 158, 11, 0.3)",
      metrics: [
        { label: "PENDING ARTICLES", value: "5 Drafts", subtext: "Awaiting press review", icon: Newspaper },
        { label: "UPCOMING EVENTS", value: "3 Summits", subtext: "Scheduled for Q4", icon: Calendar },
        { label: "PUBLIC TICKETS", value: "18 Open", subtext: "Support desk inquiries", icon: LifeBuoy },
        { label: "ACTIVE FIELD STAFF", value: "42 Officers", subtext: "Logging GIS records", icon: Radio },
      ],
      workflows: [
        { title: "News & Press Releases", desc: "Review submitted articles from staff officers prior to portal publication.", icon: Newspaper, action: "Review Articles" },
        { title: "Events & Summits", desc: "Manage registration links, speaker lists, and venue logistics.", icon: Calendar, action: "Schedule Event" },
        { title: "Public Support Desk", desc: "Assign and respond to technical inquiries from public citizens.", icon: LifeBuoy, action: "Open Queue" },
      ],
    },
    staff: {
      title: "Staff Operational Workspace",
      badge: "TIER-3 OPERATIONS • FIELD & RESEARCH DESK",
      subtitle: "Execute field surveys, capture environmental assets, and submit publications.",
      icon: Users,
      color: "#60a5fa",
      bg: "rgba(59, 130, 246, 0.15)",
      border: "rgba(59, 130, 246, 0.3)",
      metrics: [
        { label: "MY SUBMISSIONS", value: "12 Items", subtext: "8 published, 4 under review", icon: FileText },
        { label: "ASSIGNED FIELD SURVEYS", value: "4 Active", subtext: "Resource monitoring", icon: MapPin },
        { label: "MEDIA UPLOADS", value: "26 Photos", subtext: "Added to public gallery", icon: UploadCloud },
        { label: "INTERNAL BULLETINS", value: "2 Unread", subtext: "Directives from Director", icon: Bell },
      ],
      workflows: [
        { title: "Submit News Draft", desc: "Prepare press releases or field reports for directorate approval.", icon: Newspaper, action: "Draft News" },
        { title: "Upload Gallery Assets", desc: "Add operational photographs and field research videos to portal repository.", icon: UploadCloud, action: "Upload Assets" },
        { title: "GIS Data Entry", desc: "Log environmental sample readings and regional coordinates.", icon: MapPin, action: "Log GIS" },
      ],
    },
    citizen: {
      title: "Citizen & Public Services Hub",
      badge: "PUBLIC ACCESS",
      subtitle: "Environmental Impact Assessment Registrations & Resource Tracking",
      icon: Globe,
      color: "#34d399",
      bg: "rgba(16, 185, 129, 0.15)",
      border: "rgba(16, 185, 129, 0.3)",
      metrics: [
        { label: "ACTIVE APPLICATIONS", value: "2", subtext: "In Inspection Phase", icon: Clock },
        { label: "ISSUED CERTIFICATES", value: "1", subtext: "Valid EIA Approval", icon: CheckCircle2 },
        { label: "REGISTERED ZONES", value: "14", subtext: "Public Access Sectors", icon: MapPin },
      ],
      workflows: [
        { title: "Apply for EIA Permit", desc: "Submit environmental clearance applications for operational projects.", icon: PlusCircle, action: "Start Application" },
        { title: "Public Resource Portal", desc: "Explore regional environmental data and institute announcements.", icon: Globe, action: "Browse Data" },
      ],
    },
  };

  const theme = portalThemes[role] || portalThemes.citizen;
  const RoleIcon = theme.icon;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Dynamic Command Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
          borderRadius: "16px",
          backgroundColor: "#0f172a",
          border: "1px solid #1e293b",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              padding: "12px",
              borderRadius: "12px",
              backgroundColor: theme.bg,
              border: `1px solid ${theme.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RoleIcon size={24} color={theme.color} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ fontSize: "20px", fontWeight: 800, margin: 0, color: "#ffffff" }}>
                {theme.title}
              </h1>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  padding: "3px 10px",
                  borderRadius: "12px",
                  backgroundColor: theme.bg,
                  border: `1px solid ${theme.border}`,
                  color: theme.color,
                  letterSpacing: "0.5px",
                }}
              >
                {theme.badge}
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "#94a3b8", margin: "4px 0 0 0" }}>
              {theme.subtitle}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              padding: "6px 12px",
              borderRadius: "8px",
              color: "#94a3b8",
              fontSize: "12px",
            }}
          >
            <Search size={14} />
            <span>Search records...</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "24px" }}>
        {/* Sidebar Navigation */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 14px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 700,
              border: activeTab === "overview" ? "1px solid #334155" : "1px solid transparent",
              backgroundColor: activeTab === "overview" ? "#1e293b" : "transparent",
              color: activeTab === "overview" ? "#ffffff" : "#94a3b8",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <Activity size={16} /> Command Overview
          </button>

          <button
            onClick={() => setActiveTab("workflows")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 14px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 700,
              border: activeTab === "workflows" ? "1px solid #334155" : "1px solid transparent",
              backgroundColor: activeTab === "workflows" ? "#1e293b" : "transparent",
              color: activeTab === "workflows" ? "#ffffff" : "#94a3b8",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <FileText size={16} /> Operational Workflows
          </button>

          <button
            onClick={() => setActiveTab("gis")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 14px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 700,
              border: activeTab === "gis" ? "1px solid #334155" : "1px solid transparent",
              backgroundColor: activeTab === "gis" ? "#1e293b" : "transparent",
              color: activeTab === "gis" ? "#ffffff" : "#94a3b8",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <MapPin size={16} /> GIS Resource Map
          </button>

          {role === "super_admin" && (
            <button
              onClick={() => setActiveTab("users")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 14px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 700,
                border: activeTab === "users" ? "1px solid #334155" : "1px solid transparent",
                backgroundColor: activeTab === "users" ? "#1e293b" : "transparent",
                color: activeTab === "users" ? "#ffffff" : "#94a3b8",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <UserCheck size={16} /> System Control & Audit
            </button>
          )}
        </aside>

        {/* Dynamic Panel Workspace */}
        <div>
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "#ffffff" }}>
                  Active Metrics & Real-time Telemetry
                </h2>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "#64748b", fontSize: "12px" }}>
                  <Filter size={14} /> Filter Range: <strong>Last 30 Days</strong>
                </div>
              </div>

              {/* Dynamic KPI Metric Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${theme.metrics.length > 3 ? 4 : 3}, 1fr)`,
                  gap: "16px",
                }}
              >
                {theme.metrics.map((item, index) => {
                  const ItemIcon = item.icon;
                  return (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e293b",
                        padding: "20px",
                        borderRadius: "12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", fontWeight: 800, color: "#94a3b8" }}>
                          {item.label}
                        </span>
                        <ItemIcon size={16} color={theme.color} />
                      </div>
                      <div style={{ fontSize: "28px", fontWeight: 900, color: "#ffffff" }}>
                        {item.value}
                      </div>
                      <span style={{ fontSize: "11px", color: theme.color, fontWeight: 700 }}>
                        {item.subtext}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Enterprise Workflows & Task Dispatch */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "8px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 800, margin: 0, color: "#ffffff" }}>
                  Publication & Review Workflows
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                  {theme.workflows.map((wf, idx) => {
                    const WfIcon = wf.icon;
                    return (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: "#0f172a",
                          border: "1px solid #1e293b",
                          borderRadius: "12px",
                          padding: "20px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          gap: "16px",
                        }}
                      >
                        <div style={{ display: "flex", gap: "14px" }}>
                          <div
                            style={{
                              padding: "10px",
                              borderRadius: "10px",
                              backgroundColor: "rgba(255,255,255,0.03)",
                              border: "1px solid #1e293b",
                              height: "fit-content",
                            }}
                          >
                            <WfIcon size={20} color={theme.color} />
                          </div>
                          <div>
                            <h4 style={{ fontSize: "14px", fontWeight: 800, margin: "0 0 4px 0", color: "#ffffff" }}>
                              {wf.title}
                            </h4>
                            <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
                              {wf.desc}
                            </p>
                          </div>
                        </div>

                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "12px",
                            cursor: "pointer",
                            width: "fit-content",
                          }}
                        >
                          {wf.action} <ArrowRight size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "workflows" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "#ffffff" }}>
                  Operational Filings & Queue Management
                </h2>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    backgroundColor: "#10b981",
                    color: "#020617",
                    fontWeight: 800,
                    fontSize: "12px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <PlusCircle size={15} /> Create Entry
                </button>
              </div>

              <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#1e293b", color: "#94a3b8" }}>
                      <th style={{ padding: "12px 16px" }}>REF ID</th>
                      <th style={{ padding: "12px 16px" }}>TASK TITLE</th>
                      <th style={{ padding: "12px 16px" }}>CATEGORY</th>
                      <th style={{ padding: "12px 16px" }}>STATUS</th>
                      <th style={{ padding: "12px 16px" }}>DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #1e293b", color: "#cbd5e1" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 700, fontFamily: "monospace" }}>#NIR-8092</td>
                      <td style={{ padding: "12px 16px" }}>Environmental Assessment Field Review</td>
                      <td style={{ padding: "12px 16px" }}>Soil & Water</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "3px 8px", borderRadius: "10px", backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", fontWeight: 700, fontSize: "10px" }}>
                          Under Review
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#94a3b8" }}>Sept 17, 2026</td>
                    </tr>
                    <tr style={{ color: "#cbd5e1" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 700, fontFamily: "monospace" }}>#NIR-7411</td>
                      <td style={{ padding: "12px 16px" }}>Renewable Energy Clearance Directive</td>
                      <td style={{ padding: "12px 16px" }}>Forestry Conservation</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "3px 8px", borderRadius: "10px", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", fontWeight: 700, fontSize: "10px" }}>
                          Approved
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#94a3b8" }}>Sept 10, 2026</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "gis" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "#ffffff" }}>
                Interactive GIS Resource & Telemetry Grid
              </h2>
              <div
                style={{
                  height: "320px",
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "12px",
                  color: "#64748b",
                }}
              >
                <MapPin size={40} color={theme.color} />
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#cbd5e1" }}>
                  GIS Telemetry Layer Active
                </span>
                <span style={{ fontSize: "12px" }}>
                  Spatial coordinates synced for designated environmental conservation sectors.
                </span>
              </div>
            </div>
          )}

          {activeTab === "users" && role === "super_admin" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "#ffffff" }}>
                System Control & Audit Logs
              </h2>
              <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#fb7185", fontWeight: 700, fontSize: "13px", marginBottom: "8px" }}>
                  <Database size={16} /> Root Access Terminal Active
                </div>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                  Manage administrative roles, audit security logs, and deploy system updates across all sub-portals.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}