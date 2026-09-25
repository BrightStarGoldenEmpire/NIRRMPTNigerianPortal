'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface EduRow {
  institution: string;
  qualification: string;
  field: string;
  year: string;
  grade: string;
}

interface ExpRow {
  organisation: string;
  position: string;
  sector: string;
  fromYear: string;
  toYear: string;
}

interface CertRow {
  body: string;
  certification: string;
  gradeStatus: string;
  year: string;
}

export default function ApplicationsCallPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appRef, setAppRef] = useState('');

  // Comprehensive Form State incorporating Document Sections A to K
  const [formData, setFormData] = useState({
    // Section A: Personal Details
    title: 'Mr',
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Male',
    nationality: 'Nigerian',
    address: '',
    state: '',
    city: '',
    country: 'Nigeria',
    phone: '',
    email: '',
    nin: '',
    
    // Call Specifics & Section E: Grade
    callCycle: 'CALL 2026/2027 CYCLE',
    membershipGrade: 'Full Member',
    gradeFee: 135000,
    
    // Section B & C: Dynamic Experience Tables
    education: [
      { institution: '', qualification: '', field: '', year: '', grade: '' }
    ] as EduRow[],
    experience: [
      { organisation: '', position: '', sector: '', fromYear: '', toYear: '' }
    ] as ExpRow[],

    // Section D: Professional Areas of Interest
    interests: [] as string[],
    otherInterest: '',

    // Section F: Professional Memberships & Certifications
    certifications: [
      { body: '', certification: '', gradeStatus: '', year: '' }
    ] as CertRow[],

    // Section G: Statement of Purpose
    statementOfPurpose: '',

    // Section H: Referee / Professional Reference
    refereeName: '',
    refereePosition: '',
    refereeOrg: '',
    refereeRelationship: '',
    refereePhone: '',
    refereeEmail: '',
    refereeAddress: '',
    refereeMembership: '',

    // Section I: Documents Checklist Confirmation
    checklist: {
      completedForm: true,
      passportPhoto: false,
      highestEduEvidence: false,
      profCertEvidence: false,
      employmentEvidence: false,
      validID: false,
      paymentReceipt: false,
      otherDocs: false
    },

    // Section J: Declaration
    declarationSigned: false,
  });

  const availableInterests = [
    'Sustainable Resource Management', 'Environmental Protection', 'Ecological Restoration', 'Resource Efficiency',
    'Regenerative Agriculture', 'Forestry / Land Management', 'Water Management', 'Waste Management / Pollution Control',
    'Renewable / Sustainable Energy', 'Circular Economy / Bio-based Solutions', 'Climate Change Adaptation & Mitigation', 'Biodiversity Conservation',
    'Climate-smart Agriculture / Green Infrastructure', 'Research & Education', 'Policy / Advocacy'
  ];

  const handleGradeChange = (grade: string, fee: number) => {
    setFormData((prev) => ({ ...prev, membershipGrade: grade, gradeFee: fee }));
  };

  const handleInterestToggle = (item: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(item);
      return {
        ...prev,
        interests: exists ? prev.interests.filter((i) => i !== item) : [...prev.interests, item]
      };
    });
  };

  const addEdu = () => setFormData(p => ({ ...p, education: [...p.education, { institution: '', qualification: '', field: '', year: '', grade: '' }] }));
  const addExp = () => setFormData(p => ({ ...p, experience: [...p.experience, { organisation: '', position: '', sector: '', fromYear: '', toYear: '' }] }));
  const addCert = () => setFormData(p => ({ ...p, certifications: [...p.certifications, { body: '', certification: '', gradeStatus: '', year: '' }] }));

  const handleSubmitAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declarationSigned) {
      alert('Please confirm the applicant declaration in Section J before submitting.');
      return;
    }

    setSubmitting(true);
    const referenceCode = `NIRRMPT-CALL-${Math.floor(100000 + Math.random() * 900000)}`;

    const pendingApplications = JSON.parse(localStorage.getItem('nirrmpt_applications') || '[]');
    const newRecord = {
      ...formData,
      applicationNo: referenceCode,
      status: 'Pending Verification',
      submittedAt: new Date().toISOString(),
      paymentStatus: formData.gradeFee > 0 ? 'Paid (Paystack Gateway)' : 'Board Review Required',
      sourceCall: 'CALL 2026/2027 CYCLE - Induction 5 Nov 2026',
    };
    pendingApplications.push(newRecord);
    localStorage.setItem('nirrmpt_applications', JSON.stringify(pendingApplications));

    const handler = (window as any).PaystackPop && (window as any).PaystackPop.setup({
      key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      email: formData.email,
      amount: formData.gradeFee * 100,
      currency: 'NGN',
      ref: referenceCode,
      callback: function () {
        setSubmitting(false);
        setAppRef(referenceCode);
        setSubmitted(true);
      },
      onClose: function () {
        setSubmitting(false);
        setAppRef(referenceCode);
        setSubmitted(true);
      },
    });

    if (handler && formData.gradeFee > 0) {
      handler.openIframe();
    } else {
      setTimeout(() => {
        setSubmitting(false);
        setAppRef(referenceCode);
        setSubmitted(true);
      }, 1200);
    }
  };

  if (submitted) {
    return (
      <div className="bg-slate-950 text-white min-h-screen font-sans flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 max-w-xl text-center shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-500/40">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Call Application Submitted</h2>
          <p className="text-slate-400 text-xs mb-6 leading-relaxed">
            Your application reference number is <strong className="text-amber-400 font-mono">{appRef}</strong>. 
            Your credentials have been routed to the Accreditation Board for review. An official notification will be dispatched to <span className="text-emerald-400">{formData.email}</span>.
          </p>
          <div className="bg-slate-950 p-4 rounded-xl text-left border border-slate-800 mb-6 text-[11px] text-slate-300 space-y-1">
            <div><strong>Induction Date:</strong> Thursday, 5 November 2026 (10:00 AM)</div>
            <div><strong>Venue:</strong> Golden Tulip Hotel Dome, Stadium Road, Port Harcourt, Rivers State</div>
          </div>
          <div className="flex justify-center">
            <Link href="/" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-8 py-3 rounded-xl transition shadow-lg">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans py-10 px-4 md:px-8">
      <script src="https://js.paystack.co/v1/inline.js" async></script>

      <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Banner Notice */}
        <div className="bg-slate-950 border-b border-slate-800 p-4 flex justify-between items-center px-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Applications Portal</span>
          </div>
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition">← Return Home</Link>
        </div>

        {/* INVITATION & PROSPECTUS */}
        <div className="p-8 md:p-10 border-b border-slate-800 bg-slate-950/60 text-slate-300 text-xs leading-relaxed space-y-5">
          <div className="inline-block bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
            Official Prospectus & Call
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-tight">
            INVITATION TO APPLY FOR INDUCTION AS A MEMBER OF THE NIGERIAN INSTITUTE OF REGENERATIVE RESOURCE MANAGEMENT AND PROTECTION TECHNOLOGIES LTD/GTE
          </h1>
          
          <p>
            We are pleased to introduce the <strong>Nigerian Institute of Regenerative Resource Management and Protection Technologies Ltd/Gte (NIRRMPT)</strong>, an established professional institute dedicated to advancing sustainable resource management, environmental protection, ecological restoration, resource efficiency and regenerative technologies in Nigeria.
          </p>
          
          <p>
            The Institute is established as a Company Limited by Guarantee under the Companies and Allied Matters Act, 2020, with its objects covering research, education, training, technology development and the promotion of regenerative practices across sectors including agriculture, forestry, water management, waste management and energy.
          </p>
          
          <p>
            The Institute also seeks to foster a new generation of professionals in regenerative sciences and technologies, promote sustainable waste management and pollution control, support biodiversity conservation and ecosystem restoration, advance climate-smart agriculture and contribute to Nigeria's climate-change adaptation and mitigation efforts.
          </p>

          <div className="pt-2">
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">CALL FOR MEMBERS</h2>
            <p>
              As part of the establishment and development of the Institute, applications are hereby invited from qualified students, graduates, professionals, academics, researchers, public servants, private-sector practitioners, captains of Industries, top personalities and other persons with relevant interests or experience to become Members of the Institute.
            </p>
            <p className="mt-2">
              Membership provides an opportunity to become part of a growing professional community committed to knowledge development, capacity building, research, innovation and the practical application of regenerative resource management and protection technologies.
            </p>
            <div className="mt-3 bg-slate-900 border border-slate-800 p-3 rounded-xl text-[11px] text-slate-400 italic">
              <strong>Note:</strong> Membership is subject to completion of the prescribed application process and approval in accordance with the Institute's governing provisions. The Institute's Articles provide that a person becomes a member upon completing an approved membership application and obtaining the approval of the Directors.
            </div>
          </div>

          {/* INDUCTION CEREMONY HIGHLIGHT BOX */}
          <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-5 space-y-2">
            <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
              📅 INDUCTION CEREMONY
            </h2>
            <p className="text-slate-200">
              The Induction Ceremony for Members is scheduled to hold as follows:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px] text-slate-300 font-medium">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-0.5">Date</span>
                Thursday, 5 November 2026
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-0.5">Time</span>
                10:00 AM
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-0.5">Venue</span>
                Golden Tulip Hotel Dome, Stadium Road, Port Harcourt, Rivers State, Nigeria
              </div>
            </div>
            <p className="text-[11px] text-amber-300/90 font-medium pt-2">
              * All persons interested in becoming Members are encouraged to complete their membership registration and application on or before <strong>Friday, 30th October 2026</strong>, to enable adequate preparation for the induction ceremony.
            </p>
          </div>

          {/* WHY JOIN THE INSTITUTE */}
          <div className="pt-2 space-y-3">
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
              WHY JOIN THE INSTITUTE?
            </h2>
            <p>Membership of the Institute provides an opportunity to:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-300">
              <li className="flex items-start gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Participate in a professional network focused on regenerative resource management and environmental protection.</span>
              </li>
              <li className="flex items-start gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Contribute to research, innovation and development of sustainable resource-management practices.</span>
              </li>
              <li className="flex items-start gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Participate in professional training, capacity-building programmes and knowledge-sharing activities.</span>
              </li>
              <li className="flex items-start gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Develop and promote solutions in areas such as agriculture, forestry, water, waste management, energy and ecological restoration.</span>
              </li>
              <li className="flex items-start gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Support climate-change adaptation and mitigation, biodiversity conservation and sustainable development.</span>
              </li>
              <li className="flex items-start gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Participate in initiatives promoting circular economy principles, bio-based solutions and sustainable waste management.</span>
              </li>
              <li className="flex items-start gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800 md:col-span-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Contribute to the development and adoption of regenerative technologies and practices.</span>
              </li>
            </ul>
            <p className="text-[11px] text-slate-400 pt-1">
              The Institute's founding objects specifically include conducting research into regenerative practices, developing innovative technologies, providing training and skill-building programmes, fostering experts in regenerative sciences and technologies, and facilitating the adoption of proven regenerative practices.
            </p>
          </div>
        </div>

        {/* APPLICATION FORM HEADER */}
        <div className="p-6 text-center bg-emerald-950/20 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            MEMBERSHIP APPLICATION FORM (INDUCTION – 5 NOVEMBER 2026)
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Complete the form below to submit your official credentials to the Accreditation Board.
          </p>
        </div>

        <form onSubmit={handleSubmitAndPay} className="p-6 md:p-10 space-y-8">

          {/* SECTION A: APPLICANT'S PERSONAL DETAILS */}
          <section className="space-y-4">
            <div className="bg-emerald-950/80 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-800/50 font-bold text-xs uppercase tracking-wider">
              A. Applicant's Personal Details
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Title</label>
                <select value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                  <option>Mr</option><option>Mrs</option><option>Miss</option><option>Dr</option><option>Prof</option><option>Engr</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Surname / Family Name *</label>
                <input required type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">First Name(s) / Other Name(s) *</label>
                <input required type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Date of Birth</label>
                <input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Gender</label>
                <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Nationality</label>
                <input type="text" value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1">Residential Address</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">State / FCT</label>
                <input type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Telephone / WhatsApp *</label>
                <input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address *</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">NIN / Other Identification No. (Optional)</label>
              <input type="text" value={formData.nin} onChange={(e) => setFormData({ ...formData, nin: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
          </section>

          {/* SECTION B: EDUCATIONAL QUALIFICATIONS */}
          <section className="space-y-4">
            <div className="bg-emerald-950/80 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-800/50 font-bold text-xs uppercase tracking-wider flex justify-between items-center">
              <span>B. Educational Qualifications</span>
              <button type="button" onClick={addEdu} className="text-[10px] bg-emerald-700 hover:bg-emerald-600 px-2.5 py-1 rounded text-white">+ Add Row</button>
            </div>
            {formData.education.map((edu, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <input placeholder="Institution" value={edu.institution} onChange={(e) => { const n = [...formData.education]; n[idx].institution = e.target.value; setFormData({ ...formData, education: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                <input placeholder="Qualification / Degree" value={edu.qualification} onChange={(e) => { const n = [...formData.education]; n[idx].qualification = e.target.value; setFormData({ ...formData, education: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                <input placeholder="Field of Study" value={edu.field} onChange={(e) => { const n = [...formData.education]; n[idx].field = e.target.value; setFormData({ ...formData, education: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                <input placeholder="Year" value={edu.year} onChange={(e) => { const n = [...formData.education]; n[idx].year = e.target.value; setFormData({ ...formData, education: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                <input placeholder="Class / Grade" value={edu.grade} onChange={(e) => { const n = [...formData.education]; n[idx].grade = e.target.value; setFormData({ ...formData, education: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
              </div>
            ))}
          </section>

          {/* SECTION C: EMPLOYMENT / PROFESSIONAL EXPERIENCE */}
          <section className="space-y-4">
            <div className="bg-emerald-950/80 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-800/50 font-bold text-xs uppercase tracking-wider flex justify-between items-center">
              <span>C. Employment / Professional Experience</span>
              <button type="button" onClick={addExp} className="text-[10px] bg-emerald-700 hover:bg-emerald-600 px-2.5 py-1 rounded text-white">+ Add Row</button>
            </div>
            {formData.experience.map((exp, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <input placeholder="Organisation / Employer" value={exp.organisation} onChange={(e) => { const n = [...formData.experience]; n[idx].organisation = e.target.value; setFormData({ ...formData, experience: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                <input placeholder="Position" value={exp.position} onChange={(e) => { const n = [...formData.experience]; n[idx].position = e.target.value; setFormData({ ...formData, experience: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                <input placeholder="Sector / Area" value={exp.sector} onChange={(e) => { const n = [...formData.experience]; n[idx].sector = e.target.value; setFormData({ ...formData, experience: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                <input placeholder="From Year" value={exp.fromYear} onChange={(e) => { const n = [...formData.experience]; n[idx].fromYear = e.target.value; setFormData({ ...formData, experience: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                <input placeholder="To Year" value={exp.toYear} onChange={(e) => { const n = [...formData.experience]; n[idx].toYear = e.target.value; setFormData({ ...formData, experience: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
              </div>
            ))}
          </section>

          {/* SECTION D: PROFESSIONAL / TECHNICAL AREAS OF INTEREST */}
          <section className="space-y-4">
            <div className="bg-emerald-950/80 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-800/50 font-bold text-xs uppercase tracking-wider">
              D. Professional / Technical Areas of Interest
            </div>
            <p className="text-xs text-slate-400">Please select all areas relevant to your interests or professional activities:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {availableInterests.map((item) => (
                <label key={item} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-slate-700">
                  <input 
                    type="checkbox" 
                    checked={formData.interests.includes(item)} 
                    onChange={() => handleInterestToggle(item)} 
                    className="accent-emerald-500" 
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Other Areas (Specify if any)</label>
              <input type="text" value={formData.otherInterest} onChange={(e) => setFormData({ ...formData, otherInterest: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" placeholder="e.g. Circular Economy Finance..." />
            </div>
          </section>

          {/* SECTION E: MEMBERSHIP GRADE AND REGISTRATION FEE */}
          <section className="space-y-4">
            <div className="bg-emerald-950/80 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-800/50 font-bold text-xs uppercase tracking-wider">
              E. Membership Grade and Registration Fee
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { grade: 'Student Member', eligibility: 'Undergraduate of any tertiary institution', fee: 30000 },
                { grade: 'Associate Member', eligibility: 'Graduate / person with limited work experience', fee: 80000 },
                { grade: 'Full Member', eligibility: 'Graduate / postgraduate with substantial work experience', fee: 135000 },
                { grade: 'Fellow', eligibility: 'Postgraduate / senior civil servants, captains of industries', fee: 0, custom: 'Board Approval' },
              ].map((g) => (
                <div 
                  key={g.grade} 
                  onClick={() => handleGradeChange(g.grade, g.fee)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${formData.membershipGrade === g.grade ? 'bg-emerald-900/30 border-emerald-500 shadow-lg' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
                >
                  <div className="text-xs font-bold text-white mb-1">{g.grade}</div>
                  <div className="text-[10px] text-slate-400 mb-3">{g.eligibility}</div>
                  <div className="text-sm font-extrabold text-amber-400">
                    {g.custom ? g.custom : `₦${g.fee.toLocaleString()}`}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION F: RELEVANT PROFESSIONAL MEMBERSHIPS / CERTIFICATIONS */}
          <section className="space-y-4">
            <div className="bg-emerald-950/80 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-800/50 font-bold text-xs uppercase tracking-wider flex justify-between items-center">
              <span>F. Relevant Professional Memberships / Certifications</span>
              <button type="button" onClick={addCert} className="text-[10px] bg-emerald-700 hover:bg-emerald-600 px-2.5 py-1 rounded text-white">+ Add Row</button>
            </div>
            {formData.certifications.map((cert, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <input placeholder="Professional Body / Institute" value={cert.body} onChange={(e) => { const n = [...formData.certifications]; n[idx].body = e.target.value; setFormData({ ...formData, certifications: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                <input placeholder="Membership / Certification" value={cert.certification} onChange={(e) => { const n = [...formData.certifications]; n[idx].certification = e.target.value; setFormData({ ...formData, certifications: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                <input placeholder="Grade / Status" value={cert.gradeStatus} onChange={(e) => { const n = [...formData.certifications]; n[idx].gradeStatus = e.target.value; setFormData({ ...formData, certifications: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                <input placeholder="Year" value={cert.year} onChange={(e) => { const n = [...formData.certifications]; n[idx].year = e.target.value; setFormData({ ...formData, certifications: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
              </div>
            ))}
          </section>

          {/* SECTION G: STATEMENT OF PURPOSE / INTEREST */}
          <section className="space-y-4">
            <div className="bg-emerald-950/80 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-800/50 font-bold text-xs uppercase tracking-wider">
              G. Statement of Purpose / Interest
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2">
                Briefly state your reason for seeking membership of the Institute and how you intend to contribute to its objectives (maximum 150 words):
              </p>
              <textarea 
                rows={4} 
                required
                value={formData.statementOfPurpose} 
                onChange={(e) => setFormData({ ...formData, statementOfPurpose: e.target.value })} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500" 
                placeholder="State your objectives and reasons for joining NIRRMPT..." 
              />
            </div>
          </section>

          {/* SECTION H: REFEREE / PROFESSIONAL REFERENCE */}
          <section className="space-y-4">
            <div className="bg-emerald-950/80 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-800/50 font-bold text-xs uppercase tracking-wider">
              H. Referee / Professional Reference
            </div>
            <p className="text-xs text-slate-400">Provide details of one professional, academic or senior colleague who can confirm your professional/academic standing:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Name of Referee *</label>
                <input required type="text" value={formData.refereeName} onChange={(e) => setFormData({ ...formData, refereeName: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Position / Designation</label>
                <input type="text" value={formData.refereePosition} onChange={(e) => setFormData({ ...formData, refereePosition: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Organisation</label>
                <input type="text" value={formData.refereeOrg} onChange={(e) => setFormData({ ...formData, refereeOrg: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Relationship to Applicant</label>
                <input type="text" value={formData.refereeRelationship} onChange={(e) => setFormData({ ...formData, refereeRelationship: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Telephone</label>
                <input type="tel" value={formData.refereePhone} onChange={(e) => setFormData({ ...formData, refereePhone: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                <input type="email" value={formData.refereeEmail} onChange={(e) => setFormData({ ...formData, refereeEmail: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Address</label>
                <input type="text" value={formData.refereeAddress} onChange={(e) => setFormData({ ...formData, refereeAddress: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Professional Membership (if applicable)</label>
                <input type="text" value={formData.refereeMembership} onChange={(e) => setFormData({ ...formData, refereeMembership: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
            </div>
          </section>

          {/* SECTION I: DOCUMENTS CHECKLIST */}
          <section className="space-y-4">
            <div className="bg-emerald-950/80 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-800/50 font-bold text-xs uppercase tracking-wider">
              I. Documents Checklist
            </div>
            <p className="text-xs text-slate-400">Confirm the items you have prepared for verification:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
              {[
                { key: 'completedForm', label: 'Completed and signed application form' },
                { key: 'passportPhoto', label: 'Recent passport photograph' },
                { key: 'highestEduEvidence', label: 'Evidence of highest educational qualification' },
                { key: 'profCertEvidence', label: 'Evidence of professional qualification / certification' },
                { key: 'employmentEvidence', label: 'Evidence of employment / professional experience' },
                { key: 'validID', label: 'Valid identification document' },
                { key: 'paymentReceipt', label: 'Evidence of payment of applicable registration fee' },
                { key: 'otherDocs', label: 'Any other supporting document requested by the Institute' },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={(formData.checklist as any)[item.key]} 
                    onChange={(e) => setFormData({
                      ...formData,
                      checklist: { ...formData.checklist, [item.key]: e.target.checked }
                    })} 
                    className="accent-emerald-500" 
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* SECTION J: APPLICANT'S DECLARATION & SUBMISSION */}
          <section className="pt-4 border-t border-slate-800 space-y-4">
            <div className="bg-emerald-950/80 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-800/50 font-bold text-xs uppercase tracking-wider">
              J. Applicant's Declaration
            </div>
            <label className="flex items-start gap-3 cursor-pointer bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <input type="checkbox" required checked={formData.declarationSigned} onChange={(e) => setFormData({ ...formData, declarationSigned: e.target.checked })} className="mt-0.5 accent-emerald-500" />
              <span className="text-xs text-slate-300 leading-relaxed">
                I hereby declare that the information provided in this application is true, complete and accurate to the best of my knowledge. I understand that membership is subject to completion of the prescribed application process and approval by the Institute. I agree to abide by the Institute's governing documents, policies, rules and professional standards applicable to members. Registration closes on 30th October 2026 for the 5th November 2026 Pioneer Induction Ceremony.
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl text-xs uppercase tracking-wider transition shadow-xl border border-emerald-500/50 flex items-center justify-center gap-2"
            >
              {submitting ? 'Processing Application...' : `Submit Formal Application (Paystack Fee: ₦${formData.gradeFee.toLocaleString()})`}
            </button>
          </section>

        </form>
      </div>
    </div>
  );
}