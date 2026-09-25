'use client';

import React from 'react';

export default function AboutPage() {
  const coreValues = [
    "Excellence in Research",
    "Innovation",
    "Sustainability",
    "Integrity",
    "Collaboration",
    "Environmental Stewardship",
    "Safety",
    "Impact"
  ];

  const objectives = [
    "Promote research and technology development in regenerative natural resource management.",
    "Formulate statutory frameworks and national guidelines for ecological preservation.",
    "Develop advanced satellite and IoT surveillance systems for illegal deforestation monitoring.",
    "Facilitate capacity-building programs and accredited environmental certifications.",
    "Build inter-MDA data exchange networks across federal, state, and local governments.",
    "Support sustainable land restoration, soil conservation, and watershed protection.",
    "Establish national environmental databases compliant with NDPR guidelines.",
    "Advocate for carbon neutrality and renewable energy deployment in rural sectors.",
    "Provide technical advisory services to federal policymakers and regional boards.",
    "Formulate climate resilience protocols for agricultural and coastal zones.",
    "Implement bio-remediation protocols for industrially contaminated soil and water.",
    "Deploy autonomous environmental drone arrays for continuous resource mapping.",
    "Standardize eco-rating frameworks for industrial and commercial real estate.",
    "Foster international partnerships with global ecological research institutions.",
    "Conduct statutory environmental impact audits for federal infrastructure projects.",
    "Provide continuous open-data access points for public environmental research.",
    "Establish emergency response protocols for ecological and chemical disasters.",
    "Regulate green technological solutions used by private environmental contractors.",
    "Promote community-led conservation frameworks across indigenous territories.",
    "Maintain high-level cyber-secure infrastructure for institutional data assets.",
    "Ensure total transparency and accountability across all institute operations."
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* Hero Header */}
      <section className="bg-[#0F392B] text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            Institutional Mandate & Objectives
          </h1>
          <p className="text-slate-200 text-sm md:text-base max-w-2xl mx-auto font-light">
            Guiding the Republic of Nigeria towards ecological sustainability, resource protection, and regenerative technologies.
          </p>
        </div>
      </section>

      {/* Strategic Foundation: Mission, Vision & Core Values */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Mission Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#0F392B] font-bold text-sm uppercase tracking-wider mb-3">
                <i className="fa-solid fa-[#0F392B] fa-bullseye text-emerald-600 text-base"></i>
                MISSION
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                To advance the science, policy, and practice of regenerative resource management and protection technologies for a sustainable Nigeria.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
              <span>Primary Strategic Objective</span>
              <span className="text-emerald-700">Federal Charter</span>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#0F392B] font-bold text-sm uppercase tracking-wider mb-3">
                <i className="fa-solid fa-eye text-emerald-600 text-base"></i>
                VISION
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                A Nigeria where natural resources are managed regeneratively, ecosystems are protected, and communities thrive through innovative technologies.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
              <span>Long-Term Horizon</span>
              <span className="text-emerald-700">National Impact</span>
            </div>
          </div>

          {/* Core Values Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#0F392B] font-bold text-sm uppercase tracking-wider mb-3">
                <i className="fa-solid fa-[#0F392B] fa-gem text-emerald-600 text-base"></i>
                CORE VALUES
              </div>
              <div className="flex flex-wrap gap-2">
                {coreValues.map((val, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-slate-200/60 hover:bg-emerald-50 hover:text-[#0F392B] hover:border-emerald-200 transition"
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
              <span>Institutional Ethos</span>
              <span className="text-emerald-700">8 Pillars</span>
            </div>
          </div>

        </div>
      </section>

      {/* Objectives Grid */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0F392B]">21 Statutory Objectives</h2>
          <p className="text-slate-600 text-xs">Official charter duties assigned under federal regulation.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map((obj, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex gap-4 hover:border-emerald-300 transition">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-800 font-bold rounded-lg flex items-center justify-center text-xs flex-shrink-0">
                {idx + 1}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {obj}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}