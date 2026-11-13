"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Calendar,
  MapPin,
  Clock,
  Award,
  CheckCircle2,
  Users,
  Search,
  BookOpen,
  ArrowRight,
  X,
  FileCheck,
  Loader2,
} from "lucide-react";
import { registerPublicTrainee } from "@/app/actions/training";

interface TrainingCourse {
  id: string;
  code: string;
  title: string;
  category: "Regulatory Compliance" | "Spatial Analytics" | "Field Operations" | "Resource Governance";
  format: "Onsite" | "Virtual" | "Hybrid";
  startDate: string;
  endDate: string;
  duration: string;
  venue: string;
  capacity: number;
  enrolled: number;
  instructor: string;
  description: string;
  curriculum: string[];
  certification: string;
}

const COURSES: TrainingCourse[] = [
  {
    id: "trn-01",
    code: "NIR-EIA-2026",
    title: "Statutory Environmental Impact Assessment (EIA) Certification",
    category: "Regulatory Compliance",
    format: "Hybrid",
    startDate: "Nov 16, 2026",
    endDate: "Nov 20, 2026",
    duration: "5 Days Intensive",
    venue: "NIRRMPT Directorate Hall B, Port Harcourt / Streamed Online",
    capacity: 60,
    enrolled: 44,
    instructor: "Dr. Emmanuel Etuk, FNIRRMPT",
    description:
      "Official statutory certification program covering federal EIA guidelines, soil & aquifer auditing, ecological mitigation planning, and statutory reporting under NDPR data-privacy mandates.",
    curriculum: [
      "Federal Environmental Standards & Statutory Mandates",
      "Field Data Acquisition & Soil Chemical Profiling",
      "Hydrological Risk Modeling in Sensitive Basins",
      "Public Consultation & Legal Stakeholder Frameworks",
      "Comprehensive Audit Report Defense & Filing",
    ],
    certification: "Certified EIA Compliance Officer (CECO)",
  },
  {
    id: "trn-02",
    code: "NIR-GIS-2026",
    title: "Advanced Geospatial Mapping & Natural Resource Telemetry",
    category: "Spatial Analytics",
    format: "Onsite",
    startDate: "Dec 02, 2026",
    endDate: "Dec 05, 2026",
    duration: "4 Days Practical",
    venue: "GIS Regional Training Lab, Rivers State Command",
    capacity: 35,
    enrolled: 29,
    instructor: "Engr. Amina Abubakar, MNSE",
    description:
      "Hands-on technical laboratory training on Sentinel satellite imagery interpretation, remote sensing ground-truthing, and live database telemetry mapping for conservation reserves.",
    curriculum: [
      "Satellite Remote Sensing & Multispectral Band Analysis",
      "QGIS & ArcGIS Data Layer Synthesis",
      "GPS Field Survey Point Integration & Georeferencing",
      "Forest Canopy & Aquifer Depletion Mapping",
      "Exporting Clean Spatial GeoJSON for Inter-MDA Portals",
    ],
    certification: "Certified Resource GIS Analyst (CRGA)",
  },
  {
    id: "trn-03",
    code: "NIR-REM-2027",
    title: "Regenerative Agro-Ecosystems & Soil Remediation Masterclass",
    category: "Field Operations",
    format: "Onsite",
    startDate: "Jan 18, 2027",
    endDate: "Jan 22, 2027",
    duration: "5 Days Field Clinic",
    venue: "Agricultural Ecological Field Base, Rivers State",
    capacity: 45,
    enrolled: 18,
    instructor: "Prof. Kenneth Okafor",
    description:
      "Field-based masterclass focused on active bio-remediation protocols, degraded coastal mangrove re-vegetation, soil microbiome recovery, and organic carbon sequestration.",
    curriculum: [
      "Soil Chemistry Assessment & Salinity Remediation",
      "Mangrove Restoration Protocols & Wetland Hydrology",
      "Organic Microbiome Inoculation & Topsoil Recovery",
      "Field Inspection Safety Equipment Standards",
      "Post-Remediation Verification & Continuous Telemetry",
    ],
    certification: "Certified Ecological Remediation Specialist (CERS)",
  },
  {
    id: "trn-04",
    code: "NIR-GOV-2027",
    title: "National Environmental Law, Policy & Stakeholder Governance",
    category: "Resource Governance",
    format: "Virtual",
    startDate: "Feb 08, 2027",
    endDate: "Feb 10, 2027",
    duration: "3 Days Webinar",
    venue: "Official NIRRMPT Virtual Training Platform",
    capacity: 150,
    enrolled: 72,
    instructor: "Barr. Florence Danjuma",
    description:
      "Legal and policy framework executive seminar for corporate leaders, MDA legal officers, and environmental advocates on federal regulatory enforcement and community rights.",
    curriculum: [
      "Federal Environmental Protection Legislation Review",
      "Statutory Dispute Resolution & Community Compacts",
      "Corporate Environmental Compliance Liability",
      "FOI Statutory Obligations & Information Rights",
      "Inter-Agency Compliance Enforcement Coordination",
    ],
    certification: "Executive Certificate in Environmental Law & Governance",
  },
];

