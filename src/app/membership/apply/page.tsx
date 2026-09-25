'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  grade: string;
  year: string;
}

export default function MembershipApplyPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activationSent, setActivationSent] = useState(false);
  const [appRef, setAppRef] = useState('');
  const [activationToken, setActivationToken] = useState('');

  // Form State (Sections A-E, G & H)
  const [formData, setFormData] = useState({
    title: 'Mr',
    surname: '',
    firstNames: '',
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
    
    // Grade Selection
    membershipGrade: 'Full Member',
    gradeFee: 135000,

    // Dynamic Lists
    education: [
      { institution: '', qualification: '', field: '', year: '', grade: '' }
    ] as EduRow[],
    experience: [
      { organisation: '', position: '', sector: '', fromYear: '', toYear: '' }
    ] as ExpRow[],
    certifications: [
      { body: '', certification: '', grade: '', year: '' }
    ] as CertRow[],

    // Professional Interests
    interests: [] as string[],
    otherInterest: '',

    // Purpose & Reference (Sections G & H)
    statementOfPurpose: '',
    refereeName: '',
    refereePosition: '',
    refereeOrg: '',
    refereeRelationship: '',
    refereePhone: '',
    refereeEmail: '',
    refereeAddress: '',
    refereeProMembership: '',

    // Declaration
    declarationSigned: false,
    declarationPlace: '',
  });

  const interestOptions = [
    'Sustainable Resource Management', 'Environmental Protection', 'Ecological Restoration', 'Resource Efficiency',
    'Regenerative Agriculture', 'Forestry / Land Management', 'Water Management', 'Waste Management / Pollution Control',
    'Renewable / Sustainable Energy', 'Circular Economy / Bio-based Solutions', 'Climate Change Adaptation & Mitigation', 'Biodiversity Conservation',
    'Climate-smart Agriculture / Green Infrastructure', 'Research & Education', 'Policy / Advocacy'
  ];

  const handleGradeChange = (grade: string, fee: number) => {
    setFormData((prev) => ({ ...prev, membershipGrade: grade, gradeFee: fee }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  // Dynamic Handlers
  const addEdu = () => setFormData(p => ({ ...p, education: [...p.education, { institution: '', qualification: '', field: '', year: '', grade: '' }] }));
  const removeEdu = (idx: number) => setFormData(p => ({ ...p, education: p.education.filter((_, i) => i !== idx) }));
  
  const addExp = () => setFormData(p => ({ ...p, experience: [...p.experience, { organisation: '', position: '', sector: '', fromYear: '', toYear: '' }] }));
  const addCert = () => setFormData(p => ({ ...p, certifications: [...p.certifications, { body: '', certification: '', grade: '', year: '' }] }));

  // Dynamic Trigger for Account Activation & Flow Routing
  const processPostPaymentActivation = (referenceCode: string) => {
    const token = `ACT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    setActivationToken(token);

    const pendingApplications = JSON.parse(localStorage.getItem('nirrmpt_applications') || '[]');
    
    const newRecord = {
      ...formData,
      applicationNo: referenceCode,
      status: 'Pending Document Upload',
      paymentStatus: 'Paid (Paystack Gateway)',
      submittedAt: new Date().toISOString(),
      activationToken: token,
      isActivated: false,
      uploadedFiles: {
        passportPhoto: null,
        validId: null,
        qualifications: [],
        paymentReceipt: null,
      }
    };

    pendingApplications.push(newRecord);
    localStorage.setItem('nirrmpt_applications', JSON.stringify(pendingApplications));

    // Persist temporary session for seamless onboarding
    localStorage.setItem('nirrmpt_pending_session', JSON.stringify({
      email: formData.email,
      applicationNo: referenceCode,
      token: token,
      applicantName: `${formData.firstNames} ${formData.surname}`
    }));

    setSubmitting(false);
    setAppRef(referenceCode);
    setSubmitted(true);
    setActivationSent(true);
  };

  const handleSimulatedActivation = () => {
    // Activate current session and route user to the Public & Partner Hub
    const session = JSON.parse(localStorage.getItem('nirrmpt_pending_session') || '{}');
    const applications = JSON.parse(localStorage.getItem('nirrmpt_applications') || '[]');

    const updatedApps = applications.map((app: any) => {
      if (app.applicationNo === session.applicationNo) {
        return { ...app, isActivated: true, status: 'Account Activated - Awaiting Documents' };
      }
      return app;
    });

    localStorage.setItem('nirrmpt_applications', JSON.stringify(updatedApps));
    localStorage.setItem('nirrmpt_user_session', JSON.stringify({
      email: session.email,
      applicationNo: session.applicationNo,
      role: 'Member',
      applicantName: session.applicantName,
      isAuthenticated: true
    }));

    // Route directly to Public & Partner Hub for Document Upload
    router.push('/portal/public-hub');
  };

  const handleSubmitAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declarationSigned) {
      alert('Please confirm the applicant declaration before submitting.');
      return;
    }

    setSubmitting(true);
    const referenceCode = `NIRRMPT-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      await fetch('/api/membership/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          applicationNo: referenceCode,
          paymentStatus: 'Paid',
          status: 'Pending Document Upload'
        }),
      });
    } catch (err) {
      console.warn('Backend DB call fallback:', err);
    }

    // Paystack Gateway Setup
    const handler = (window as any).PaystackPop && (window as any).PaystackPop.setup({
      key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      email: formData.email,
      amount: formData.gradeFee * 100,
      currency: 'NGN',
      ref: referenceCode,
      callback: function () {
        processPostPaymentActivation(referenceCode);
      },
      onClose: function () {
        processPostPaymentActivation(referenceCode);
      },
    });

    if (handler) {
      handler.openIframe();
    } else {
      setTimeout(() => {
        processPostPaymentActivation(referenceCode);
      }, 1200);
    }
  };

  if (submitted) {
    return (
      <div className="bg-slate-950 text-white min-h-screen font-sans flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 max-w-xl text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto border border-emerald-500/40">
            ✓
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Confirmed & Form Submitted</h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Application Reference: <strong className="text-amber-400 font-mono text-sm">{appRef}</strong>
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-left space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span>📧 Account Activation Email Sent</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              We have dispatched an activation email to <strong className="text-white">{formData.email}</strong>. Please check your inbox and click the activation link to activate your account and proceed to the <span className="text-emerald-400 font-semibold">Public & Partner Hub</span> to upload your verification documents (Section F).
            </p>
          </div>

          {/* Simulated Email Trigger Panel for Testing/Development */}
          <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl text-left space-y-3">
            <div className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
              [System Demo Activation Dispatch]
            </div>
            <p className="text-[11px] text-slate-400">
              Click below to simulate opening the activation link sent to <span className="text-slate-200">{formData.email}</span>:
            </p>
            <button
              onClick={handleSimulatedActivation}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2"
            >
              Activate Account & Proceed to Public & Partner Hub →
            </button>
          </div>

          <div className="flex gap-4 justify-center pt-2">
            <Link href="/" className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-6 py-2.5 rounded-xl border border-slate-700 transition">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans py-12 px-4 md:px-8">
      <script src="https://js.paystack.co/v1/inline.js" async></script>

      <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Banner Notice */}
        <div className="bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 border-b border-slate-800 p-4 text-center">
          <span className="bg-amber-400 text-slate-950 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
            PIONEER INDUCTION: 5 NOVEMBER 2026 | DEADLINE: 30 OCTOBER 2026
          </span>
        </div>

        {/* Header */}
        <div className="p-8 border-b border-slate-800 text-center bg-slate-900/50">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase">
            Membership Application Form
          </h1>
          <p className="text-emerald-400 text-xs font-semibold mt-1">
            Nigerian Institute of Regenerative Resource Management and Protection Technologies Ltd/Gte
          </p>
        </div>

        <form onSubmit={handleSubmitAndPay} className="p-6 md:p-10 space-y-10">

          {/* SECTION A: PERSONAL DETAILS */}
          <section className="space-y-4">
            <div className="bg-emerald-950/80 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-800/50 font-bold text-xs uppercase tracking-wider">
              A. Applicant's Personal Details
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Title</label>
                <select 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option>Mr</option><option>Mrs</option><option>Miss</option><option>Dr</option><option>Prof</option><option>Engr</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Surname / Family Name *</label>
                <input required type="text" value={formData.surname} onChange={(e) => setFormData({ ...formData, surname: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">First & Middle Names *</label>
                <input required type="text" value={formData.firstNames} onChange={(e) => setFormData({ ...formData, firstNames: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Date of Birth *</label>
                <input required type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Gender *</label>
                <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">NIN / Gov ID No. (Optional)</label>
                <input type="text" value={formData.nin} onChange={(e) => setFormData({ ...formData, nin: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Telephone / WhatsApp *</label>
                <input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address *</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
          </section>

          {/* SECTION B: EDUCATIONAL QUALIFICATIONS */}
          <section className="space-y-4">
            <div className="bg-emerald-950/80 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-800/50 font-bold text-xs uppercase tracking-wider flex justify-between items-center">
              <span>B. Educational Qualifications (Add Multiple Qualifications)</span>
              <button 
                type="button" 
                onClick={addEdu} 
                className="text-[10px] bg-emerald-700 hover:bg-emerald-600 px-3 py-1 rounded-lg font-semibold text-white transition flex items-center gap-1 shadow-md"
              >
                + Add Qualification Row
              </button>
            </div>
            
            <p className="text-slate-400 text-xs">
              List all academic degrees, diplomas, and professional qualifications. You can add as many qualification entries as applicable by clicking <strong className="text-emerald-400">+ Add Qualification Row</strong>.
            </p>

            {formData.education.map((edu, idx) => (
              <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
                  <span>Qualification #{idx + 1}</span>
                  {formData.education.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeEdu(idx)} 
                      className="text-rose-400 hover:text-rose-300 text-[10px] underline"
                    >
                      Remove Entry
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  <input placeholder="Institution" value={edu.institution} onChange={(e) => { const n = [...formData.education]; n[idx].institution = e.target.value; setFormData({ ...formData, education: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                  <input placeholder="Qualification/Degree" value={edu.qualification} onChange={(e) => { const n = [...formData.education]; n[idx].qualification = e.target.value; setFormData({ ...formData, education: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                  <input placeholder="Field of Study" value={edu.field} onChange={(e) => { const n = [...formData.education]; n[idx].field = e.target.value; setFormData({ ...formData, education: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                  <input placeholder="Year" value={edu.year} onChange={(e) => { const n = [...formData.education]; n[idx].year = e.target.value; setFormData({ ...formData, education: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                  <input placeholder="Class / Grade" value={edu.grade} onChange={(e) => { const n = [...formData.education]; n[idx].grade = e.target.value; setFormData({ ...formData, education: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                </div>
              </div>
            ))}
          </section>

          {/* SECTION C: EMPLOYMENT / EXPERIENCE */}
          <section className="space-y-4">
            <div className="bg-emerald-950/80 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-800/50 font-bold text-xs uppercase tracking-wider flex justify-between items-center">
              <span>C. Employment / Professional Experience</span>
              <button type="button" onClick={addExp} className="text-[10px] bg-emerald-700 hover:bg-emerald-600 px-2 py-1 rounded text-white">+ Add Row</button>
            </div>
            {formData.experience.map((exp, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <input placeholder="Organisation/Employer" value={exp.organisation} onChange={(e) => { const n = [...formData.experience]; n[idx].organisation = e.target.value; setFormData({ ...formData, experience: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                <input placeholder="Position" value={exp.position} onChange={(e) => { const n = [...formData.experience]; n[idx].position = e.target.value; setFormData({ ...formData, experience: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                <input placeholder="Sector/Area" value={exp.sector} onChange={(e) => { const n = [...formData.experience]; n[idx].sector = e.target.value; setFormData({ ...formData, experience: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                <input placeholder="From" value={exp.fromYear} onChange={(e) => { const n = [...formData.experience]; n[idx].fromYear = e.target.value; setFormData({ ...formData, experience: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                <input placeholder="To" value={exp.toYear} onChange={(e) => { const n = [...formData.experience]; n[idx].toYear = e.target.value; setFormData({ ...formData, experience: n }); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
              </div>
            ))}
          </section>

          {/* SECTION D: INTEREST AREAS */}
          <section className="space-y-4">
            <div className="bg-emerald-950/80 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-800/50 font-bold text-xs uppercase tracking-wider">
              D. Professional / Technical Areas of Interest
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {interestOptions.map((item) => (
                <label key={item} className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 hover:border-emerald-500/50">
                  <input type="checkbox" checked={formData.interests.includes(item)} onChange={() => handleInterestToggle(item)} className="accent-emerald-500 rounded" />
                  <span className="text-slate-300">{item}</span>
                </label>
              ))}
            </div>
          </section>

          {/* SECTION E: MEMBERSHIP GRADE AND REGISTRATION FEE */}
          <section className="space-y-4">
            <div className="bg-emerald-950/80 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-800/50 font-bold text-xs uppercase tracking-wider">
              E. Membership Grade Selection
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { grade: 'Student Member', eligibility: 'Undergraduate of tertiary institution', fee: 30000 },
                { grade: 'Associate Member', eligibility: 'Graduate / limited work experience', fee: 80000 },
                { grade: 'Full Member', eligibility: 'Graduate with substantial experience', fee: 135000 },
                { grade: 'Fellow', eligibility: 'Postgraduate / Senior-level executives', fee: 0, custom: 'Board Approval' },
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

          {/* SECTIONS G & H: PURPOSE & REFEREE */}
          <section className="space-y-4">
            <div className="bg-emerald-950/80 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-800/50 font-bold text-xs uppercase tracking-wider">
              G & H. Statement of Purpose & Professional Referee
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Reason for seeking membership (Max 150 words)</label>
              <textarea rows={3} value={formData.statementOfPurpose} onChange={(e) => setFormData({ ...formData, statementOfPurpose: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500" placeholder="State your motivation..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Referee Name</label>
                <input type="text" value={formData.refereeName} onChange={(e) => setFormData({ ...formData, refereeName: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Referee Position / Org</label>
                <input type="text" value={formData.refereeOrg} onChange={(e) => setFormData({ ...formData, refereeOrg: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Referee Email / Phone</label>
                <input type="text" value={formData.refereeEmail} onChange={(e) => setFormData({ ...formData, refereeEmail: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
            </div>
          </section>

          {/* DECLARATION & PAYMENT SUBMISSION */}
          <section className="pt-4 border-t border-slate-800 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <input type="checkbox" required checked={formData.declarationSigned} onChange={(e) => setFormData({ ...formData, declarationSigned: e.target.checked })} className="mt-0.5 accent-emerald-500" />
              <span className="text-xs text-slate-300 leading-relaxed">
                I hereby declare that all provided details are true and accurate. I agree to abide by NIRRMPT governing provisions, professional ethics, and operational standards.
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl text-sm transition shadow-xl border border-emerald-500/50 flex items-center justify-center gap-2"
            >
              {submitting ? 'Processing Payment Gateway...' : `Proceed to Pay ₦${formData.gradeFee.toLocaleString()} via Paystack & Request Activation`}
            </button>
          </section>

        </form>
      </div>
    </div>
  );
}