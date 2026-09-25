"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Gauge,
  Users,
  Globe,
  Lock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Mail,
} from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get("role") || "citizen";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const portalConfigs: Record<
    string,
    {
      title: string;
      subtitle: string;
      badge: string;
      icon: typeof ShieldAlert;
      accentColor: string;
      badgeBg: string;
      badgeBorder: string;
    }
  > = {
    super_admin: {
      title: "Super Admin Gateway",
      subtitle: "Federal Staff & Inter-MDA Secure Authorization",
      badge: "SUPER ADMIN ACCESS",
      icon: ShieldAlert,
      accentColor: "#fb7185",
      badgeBg: "rgba(244, 63, 94, 0.15)",
      badgeBorder: "rgba(244, 63, 94, 0.3)",
    },
    admin: {
      title: "Administrator Portal",
      subtitle: "Departmental Oversight & Environmental Assessment Gateway",
      badge: "ADMINISTRATIVE ACCESS",
      icon: Gauge,
      accentColor: "#fbbf24",
      badgeBg: "rgba(245, 158, 11, 0.15)",
      badgeBorder: "rgba(245, 158, 11, 0.3)",
    },
    staff: {
      title: "Institute Staff Portal",
      subtitle: "Internal Research Workspace & Document Repository",
      badge: "STAFF WORKSPACE",
      icon: Users,
      accentColor: "#60a5fa",
      badgeBg: "rgba(59, 130, 246, 0.15)",
      badgeBorder: "rgba(59, 130, 246, 0.3)",
    },
    citizen: {
      title: "Public & Citizen Portal",
      subtitle: "EIA Applications, Resource Permits & FOI Submissions",
      badge: "PUBLIC SERVICES",
      icon: Globe,
      accentColor: "#34d399",
      badgeBg: "rgba(16, 185, 129, 0.15)",
      badgeBorder: "rgba(16, 185, 129, 0.3)",
    },
  };

  const config = portalConfigs[role] || portalConfigs.citizen;
  const PortalIcon = config.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate enterprise auth delay before dashboard redirection
    setTimeout(() => {
      setLoading(false);
      router.push(`/dashboard/${role}`);
    }, 1200);
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
        fontFamily: "sans-serif",
        color: "#f8fafc",
      }}
    >
      {/* Return Navigation */}
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
            transition: "color 0.2s ease",
          }}
        >
          <ArrowLeft size={16} /> Return to Gateway Selection
        </Link>
      </div>

      {/* Main Container Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "16px",
          padding: "36px 32px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              backgroundColor: config.badgeBg,
              border: `1px solid ${config.badgeBorder}`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <PortalIcon size={28} color={config.accentColor} />
          </div>

          <div
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "20px",
              backgroundColor: config.badgeBg,
              border: `1px solid ${config.badgeBorder}`,
              color: config.accentColor,
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "1px",
              marginBottom: "10px",
            }}
          >
            {config.badge}
          </div>

          <h1
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#ffffff",
              margin: "0 0 6px 0",
              letterSpacing: "-0.5px",
            }}
          >
            {config.title}
          </h1>
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, lineHeight: "1.5" }}>
            {config.subtitle}
          </p>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Email Field */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "#cbd5e1",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Service Email Address
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
                placeholder={role === "citizen" ? "citizen@example.com" : "officer@nirrmpt.gov.ng"}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  backgroundColor: "#020617",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#cbd5e1",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Password
              </label>
              <a href="#" style={{ fontSize: "11px", color: config.accentColor, textDecoration: "none", fontWeight: 600 }}>
                Forgot?
              </a>
            </div>
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
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
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
              backgroundColor: config.accentColor,
              color: "#020617",
              border: "none",
              borderRadius: "8px",
              fontWeight: 800,
              fontSize: "14px",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "opacity 0.2s ease",
              opacity: loading ? 0.7 : 1,
            }}
          >
            <span>{loading ? "Authenticating Session..." : "Authenticate & Access"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Card Footer Security Note */}
        <div
          style={{
            marginTop: "28px",
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
          <span>Encrypted via 256-Bit SSL / NDPR Compliant</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ color: "#fff", padding: "20px", textAlign: "center" }}>Loading Gateway...</div>}>
      <LoginForm />
    </Suspense>
  );
}