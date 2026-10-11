"use client";

import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Users, ArrowRight, CheckCircle2, X, Filter, Radio } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  date: string;
  day: string;
  month: string;
  time: string;
  location: string;
  type: 'Summit' | 'Workshop' | 'Townhall' | 'Audit';
  status: 'Upcoming' | 'Completed';
  capacity: string;
  description: string;
}

const EVENTS: EventItem[] = [
  {
    id: "evt-1",
    title: "National Ecological Technology & Resource Summit 2026",
    date: "October 14-16, 2026",
    day: "14",
    month: "OCT",
    time: "09:00 AM - 04:00 PM WAT",
    location: "International Conference Centre, Abuja FCT",
    type: "Summit",
    status: "Upcoming",
    capacity: "500 Delegates",
    description: "Annual federal symposium bringing together state directors, remote sensing experts, and environmental policy stakeholders to align on 2027 ecological charter benchmarks."
  },
  {
    id: "evt-2",
    title: "Field Desk Telemetry & GIS Mapping Workshop",
    date: "November 05, 2026",
    day: "05",
    month: "NOV",
    time: "10:00 AM - 02:00 PM WAT",
    location: "NIRRMPT Regional Headquarters, Port Harcourt",
    type: "Workshop",
    status: "Upcoming",
    capacity: "120 Engineers",
    description: "Technical training session for field agents covering handheld IoT calibration, satellite telemetry sync, and instant audit reporting."
  },
  {
    id: "evt-3",
    title: "Niger Delta Mangrove Restoration Public Townhall",
    date: "December 02, 2026",
    day: "02",
    month: "DEC",
    time: "11:00 AM - 03:00 PM WAT",
    location: "Civic Centre, Yenagoa, Bayelsa State",
    type: "Townhall",
    status: "Upcoming",
    capacity: "300 Participants",
    description: "Open community dialogue on coastal land preservation, citizen reporting channels, and ecological compensation frameworks."
  },
  {
    id: "evt-4",
    title: "Q2 Inter-MDA Environmental Policy Roundtable",
    date: "August 12, 2026",
    day: "12",
    month: "AUG",
    time: "10:00 AM - 01:00 PM WAT",
    location: "Virtual Directorate Hub",
    type: "Audit",
    status: "Completed",
    capacity: "80 Officials",
    description: "Quarterly review with partner ministries on NDPR data compliance, API connectivity, and regional resource tracking."
  }
];

