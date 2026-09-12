// src/app/departments/page.tsx
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Departments & Units | NIRRMPT Nigeria',
  description: 'Operational divisions, technology directorates, and research units of NIRRMPT.',
};

export default function DepartmentsPage() {
  const departments = [
    {
      title: 'Regenerative Resource Technology',
      code: 'RRT-DIV',
      desc: 'Focuses on sustainable resource development, biotechnology applications, and ecological restoration frameworks.',
      icon: 'fa-leaf',
    },
    {
      title: 'Environmental Protection & Compliance',
      code: 'EPC-DIV',
      desc: 'Monitors industrial compliance, manages environmental safety protocols, and enforces technological standards.',
      icon: 'fa-shield-virus',
    },
    {
      title: 'Digital Systems & Infrastructure',
      code: 'DSI-DIV',
      desc: 'Manages enterprise portals, public asset data registers, secure identity gateways, and core cloud infrastructure.',
      icon: 'fa-server',
    },
    {
      title: 'Policy, Planning & Strategy',
      code: 'PPS-DIV',
      desc: 'Drives institutional strategy, legislative alignment, inter-agency collaboration, and national resource policies.',
      icon: 'fa-chart-pie',
    },
  ];

  return (
    <main className="container" style={{ padding: '3rem 5%' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title" style={{ fontSize: '2rem' }}>Departments & Technical Units</h1>
          <p className="section-desc">Core institutional divisions powering research, protection, and digital governance</p>
        </div>
        <Link href="/" className="btn btn-outline" style={{ background: 'var(--primary)', color: 'white' }}>
          &larr; Back to Public Gateway
        </Link>
      </div>

      <div className="enterprise-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {departments.map((dept, index) => (
          <div key={index} className="grid-card" style={{ padding: '1.8rem', borderRadius: '8px', background: '#fff', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div className="card-icon" style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>
                <i className={`fa-solid ${dept.icon}`}></i>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', background: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                {dept.code}
              </span>
            </div>
            <h3 className="card-title" style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{dept.title}</h3>
            <p className="card-desc" style={{ fontSize: '0.9rem', color: '#4a5568', lineHeight: '1.5' }}>{dept.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}