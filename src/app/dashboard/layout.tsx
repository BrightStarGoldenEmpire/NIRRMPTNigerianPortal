"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  LogOut,
  ShieldCheck,
  User,
  Users,
  Command,
  Building2,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    };
    fetchSession();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/portal-login");
  };

  const navLinks = [
    { href: "/dashboard/citizen", label: "Public & Partner Hub", icon: User },
    { href: "/dashboard/staff", label: "Staff Field Desk", icon: Users },
    {
      href: "/dashboard/admin",
      label: "Directorate Operations",
      icon: Building2,
    },
    {
      href: "/dashboard/super_admin",
      label: "Super Admin Core",
      icon: ShieldCheck,
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#020617",
        minHeight: "100vh",
        color: "#f8fafc",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: "260px",
          backgroundColor: "#0f172a",
          borderRight: "1px solid #1e293b",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Header Branding */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                padding: "8px",
                borderRadius: "8px",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "#34d399",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Command size={20} />
            </div>
            <div>
              <span
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  fontWeight: 800,
                  color: "#34d399",
                  letterSpacing: "1px",
                  display: "block",
                }}
              >
                NIRRMPT Portal
              </span>
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: 900,
                  margin: 0,
                  color: "#ffffff",
                }}
              >
                Command Desk
              </h2>
            </div>
          </div>

          {/* Nav Items */}
          <nav
            style={{ display: "flex", flexDirection: "column", gap: "6px" }}
          >
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: isActive ? 800 : 600,
                    backgroundColor: isActive ? "#047857" : "transparent",
                    color: isActive ? "#ffffff" : "#94a3b8",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Session Footer */}
        <div
          style={{
            paddingTop: "16px",
            borderTop: "1px solid #1e293b",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "10px",
                color: "#64748b",
                textTransform: "uppercase",
                fontWeight: 800,
                letterSpacing: "0.5px",
              }}
            >
              Authenticated Identity
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#cbd5e1",
                fontFamily: "monospace",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginTop: "2px",
              }}
            >
              {user?.email || "Authorized Officer"}
            </div>
          </div>

          <button
            onClick={handleSignOut}
            style={{
              width: "100%",
              padding: "10px 14px",
              backgroundColor: "rgba(159, 18, 57, 0.3)",
              border: "1px solid rgba(225, 29, 72, 0.4)",
              color: "#fecdd3",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Terminate Session</span>
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main
        style={{
          flex: 1,
          padding: "32px",
          backgroundColor: "#020617",
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}