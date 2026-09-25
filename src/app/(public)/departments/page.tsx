'use client';

import React from 'react';
import Link from 'next/link';

export default function DepartmentsPage() {
  const departments = [
    {
      id: 'DEPT-01',
      title: 'Directorate of Regenerative Resource Technologies',
      icon: 'fa-solid fa-seedling',
      description: 'Oversees pilot projects for soil remediation, afforestation, and sustainable watershed protection systems across Nigeria.',
      head: 'Prof. Ibrahim Usman',
    },
    {
      id: 'DEPT-02',
      title: 'Geospatial & Ecological Monitoring Division',
      icon: 'fa-solid fa-satellite',
      description: 'Deploys satellite remote sensing networks, drone cartography, and IoT environmental tracking sensors.',
      head: 'Dr. Chinedu Eze',
    },
    {
      id: 'DEPT-03',
      title: 'Environmental Impact Assessment (EIA) & Permits',
      icon: 'fa-solid fa-file-signature',
      description: 'Processes statutory clearance applications, conducts field audit inspections, and issues national compliance certifications.',
      head: 'Engr. Amina Bello',
    },
    {
      id: 'DEPT-04',
      title: 'Inter-MDA Policy & Capacity Development Hub',
      icon: 'fa-solid fa-building-columns',
      description: 'Coordinates inter-agency environmental policy alignment, training workshops, and federal academic collaborations.',
      head: 'Dr. Folake Adebayo',
    },
  ];

  return (
    <div className="bg-slate-950 text-white min-h-screen font-sans">
      <section className="bg-slate-900 border-b border-slate-800 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
            Institutional Structure
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2 text-white">
            NIRRMPT Departments & Directorates
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">
            Our operational divisions drive research, environmental protection standards, and statutory policy execution nationwide.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center text-xl mb-4 border border-emerald-500/20">
              <i className={dept.icon}></i>
            </div>
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">{dept.id}</span>
            <h3 className="text-lg font-bold text-white mt-1 mb-2">{dept.title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">{dept.description}</p>
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500">
                Director: <strong className="text-slate-300">{dept.head}</strong>
              </span>
              <Link href="/contact" className="text-emerald-400 font-semibold hover:underline">
                Inquire &rarr;
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}