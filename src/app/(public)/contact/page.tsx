"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, ShieldCheck, Building } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: 'General Inquiries',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ fullName: '', email: '', department: 'General Inquiries', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", color: "#0f172a", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      
      {/* Header Banner */}
      <div style={{ backgroundColor: "#062319", color: "#ffffff", padding: "60px 24px", borderBottom: "4px solid #10b981" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", borderRadius: "20px", padding: "4px 14px", color: "#34d399", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "16px" }}>
            <Mail size={14} />
            <span>Official Desk & Communications</span>
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>
            Contact & Directorate Helpdesk
          </h1>
          <p style={{ fontSize: "16px", color: "#94a3b8", maxWidth: "700px", margin: 0, lineHeight: "1.6" }}>
            Reach NIRRMPT headquarters, state field desk offices, ecological incident reporting, or technical API support teams.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
          
          {/* Contact Form Card */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "32px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#0f172a", margin: "0 0 8px 0" }}>Submit Official Communication</h3>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 24px 0" }}>
              Enquiries are automatically logged and dispatched to the designated directorate office.
            </p>

            {submitted ? (
              <div style={{ padding: "24px", backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "12px", textAlign: "center", color: "#065f46" }}>
                <CheckCircle2 size={48} style={{ margin: "0 auto 12px auto", color: "#059669" }} />
                <h4 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 6px 0" }}>Communication Dispatched</h4>
                <p style={{ fontSize: "13px", margin: 0 }}>Your ticket reference code has been generated. An agent will review your inquiry shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "6px" }}>Full Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Inspector Gabriel Okon" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }} 
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "6px" }}>Email Address</label>
                  <input 
                    required 
                    type="email" 
                    placeholder="official@domain.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }} 
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "6px" }}>Target Directorate / Department</label>
                  <select 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#ffffff" }}
                  >
                    <option>General Inquiries</option>
                    <option>Directorate of Environmental Research</option>
                    <option>Field Desk Operations</option>
                    <option>Inter-MDA API & Technical Support</option>
                    <option>Media & Public Relations Desk</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "6px" }}>Subject</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Brief summary of inquiry..." 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }} 
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "6px" }}>Message</label>
                  <textarea 
                    required 
                    rows={4} 
                    placeholder="Provide full context or inquiry details..." 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", fontFamily: "sans-serif" }} 
                  />
                </div>

                <button 
                  type="submit" 
                  style={{ padding: "12px", backgroundColor: "#062319", color: "#ffffff", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  <Send size={16} /> Send Official Dispatch
                </button>
              </form>
            )}
          </div>

          {/* Regional Directory & Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Headquarters Card */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#059669", marginBottom: "12px" }}>
                <Building size={20} />
                <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>National Headquarters</h4>
              </div>
              <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 12px 0", lineHeight: "1.5" }}>
                Federal Secretariat Complex, Shehu Shagari Way, Central Business District, Abuja, FCT Nigeria.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "#475569" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><Phone size={14} style={{ color: "#059669" }} /> +234 800 NIRRMPT (Toll Free)</span>
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><Mail size={14} style={{ color: "#059669" }} /> info@nirrmpt.org</span>
              </div>
            </div>

            {/* Regional Desk Card */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#059669", marginBottom: "12px" }}>
                <MapPin size={20} />
                <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>South-South Regional Operations Desk</h4>
              </div>
              <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 12px 0", lineHeight: "1.5" }}>
                Port Harcourt Ecological Monitoring Complex, Rivers State, Nigeria.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "#475569" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><Phone size={14} style={{ color: "#059669" }} /> +234 802 525 2362</span>
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><Clock size={14} style={{ color: "#059669" }} /> Mon - Fri: 08:00 AM - 05:00 PM WAT</span>
              </div>
            </div>

            {/* Security Notice */}
            <div style={{ backgroundColor: "#062319", color: "#ffffff", borderRadius: "14px", padding: "24px", display: "flex", gap: "16px", alignItems: "center" }}>
              <ShieldCheck size={36} style={{ color: "#34d399", flexShrink: 0 }} />
              <div>
                <h5 style={{ fontSize: "14px", fontWeight: "bold", margin: "0 0 4px 0" }}>NDPR Data Privacy Guaranteed</h5>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0, lineHeight: "1.5" }}>
                  All electronic submissions are encrypted under Nigeria Data Protection Regulation standards.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}