export default function EventsPage() {
  const [tab, setTab] = useState<'Upcoming' | 'Completed'>('Upcoming');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [registered, setRegistered] = useState<boolean>(false);
  const [regForm, setRegForm] = useState({ name: '', email: '', organization: '' });

  const filteredEvents = EVENTS.filter(e => e.status === tab);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistered(true);
    setTimeout(() => {
      setRegistered(false);
      setSelectedEvent(null);
      setRegForm({ name: '', email: '', organization: '' });
    }, 2500);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", color: "#0f172a", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      
      {/* Header Banner */}
      <div style={{ backgroundColor: "#062319", color: "#ffffff", padding: "60px 24px", borderBottom: "4px solid #10b981" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", borderRadius: "20px", padding: "4px 14px", color: "#34d399", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "16px" }}>
            <CalendarIcon size={14} />
            <span>Federal Schedules & Forums</span>
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>
            Events, Summits & Field Workshops
          </h1>
          <p style={{ fontSize: "16px", color: "#94a3b8", maxWidth: "700px", margin: 0, lineHeight: "1.6" }}>
            Participate in NIRRMPT public townhalls, technical training workshops, and national environmental technology conferences.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        
        {/* Toggle Tabs */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "32px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
          <button
            onClick={() => setTab('Upcoming')}
            style={{
              padding: "10px 24px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "bold",
              fontSize: "14px",
              cursor: "pointer",
              backgroundColor: tab === 'Upcoming' ? "#062319" : "#ffffff",
              color: tab === 'Upcoming' ? "#ffffff" : "#64748b",
              boxShadow: tab === 'Upcoming' ? "0 2px 4px rgba(0,0,0,0.1)" : "none"
            }}
          >
            Upcoming Events ({EVENTS.filter(e => e.status === 'Upcoming').length})
          </button>
          <button
            onClick={() => setTab('Completed')}
            style={{
              padding: "10px 24px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "bold",
              fontSize: "14px",
              cursor: "pointer",
              backgroundColor: tab === 'Completed' ? "#062319" : "#ffffff",
              color: tab === 'Completed' ? "#ffffff" : "#64748b"
            }}
          >
            Past Events
          </button>
        </div>

        {/* Events List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {filteredEvents.map(evt => (
            <div 
              key={evt.id} 
              style={{ backgroundColor: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "28px", display: "grid", gridTemplateColumns: "100px 1fr auto", gap: "24px", alignItems: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}
            >
              {/* Date Badge */}
              <div style={{ backgroundColor: "#062319", color: "#ffffff", borderRadius: "12px", padding: "16px 8px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ fontSize: "28px", fontWeight: "800", lineHeight: "1", color: "#34d399" }}>{evt.day}</span>
                <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" }}>{evt.month}</span>
              </div>

              {/* Info */}
              <div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "bold", backgroundColor: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", padding: "2px 8px", borderRadius: "4px" }}>
                    {evt.type}
                  </span>
                  <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={13} /> {evt.time}
                  </span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a", margin: "0 0 8px 0" }}>{evt.title}</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 12px 0", lineHeight: "1.5" }}>{evt.description}</p>
                
                <div style={{ display: "flex", gap: "20px", fontSize: "12px", color: "#475569", flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><MapPin size={14} style={{ color: "#059669" }} /> {evt.location}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Users size={14} style={{ color: "#059669" }} /> {evt.capacity}</span>
                </div>
              </div>

              {/* Action */}
              <div>
                {evt.status === 'Upcoming' ? (
                  <button 
                    onClick={() => setSelectedEvent(evt)}
                    style={{ padding: "12px 20px", backgroundColor: "#059669", color: "#ffffff", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    Register / Reserve
                  </button>
                ) : (
                  <span style={{ padding: "8px 16px", backgroundColor: "#f1f5f9", color: "#94a3b8", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                    Concluded
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Registration Modal */}
      {selectedEvent && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", maxWidth: "520px", width: "100%", padding: "32px", position: "relative" }}>
            
            <button 
              onClick={() => setSelectedEvent(null)}
              style={{ position: "absolute", top: "16px", right: "16px", background: "#f1f5f9", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <X size={18} />
            </button>

            {!registered ? (
              <>
                <h3 style={{ fontSize: "20px", fontWeight: "bold", margin: "0 0 6px 0", color: "#0f172a" }}>Delegate Registration</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 20px 0" }}>{selectedEvent.title}</p>

                <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>Full Name</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. Dr. John Nwosu" 
                      value={regForm.name}
                      onChange={(e) => setRegForm({...regForm, name: e.target.value})}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }} 
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>Official Email Address</label>
                    <input 
                      required 
                      type="email" 
                      placeholder="name@agency.gov.ng" 
                      value={regForm.email}
                      onChange={(e) => setRegForm({...regForm, email: e.target.value})}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }} 
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>Organization / Ministry</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. Federal Ministry of Environment" 
                      value={regForm.organization}
                      onChange={(e) => setRegForm({...regForm, organization: e.target.value})}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }} 
                    />
                  </div>

                  <button 
                    type="submit" 
                    style={{ marginTop: "10px", padding: "12px", backgroundColor: "#062319", color: "#ffffff", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", border: "none", cursor: "pointer" }}
                  >
                    Confirm Registration Pass
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <CheckCircle2 size={56} style={{ color: "#10b981", margin: "0 auto 16px auto" }} />
                <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#0f172a", margin: "0 0 8px 0" }}>Pass Reserved Successfully!</h3>
                <p style={{ fontSize: "13px", color: "#64748b" }}>An official event confirmation key has been dispatched to {regForm.email}.</p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}