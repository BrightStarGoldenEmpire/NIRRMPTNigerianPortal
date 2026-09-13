// src/app/page.tsx
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'NIRRMPT Nigeria | Public Gateway & Enterprise Portal',
  description: 'Nigerian Institute for Regenerative Resources Management & Protection Technologies.',
};

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header with Navigation Bar */}
      <header style={{ 
        background: '#0b1329', 
        borderBottom: '1px solid #1e293b', 
        padding: '1rem 5%', 
        display: 'flex', 
        justify: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        {/* Logo & Institute Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: '#1e293b', 
            borderRadius: '8px', 
            border: '1px dashed #38bdf8', 
            display: 'flex', 
            alignItems: 'center', 
            justify: 'center', 
            color: '#38bdf8', 
            fontWeight: 'bold', 
            fontSize: '0.75rem' 
          }}>
            LOGO
          </div>
          <div>
            <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '1.1rem', letterSpacing: '0.02em', display: 'block' }}>
              NIRRMPT
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
              Official Enterprise Gateway
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/" style={{ color: '#38bdf8', fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none' }}>
            Home
          </Link>
          <Link href="/leadership" style={{ color: '#cbd5e1', fontWeight: '500', fontSize: '0.9rem', textDecoration: 'none' }}>
            Leadership
          </Link>
          <Link href="/departments" style={{ color: '#cbd5e1', fontWeight: '500', fontSize: '0.9rem', textDecoration: 'none' }}>
            Departments
          </Link>
          <Link href="/news" style={{ color: '#cbd5e1', fontWeight: '500', fontSize: '0.9rem', textDecoration: 'none' }}>
            News & Press
          </Link>
          <Link href="/login" style={{ 
            padding: '0.5rem 1.2rem', 
            background: '#2563eb', 
            color: '#fff', 
            borderRadius: '6px', 
            fontWeight: '600', 
            fontSize: '0.875rem', 
            textDecoration: 'none' 
          }}>
            Portal Access
          </Link>
        </nav>
      </header>

      {/* Hero Section with MP4 Video Background */}
      <section style={{ 
        position: 'relative', 
        minHeight: '520px', 
        display: 'flex', 
        alignItems: 'center', 
        justify: 'center', 
        overflow: 'hidden', 
        textAlign: 'center', 
        color: '#fff' 
      }}>
        {/* Background Video (Replace /hero-background.mp4 with your video path in /public) */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            transform: 'translate(-50%, -50%)', 
            zIndex: 0 
          }}
        >
          <source src="/hero-background.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay for Text Legibility */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'rgba(15, 23, 42, 0.75)', 
          zIndex: 1 
        }} />

        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 2, padding: '4rem 5%', maxWidth: '900px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', lineHeight: '1.2' }}>
            Nigerian Institute for Regenerative Resources Management & Protection Technologies
          </h1>
          <p style={{ margin: '0 auto 2rem', color: '#cbd5e1', fontSize: '1.15rem', lineHeight: '1.6' }}>
            Driving environmental compliance, national technological asset management, and digital ecosystem protection across Nigeria.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" style={{ padding: '0.86rem 2rem', background: '#2563eb', color: '#fff', borderRadius: '6px', fontWeight: '600', textDecoration: 'none' }}>
              Access Portal Gateway
            </Link>
            <Link href="/departments" style={{ padding: '0.86rem 2rem', border: '1px solid #64748b', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: '6px', fontWeight: '600', textDecoration: 'none' }}>
              Explore Departments
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section style={{ padding: '4rem 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '2rem', textAlign: 'center' }}>
          Institutional Services & Portals
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '2rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>Leadership & Council</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Meet the executive directorate, governing council, and institutional heads.
            </p>
            <Link href="/leadership" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>
              View Leadership &rarr;
            </Link>
          </div>

          <div style={{ padding: '2rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>Technical Departments</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Explore division frameworks, policy units, and technology directorates.
            </p>
            <Link href="/departments" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>
              View Departments &rarr;
            </Link>
          </div>

          <div style={{ padding: '2rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>News & Press Releases</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Official press statements, regulatory updates, and national announcements.
            </p>
            <Link href="/news" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>
              Read Latest Updates &rarr;
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}