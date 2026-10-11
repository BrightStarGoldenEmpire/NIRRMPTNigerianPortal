'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface TrainingProgram {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  seatsLeft: number;
  description: string;
  flyerUrl: string;
}

export default function TrainingRegistrationPage() {
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccessId, setRegistrationSuccessId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    designation: '',
    experienceLevel: 'Mid-Level',
  });

  const programs: TrainingProgram[] = [
    {
      id: 'TR-2026-01',
      title: 'Environmental Impact Assessment (EIA) Certification 2026',
      category: 'Regulatory Compliance',
      date: 'November 12 - 15, 2026',
      location: 'Port Harcourt / Hybrid Stream',
      seatsLeft: 14,
      description: 'Comprehensive statutory certification covering EIA auditing frameworks under federal guidelines and NDPR principles.',
      flyerUrl: '/assets/images/training-eia-2026.png',
    },
    {
      id: 'TR-2026-02',
      title: 'GIS Mapping & Resource Management Workshop',
      category: 'Spatial Analytics',
      date: 'December 03 - 05, 2026',
      location: 'Abuja Directorate Center & Virtual',
      seatsLeft: 8,
      description: 'Hands-on geospatial mapping workflows, satellite terrain monitoring, and automated database resource tracking.',
      flyerUrl: '/assets/images/training-gis-2026.png',
    },
    {
      id: 'TR-2026-03',
      title: 'Regenerative Soil & Ecosystem Protection Masterclass',
      category: 'Field Operations',
      date: 'January 20 - 22, 2027',
      location: 'Field Desk Operations Base, Rivers State',
      seatsLeft: 22,
      description: 'Advanced methodologies for soil remediation, natural asset protection, and field data telemetry reporting.',
      flyerUrl: '/assets/images/training-soil-2027.png',
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setRegistrationSuccessId(null);

    setTimeout(() => {
      const trackingCode = `CERT-REG-${Math.floor(100000 + Math.random() * 900000)}`;
      setIsSubmitting(false);
      setRegistrationSuccessId(trackingCode);
    }, 1200);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
            Professional Development Directorate
          </span>
          <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">
            Training & Workshop Certification Portal
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Register for official NIRRMPT environmental certifications, spatial mapping workshops, and regulatory compliance masterclasses.
          </p>
        </div>

        {/* Programs Listing Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Available Certification Modules</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((prog) => (
              <div 
                key={prog.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-emerald-700 transition-all"
              >
                <div>
                  {/* Program Flyer Banner / Fallback Section */}
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden flex items-center justify-center">
                    {!imageErrors[prog.id] ? (
                      <Image
                        src={prog.flyerUrl}
                        alt={`${prog.title} Flyer`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                        onError={() => setImageErrors((prev) => ({ ...prev, [prog.id]: true }))}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-slate-900 flex flex-col items-center justify-center p-4 text-center">
                        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">NIRRMPT Certification</span>
                        <span className="text-xs text-white font-bold mt-1">{prog.id}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-800 text-white rounded-full">
                        {prog.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-emerald-700">
                        {prog.seatsLeft} Seats Left
                      </span>
                      <span className="text-slate-400 font-medium">{prog.id}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {prog.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {prog.description}
                    </p>

                    <div className="pt-2 text-xs space-y-1 text-slate-500 font-medium border-t border-slate-100">
                      <div>📅 {prog.date}</div>
                      <div>📍 {prog.location}</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => {
                      setSelectedProgram(prog);
                      setRegistrationSuccessId(null);
                    }}
                    className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold rounded-md shadow transition-colors"
                  >
                    Select & Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Registration Form Modal / Section */}
        {selectedProgram && (
          <div className="bg-white border-2 border-emerald-800 rounded-xl p-8 shadow-md space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Selected Program</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedProgram.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedProgram.date} • {selectedProgram.location}</p>
              </div>
              <button 
                onClick={() => setSelectedProgram(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold self-start md:self-auto"
              >
                ✕ Close
              </button>
            </div>

            {registrationSuccessId ? (
              <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 space-y-3">
                <h3 className="font-bold text-lg">Training Application Successfully Submitted!</h3>
                <p className="text-sm">
                  Your registration token is: <span className="font-mono font-bold bg-white px-2 py-1 border rounded text-emerald-700">{registrationSuccessId}</span>
                </p>
                <p className="text-xs text-slate-600">
                  A verification confirmation email with schedule details and access materials has been dispatched to your email address.
                </p>
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="mt-4 px-4 py-2 bg-emerald-900 text-white text-xs font-bold rounded-md"
                >
                  Register Another Participant
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g., Dr. Chidi Okafor"
                      className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Official Email *
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@agency.gov.ng"
                      className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+234 800 000 0000"
                      className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Organization / Agency
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      placeholder="e.g., Federal Ministry of Environment"
                      className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-md shadow transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing Registration...' : 'Confirm Enrollment & Generate Token'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}