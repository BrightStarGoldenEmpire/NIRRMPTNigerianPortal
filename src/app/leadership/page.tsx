// src/app/leadership/page.tsx
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Leadership & Board | NIRRMPT Nigeria',
  description: 'Executive leadership, governing council, and institutional directors of NIRRMPT.',
};

export default function LeadershipPage() {
  const leaders = [
    {
      name: 'Executive Directorate',
      role: 'Director-General / Chief Executive Officer',
      department: 'Executive Office',
      icon: 'fa-user-tie',
    },
    {
      name: 'Directorate of Regenerative Technologies',
      role: 'Director of Environmental Research & Innovation',
      department: 'R&D Division',
      icon: 'fa-microscope',
    },
    {
      name: 'Directorate of Resource Protection',
      role: 'Director of Compliance & Monitoring',
      department: 'Regulatory Compliance',
      icon: 'fa-shield-halved',
    },
    {
      name: 'Directorate of Information & Digital Assets',
      role: 'Director of ICT & Data Systems',
      department: 'Technology Infrastructure',
      icon: 'fa-network-wired',
    },
  ];

  return (
    <main className="container" style={{ padding: '3rem 5%' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title" style={{ fontSize: '2rem' }}>Leadership & Governance</h1>
          <p className="section-desc">Governing Council, Executive Directorate, and Departmental Heads</p>
        </div>
        <Link href="/" className="btn btn-outline" style={{ background: 'var(--primary)', color: 'white' }}>
          &larr; Back to Public Gateway
        </Link>
      </div>

      <div className="enterprise-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {leaders.map((leader, index) => (
          <div key={index} className="grid-card" style={{ padding: '1.8rem', borderRadius: '8px', background: '#fff', border: '1px solid #e2e8f0' }}>
            <div className="card-icon" style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1rem' }}>
              <i className={`fa-solid ${leader.icon}`}></i>
            </div>
            <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{leader.name}</h3>
            <p className="card-desc" style={{ fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: '600', marginBottom: '0.4rem' }}>{leader.role}</p>
            <span style={{ fontSize: '0.8rem', background: 'var(--gray-100)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: '#4a5568' }}>
              {leader.department}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}