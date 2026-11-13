"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Building2,
  Mail,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { loginAction } from "@/app/actions/auth";

export default function PortalLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const res = await loginAction(formData);

    if (res && res.success && res.redirectUrl) {
      // Force direct browser navigation straight into the role's dashboard
      window.location.href = res.redirectUrl;
    } else {
      setErrorMsg(res?.error || "Invalid credentials. Please verify your email and password.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#020617",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px 16px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#f8fafc",
      }}
    >
      {/* Return Home Link */}
      <div style={{ width: "100%", maxWidth: "460px", marginBottom: "20px" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#94a3b8",
            fontSize: "13px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          ← Return to Public Homepage
        </Link>
      </div>

      {/* Main Login Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "20px",
          padding: "36px 32px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
              color: "#34d399",
            }}
          >
            <Building2 size={28} />
          </div>

          <h1
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#ffffff",
              margin: "0 0 6px 0",
              letterSpacing: "-0.5px",
            }}
          >
            NIRRMPT Enterprise Authentication
          </h1>
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, lineHeight: "1.5" }}>
            Single Sign-On (SSO) for Super Admins, Directorate Leadership, Field Staff & Citizens
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#f87171",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Email */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "#cbd5e1",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Account Email Address
            </label>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Mail size={16} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@nirrmpt.org"
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  backgroundColor: "#020617",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  color: "#ffffff",
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "#cbd5e1",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <KeyRound size={16} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  backgroundColor: "#020617",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  color: "#ffffff",
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "8px",
              width: "100%",
              padding: "12px",
              backgroundColor: "#10b981",
              color: "#020617",
              border: "none",
              borderRadius: "10px",
              fontWeight: 800,
              fontSize: "13px",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "opacity 0.2s ease",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                <span>Authenticating & Routing...</span>
              </>
            ) : (
              <>
                <span>Authenticate & Access Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Security Footer */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px solid #1e293b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            color: "#64748b",
            fontSize: "11px",
          }}
        >
          <ShieldCheck size={14} color="#10b981" />
          <span>Statutory 256-Bit Encrypted Session · NDPR Compliant</span>
        </div>
      </div>
    </div>
  );
}