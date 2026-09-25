'use client';

import React from 'react';

export default function NewsPage() {
  const articles = [
    {
      id: 'NEWS-2026-01',
      title: 'NIRRMPT Launches 2026 National Soil Remediation Initiative',
      date: 'September 18, 2026',
      category: 'Policy Bulletin',
      summary: 'Federal institute announces deployment of regenerative bio-remediation protocols across affected agricultural zones.',
    },
    {
      id: 'NEWS-2026-02',
      title: 'Inter-MDA Data Exchange Framework Finalized in Abuja',
      date: 'August 29, 2026',
      category: 'Inter-Agency',
      summary: 'Stakeholders ratify unified RESTful API interoperability standards for ecological telemetry and satellite data sharing.',
    },
  ];

  return (
    <div className="bg-slate-950 text-white min-h-screen font-sans">
      <section className="bg-slate-900 border-b border-slate-800 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Official Press & Communications</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2">Institute News & Announcements</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-6">
        {articles.map((item) => (
          <article key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
                {item.category}
              </span>
              <span className="text-xs text-slate-500">{item.date}</span>
            </div>
            <h2 className="text-lg font-bold text-white mb-2">{item.title}</h2>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">{item.summary}</p>
            <button className="text-emerald-400 text-xs font-bold hover:underline">Read Full Release &rarr;</button>
          </article>
        ))}
      </section>
    </div>
  );
}