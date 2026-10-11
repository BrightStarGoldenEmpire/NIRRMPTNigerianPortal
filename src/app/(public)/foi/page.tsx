'use client';

import React, { useState } from 'react';

interface FOIRequestState {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  summary: string;
  detailedRequest: string;
}

export default function FOIPage() {
  const [activeTab, setActiveTab] = useState<'submit' | 'track' | 'guidelines'>('submit');
  const [trackingIdInput, setTrackingIdInput] = useState('');
  const [trackingResult, setTrackingResult] = useState<{
    id: string;
    status: string;
    submittedDate: string;
    expectedResponse: string;
    department: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<FOIRequestState>({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    summary: '',
    detailedRequest: '',
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionSuccess(null);

    // Simulate enterprise Server Action execution
    setTimeout(() => {
      const generatedId = `FOI-NIRRMPT-${Math.floor(100000 + Math.random() * 900000)}`;
      setIsSubmitting(false);
      setSubmissionSuccess(generatedId);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        organization: '',
        summary: '',
        detailedRequest: '',
      });
    }, 1200);
  };

  const handleTrackRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingIdInput.trim()) return;

    // Simulated status retrieval
    setTrackingResult({
      id: trackingIdInput.toUpperCase(),
      status: 'UNDER_LEGAL_REVIEW',
      submittedDate: '2026-09-28',
      expectedResponse: '2026-10-05 (Within Statutory 7-Day Window)',
      department: 'Legal & Regulatory Compliance Directorate',
    });
  };

  const faqs = [
    {
      q: 'What is the response timeline for an FOI request?',
      a: 'Under Section 4 of the FOI Act 2011, NIRRMPT processes and responds to public records requests within 7 working days from date of receipt.',
    },
    {
      q: 'Are there fees associated with submitting an FOI request?',
      a: 'Submitting an initial FOI application is free. Statutory duplication or transcript preparation fees may apply where hard-copy extracts are required.',
    },
    {
      q: 'What records are exempt from disclosure?',
      a: 'Records impacting national security, ongoing criminal investigations, sensitive trade secrets, or personal data protected under NDPR regulations are exempt from public disclosure.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Title Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
            <div>
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                Statutory Compliance
              </span>
              <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">
                Freedom of Information (FOI) Portal[cite: 15]
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                In accordance with the Freedom of Information Act, NIRRMPT ensures transparent access to public records regarding regenerative natural resource management[cite: 15].
              </p>
            </div>

            {/* Officer Contact Badge */}
            <div className="bg-emerald-50 border-l-4 border-emerald-800 p-4 rounded-r-lg shrink-0">
              <h3 className="font-bold text-emerald-900 text-sm">FOI Request Processing Officer[cite: 15]</h3>
              <p className="text-xs text-emerald-800 font-medium mt-1">
                Email: <a href="mailto:foi@nirrmpt.gov.ng" className="underline font-mono">foi@nirrmpt.gov.ng</a>[cite: 15]
              </p>
              <p className="text-xs text-emerald-800 mt-0.5">Department: Legal & Compliance[cite: 15]</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-6 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${
                activeTab === 'submit'
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Submit Application
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${
                activeTab === 'track'
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Track Request Status
            </button>
            <button
              onClick={() => setActiveTab('guidelines')}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${
                activeTab === 'guidelines'
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Proactive Disclosures & FOI Act
            </button>
          </div>
        </div>

        {/* Dynamic Tab Body */}
        {activeTab === 'submit' && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Submit FOI Record Application
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Complete the form below to initiate an official record request. All submissions generate an automated tracking code.
            </p>

            {submissionSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-sm">
                <span className="font-bold">Application Received!</span> Your FOI Tracking Number is:{' '}
                <span className="font-mono font-bold bg-white px-2 py-1 border rounded text-emerald-700">
                  {submissionSuccess}
                </span>
                . Save this reference code to monitor your request progress.
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g., Dr. Amina Bello"
                    className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@organization.ng"
                    className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
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
                    Organization / Media / NGO (Optional)
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    placeholder="e.g., Resource Rights Initiative"
                    className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Request Subject / Title *
                </label>
                <input
                  type="text"
                  name="summary"
                  required
                  value={formData.summary}
                  onChange={handleInputChange}
                  placeholder="e.g., Environmental Impact Audit Reports for Niger Delta Sector 4"
                  className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Detailed Information & Document Specifics *
                </label>
                <textarea
                  name="detailedRequest"
                  rows={5}
                  required
                  value={formData.detailedRequest}
                  onChange={handleInputChange}
                  placeholder="Provide precise details, date ranges, and document titles to assist the Legal Officer in fulfilling your request..."
                  className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-md shadow transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Transmitting Request...' : 'Submit FOI Application'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'track' && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Track FOI Application Status</h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your assigned FOI tracking ID to check process milestone and legal verification updates.
              </p>
            </div>

            <form onSubmit={handleTrackRequest} className="flex gap-3 max-w-xl">
              <input
                type="text"
                required
                value={trackingIdInput}
                onChange={(e) => setTrackingIdInput(e.target.value)}
                placeholder="e.g., FOI-NIRRMPT-104928"
                className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none uppercase"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-md transition-colors shrink-0"
              >
                Query Database
              </button>
            </form>

            {trackingResult && (
              <div className="mt-6 border border-slate-200 rounded-lg p-6 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase">Tracking Code</div>
                    <div className="text-lg font-mono font-bold text-slate-900">{trackingResult.id}</div>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                    {trackingResult.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block">Date Filed</span>
                    <span className="font-bold text-slate-800">{trackingResult.submittedDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Statutory Response Window</span>
                    <span className="font-bold text-slate-800">{trackingResult.expectedResponse}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Assigned Unit</span>
                    <span className="font-bold text-slate-800">{trackingResult.department}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'guidelines' && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Statutory Framework & Proactive Records</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              NIRRMPT maintains public repositories under Section 2 of the FOI Act 2011. You can access published environmental impact assessments, annual budgetary allocations, and regulatory standards without submitting a formal application.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/repository"
                className="p-4 border rounded-lg hover:border-emerald-700 transition-colors block group bg-slate-50"
              >
                <div className="text-xs font-bold text-emerald-800 group-hover:underline">
                  Public Resource Repository &rarr;
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Access published EIA reports, spatial audit maps, and departmental budgets.
                </div>
              </a>

              <a
                href="/about"
                className="p-4 border rounded-lg hover:border-emerald-700 transition-colors block group bg-slate-50"
              >
                <div className="text-xs font-bold text-emerald-800 group-hover:underline">
                  Agency Organizational Structure &rarr;
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  View leadership hierarchies, directorate responsibilities, and operational guidelines.
                </div>
              </a>
            </div>
          </div>
        )}

        {/* FOI FAQ Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Frequently Asked Questions (FOI Act 2011)
          </h2>

          <div className="divide-y border-t border-b">
            {faqs.map((faq, index) => (
              <div key={index} className="py-4">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex justify-between items-center text-left text-sm font-semibold text-slate-800 hover:text-emerald-900"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg font-mono">{openFaq === index ? '−' : '+'}</span>
                </button>
                {openFaq === index && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}