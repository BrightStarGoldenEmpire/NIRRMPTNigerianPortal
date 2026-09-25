'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Leader {
  id: string;
  name: string;
  role: string;
  category: 'executive' | 'directorate' | 'council';
  division: string;
  bio: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'Active' | 'On Special Assignment';
}

const leadershipData: Leader[] = [
  {
    id: 'dg-office',
    name: 'Prof. Adeleke O. Danjuma',
    role: 'Director-General / Chief Executive Officer',
    category: 'executive',
    division: 'Executive Directorate',
    bio: 'Pioneering environmental scientist leading national ecosystem restoration programs and federal research charters.',
    email: 'dg@nirrmpt.gov.ng',
    phone: '+234 802 525 2362',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    status: 'Active',
  },
  {
    id: 'dir-research',
    name: 'Dr. Amina Bello',
    role: 'Director of Environmental Research & Innovation',
    category: 'directorate',
    division: 'Directorate of Regenerative Technologies',
    bio: 'Lead strategist in remote sensing and satellite-based deforestation surveillance across the Niger Delta region.',
    email: 'a.bello@nirrmpt.gov.ng',
    phone: '+234 803 111 2233',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    status: 'Active',
  },
  {
    id: 'dir-operations',
    name: 'Engr. Emeka Nwosu',
    role: 'Director of Field Operations & Compliance',
    category: 'directorate',
    division: 'Directorate of Field Operations',
    bio: 'Oversees federal compliance teams, environmental impact assessments, and industrial site audits nationwide.',
    email: 'e.nwosu@nirrmpt.gov.ng',
    phone: '+234 805 444 5566',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    status: 'Active',
  },
  {
    id: 'council-chair',
    name: 'Chief (Mrs.) Folashade Akintola',
    role: 'Governing Council Chair',
    category: 'council',
    division: 'Federal Governing Board',
    bio: 'Appointed federal representative managing multi-stakeholder policy formulation and regional board oversight.',
    email: 'council.chair@nirrmpt.gov.ng',
    phone: '+234 809 777 8899',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    status: 'Active',
  },
];

export default function LeadershipPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLeaders = leadershipData.filter((leader) => {
    const matchesCategory = selectedCategory === 'all' || leader.category === selectedCategory;
    const matchesSearch =
      leader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leader.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leader.division.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* Header Banner */}
      <section className="bg-[#0B1528] text-white py-12 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Leadership & Governance
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Governing Council, Executive Directorate, and Departmental Heads directing federal ecological policy and resource protection.
            </p>
          </div>
          
          <div className="flex gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800 shrink-0">
            <div className="px-3 border-r border-slate-800 text-center">
              <span className="text-lg font-bold text-emerald-400">4</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Directorates</p>
            </div>
            <div className="px-3 text-center">
              <span className="text-lg font-bold text-emerald-400">100%</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Federal Charter</p>
            </div>
          </div>
        </div>
      </section>

      {/* Controls & Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {[
              { id: 'all', label: 'All Offices' },
              { id: 'executive', label: 'Executive Directorate' },
              { id: 'directorate', label: 'Departmental Heads' },
              { id: 'council', label: 'Governing Council' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === tab.id
                    ? 'bg-[#0F392B] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              placeholder="Search by name or division..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F392B] transition"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Cards Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8">
        {filteredLeaders.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <i className="fa-solid fa-user-slash text-slate-300 text-3xl mb-3"></i>
            <h3 className="text-sm font-bold text-slate-700">No leadership records match your query</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting your filter tabs or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLeaders.map((leader) => (
              <div
                key={leader.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={leader.avatar}
                      alt={leader.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-emerald-600/20 shrink-0"
                    />
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-1">
                        {leader.division}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {leader.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#0F392B] mt-0.5">
                        {leader.role}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {leader.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-medium text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    {leader.status}
                  </span>
                  
                  <Link
                    href={`/leadership/${leader.id}`}
                    className="bg-slate-100 hover:bg-[#0F392B] hover:text-white text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5"
                  >
                    View Official Profile
                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}