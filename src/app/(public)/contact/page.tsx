"use client";

import React, { useState } from "react";
import { submitContactMessage } from "@/app/actions/contact";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  Loader2,
} from "lucide-react";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await submitContactMessage(formData);

    setSubmitting(false);
    if (res.success) {
      setSubmitted(true);
    } else {
      setErrorMsg(res.error || "Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-[#004d2c] text-xs font-bold uppercase tracking-wider">
            <Building2 size={16} />
            <span>Official Government Communications Desk</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Contact NIRRMPT Headquarters
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Statutory inquiries, environmental emergency reporting, and inter-agency correspondence channels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Card */}
          <div className="bg-[#004d2c] text-white p-8 rounded-3xl space-y-8 shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xl font-black border-b border-emerald-600/60 pb-3">
                Liaison Directives
              </h3>
              <div className="space-y-5 text-xs text-emerald-100">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm">Headquarters</strong>
                    Port Harcourt, Rivers State, Federal Republic of Nigeria
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm">Hotline</strong>
                    +2349114440220 / +2348025252362
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm">Official Inquiries</strong>
                    info@nirrmpt.org / compliance@nirrmpt.org
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm">Service Hours</strong>
                    Monday – Friday: 08:00 – 17:00 WAT
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-700/60 text-[11px] text-emerald-200 font-mono">
              Statutory 48-Hour Official Correspondence Protocol
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 size={48} className="mx-auto text-emerald-600" />
                <h3 className="text-2xl font-black text-slate-900">Message Dispatched & Recorded</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your formal message has been permanently saved into the NIRRMPT central database and routed to the Directorate Administrative Desk.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 bg-[#004d2c] text-white rounded-xl text-xs font-bold shadow"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Transmit Official Message</h3>

                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle size={15} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                    <input name="fullName" required placeholder="Dr. Amina Bello" className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:border-[#004d2c] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Official Email *</label>
                    <input name="email" type="email" required placeholder="a.bello@institution.org" className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:border-[#004d2c] focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Telephone Number</label>
                    <input name="phone" placeholder="+234 800 000 0000" className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:border-[#004d2c] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject Matter *</label>
                    <input name="subject" required placeholder="Environmental Baseline Inquiries" className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:border-[#004d2c] focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message Content *</label>
                  <textarea name="message" rows={5} required placeholder="Detail your operational or statutory inquiry here..." className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:border-[#004d2c] focus:outline-none" />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#004d2c] hover:bg-[#003820] text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  <span>{submitting ? "Transmitting to Database..." : "Send Official Inquiry"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}