export default function TrainingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
  });

  const categories = ["All", "Regulatory Compliance", "Spatial Analytics", "Field Operations", "Resource Governance"];

  const filteredCourses = COURSES.filter((course) => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await registerPublicTrainee({
      courseCode: selectedCourse.code,
      courseTitle: selectedCourse.title,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      organization: formData.organization,
    });

    setIsSubmitting(false);

    if (res.success && res.registrationNumber) {
      setRegistrationSuccess(res.registrationNumber);
    } else {
      setErrorMessage(res.error || "Failed to submit enrollment to database.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
            <GraduationCap size={16} />
            <span>Federal Professional Capacity Building Program</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            NIRRMPT Training & Certification Directorate
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Statutory professional development, EIA auditing certifications, and hands-on geospatial training for environmental officers, researchers, and institutional leaders.
          </p>
        </div>

        {/* Filter */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search course title, code, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#004d2c] text-emerald-200 border border-emerald-500/40 shadow-sm"
                    : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => {
            const seatsLeft = course.capacity - course.enrolled;
            return (
              <div
                key={course.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-all shadow-md group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                      {course.code}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                        {course.format}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-amber-950/50 text-amber-300 border border-amber-500/30 font-medium">
                        {seatsLeft} seats left
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-emerald-400" />
                      <span>{course.startDate} – {course.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-emerald-400" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <MapPin size={14} className="text-emerald-400 shrink-0" />
                      <span className="truncate">{course.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <Award size={14} className="text-amber-400 shrink-0" />
                      <span className="text-amber-300/90 font-medium">{course.certification}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between gap-4 mt-6">
                  <div className="text-xs text-slate-400">
                    Lead: <span className="text-white font-semibold">{course.instructor}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setRegistrationSuccess(null);
                      setErrorMessage(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#004d2c] hover:bg-emerald-700 text-white transition shadow-sm"
                  >
                    <span>View Syllabus & Register</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute right-6 top-6 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>

              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500/30">
                  {selectedCourse.code}
                </span>
                <h2 className="text-2xl font-black text-white mt-3">
                  {selectedCourse.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Certification Award: <strong className="text-amber-400">{selectedCourse.certification}</strong>
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FileCheck size={14} className="text-emerald-400" />
                  Key Modules & Syllabus
                </h4>
                <ul className="text-xs text-slate-400 space-y-1.5 pl-4 list-disc">
                  {selectedCourse.curriculum.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-xl text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}

              {registrationSuccess ? (
                <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-3">
                  <CheckCircle2 size={36} className="mx-auto text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Enrollment Confirmed & Saved in Database!</h3>
                  <p className="text-xs text-slate-300">
                    Your candidate profile has been registered under Statutory Registration ID:
                  </p>
                  <p className="font-mono text-base font-black text-amber-400 bg-slate-950 py-1.5 px-4 rounded-lg inline-block border border-slate-800">
                    {registrationSuccess}
                  </p>
                  <p className="text-xs text-slate-400">
                    Your trainee account has been saved in the NIRRMPT central database.
                  </p>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="mt-4 px-6 py-2 bg-[#004d2c] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnrollSubmit} className="space-y-4 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Candidate Enrollment Form (Direct Database Submission)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. Emmanuel Etuk"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Official Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.etuk@institution.org"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+234 800 000 0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Organization / MDA</label>
                      <input
                        type="text"
                        placeholder="Ministry of Environment / Private"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setSelectedCourse(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold bg-[#004d2c] hover:bg-emerald-700 text-white shadow-md transition"
                    >
                      {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                      <span>{isSubmitting ? "Saving to Database..." : "Confirm Official Enrollment"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}