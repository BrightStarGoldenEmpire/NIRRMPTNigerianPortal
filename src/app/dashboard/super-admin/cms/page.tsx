import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateSiteContent, seedDefaultCmsContent } from "@/app/actions/cms";
import {
  Globe,
  BookOpen,
  Users,
  Building2,
  Newspaper,
  Calendar,
  Image as ImageIcon,
  Scale,
  GraduationCap,
  Phone,
  ArrowLeft,
  Save,
  Sparkles,
  BarChart3,
  Layers,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

const NAVBAR_PAGES = [
  { id: "home", label: "Home Page", icon: Globe },
  { id: "about", label: "About Us", icon: BookOpen },
  { id: "leadership", label: "Leadership & Board", icon: Users },
  { id: "departments", label: "Departments", icon: Building2 },
  { id: "news", label: "News & Press", icon: Newspaper },
  { id: "events", label: "Events Calendar", icon: Calendar },
  { id: "gallery", label: "Media Gallery", icon: ImageIcon },
  { id: "foi", label: "Freedom of Info (FOI)", icon: Scale },
  { id: "training", label: "Training Directorate", icon: GraduationCap },
  { id: "contact", label: "Contact & Desks", icon: Phone },
];

export default async function SuperAdminCmsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentTab = resolvedParams?.tab || "home";

  // Fetch all site content from Supabase
  const allContent = await prisma.siteContent.findMany();
  const contentMap: Record<string, string> = {};
  allContent.forEach((item) => {
    contentMap[item.key] = item.value;
  });

  const getVal = (key: string, def: string) => contentMap[key] || def;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10 font-sans space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <Link
              href="/dashboard/super-admin"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition mb-2"
            >
              <ArrowLeft size={14} /> Back to Super Admin Terminal
            </Link>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider inline-block">
                Master 10-Page Public CMS
              </span>
            </div>
            <h1 className="text-3xl font-black text-white mt-1">
              Public Website Content & Navbar Editor
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Select any of the 10 navigation pages below to edit headlines, statements, addresses, and statistics live.
            </p>
          </div>

          {allContent.length === 0 && (
            <form action={seedDefaultCmsContent}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md"
              >
                <Sparkles size={14} />
                <span>Load Default Texts (All 10 Pages)</span>
              </button>
            </form>
          )}
        </div>

        {/* 10 Navigation Bar Page Tabs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex gap-1.5 overflow-x-auto shadow-xl">
          {NAVBAR_PAGES.map((page) => {
            const Icon = page.icon;
            const isActive = currentTab === page.id;
            return (
              <Link
                key={page.id}
                href={`/dashboard/super-admin/cms?tab=${page.id}`}
                scroll={false}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#004d2c] text-white shadow-md border border-emerald-500/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon size={14} className={isActive ? "text-emerald-300" : "text-slate-500"} />
                <span>{page.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Master Form For Selected Page */}
        <form action={updateSiteContent} className="space-y-8">

          {/* TAB 1: HOME PAGE */}
          {currentTab === "home" && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="flex items-center gap-2 text-emerald-400 border-b border-slate-800 pb-4">
                  <Globe size={20} />
                  <h2 className="text-lg font-bold text-white">Home Page: Hero Banner & Badges</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Top Federal Badge Text</label>
                    <input name="cms_home_hero_badge" type="text" defaultValue={getVal("home_hero_badge", "Official Federal Portal – Republic of Nigeria")} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Main Hero Headline</label>
                    <textarea name="cms_home_hero_title" rows={2} defaultValue={getVal("home_hero_title", "Nigerian Institute of Regenerative Resource Management and Protection Technologies (NIRRMPT)")} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-bold text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Hero Subtitle & Statement</label>
                    <textarea name="cms_home_hero_subtitle" rows={3} defaultValue={getVal("home_hero_subtitle", "Advancing science, policy, and technology to manage natural resources regeneratively and protect ecosystems across Nigeria.")} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 leading-relaxed" />
                  </div>
                </div>
              </div>

              {/* Statistics Counters */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2 text-amber-400">
                  <BarChart3 size={18} />
                  <span>Homepage 4 Live Metric Boxes</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Box 1 Value & Label</label>
                    <input name="cms_home_stat_coverage_num" defaultValue={getVal("home_stat_coverage_num", "36")} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm font-black text-white" />
                    <input name="cms_home_stat_coverage_label" defaultValue={getVal("home_stat_coverage_label", "STATES + FCT COVERAGE")} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300" />
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Box 2 Value & Label</label>
                    <input name="cms_home_stat_compliance_num" defaultValue={getVal("home_stat_compliance_num", "100%")} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm font-black text-white" />
                    <input name="cms_home_stat_compliance_label" defaultValue={getVal("home_stat_compliance_label", "NDPR COMPLIANT PORTAL")} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300" />
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Box 3 Value & Label</label>
                    <input name="cms_home_stat_projects_num" defaultValue={getVal("home_stat_projects_num", "142+")} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm font-black text-white" />
                    <input name="cms_home_stat_projects_label" defaultValue={getVal("home_stat_projects_label", "R&D CONSERVATION PROJECTS")} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300" />
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Box 4 Value & Label</label>
                    <input name="cms_home_stat_api_num" defaultValue={getVal("home_stat_api_num", "RESTful")} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm font-black text-white" />
                    <input name="cms_home_stat_api_label" defaultValue={getVal("home_stat_api_label", "INTER-MDA API NETWORK")} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT US */}
          {currentTab === "about" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 border-b border-slate-800 pb-4">
                <BookOpen size={20} />
                <h2 className="text-lg font-bold text-white">About Us: Mandate, Vision & Mission</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Page Title Heading</label>
                  <input name="cms_about_heading" type="text" defaultValue={getVal("about_heading", "About the Institute & Statutory Mandate")} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Official Mission Statement</label>
                  <textarea name="cms_about_mission" rows={3} defaultValue={getVal("about_mission", "To pioneer restorative ecological engineering, enforce statutory environmental compliance, and safeguard critical aquifers, mangroves, and soils through advanced science and community stewardship.")} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Official Vision Statement</label>
                  <textarea name="cms_about_vision" rows={3} defaultValue={getVal("about_vision", "A resilient Nigerian ecosystem where natural resources are replenished faster than extraction through sovereign technologies and regulatory discipline.")} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Statutory Legal Mandate Text</label>
                  <textarea name="cms_about_mandate" rows={3} defaultValue={getVal("about_mandate", "Established as the federal authority for regenerative resource monitoring, EIA validation, and environmental risk mitigation across all geopolitical zones.")} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LEADERSHIP & BOARD */}
          {currentTab === "leadership" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-2 text-purple-400 border-b border-slate-800 pb-4">
                <Users size={20} />
                <h2 className="text-lg font-bold text-white">Leadership & Governing Board Texts</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Leadership Page Heading</label>
                  <input name="cms_leadership_heading" type="text" defaultValue={getVal("leadership_heading", "Governing Board & Directorate Leadership")} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Director General / Chief Executive's Address</label>
                  <textarea name="cms_leadership_dg_speech" rows={4} defaultValue={getVal("leadership_dg_speech", "Welcome to the NIRRMPT Federal Portal. Our mandate is clear: to ensure no Nigerian ecological asset is depleted without regenerative mitigation.")} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DEPARTMENTS */}
          {currentTab === "departments" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-2 text-cyan-400 border-b border-slate-800 pb-4">
                <Building2 size={20} />
                <h2 className="text-lg font-bold text-white">Departments & Directorate Overviews</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Environmental Protection & Compliance Division</label>
                  <textarea name="cms_dept_env_desc" rows={2} defaultValue={getVal("dept_env_desc", "Field inspection, compliance vetting, effluent testing, and bio-remediation protocol enforcement.")} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">GIS & Remote Sensing Division</label>
                  <textarea name="cms_dept_gis_desc" rows={2} defaultValue={getVal("dept_gis_desc", "Satellite telemetry, multispectral radar ground-truthing, and spatial reserve mapping.")} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Hydrological & Water Resources Division</label>
                  <textarea name="cms_dept_hydro_desc" rows={2} defaultValue={getVal("dept_hydro_desc", "Subterranean aquifer protection, heavy metal testing, and river basin telemetry.")} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: NEWS */}
          {currentTab === "news" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-2 text-amber-400 border-b border-slate-800 pb-4">
                <Newspaper size={20} />
                <h2 className="text-lg font-bold text-white">Newsroom & Press Bulletins</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Newsroom Heading</label>
                  <input name="cms_news_heading" type="text" defaultValue={getVal("news_heading", "Official Gazette, News & Press Bulletins")} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Urgent Press Notice / Emergency Directive</label>
                  <textarea name="cms_news_press_notice" rows={3} defaultValue={getVal("news_press_notice", "DIRECTIVE: All industrial operators in Sector 4 must file Q4 EIA compliance dossiers by statutory deadline.")} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Media Liaison Email</label>
                  <input name="cms_news_media_email" type="email" defaultValue={getVal("news_media_email", "press@nirrmpt.org")} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: EVENTS */}
          {currentTab === "events" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 border-b border-slate-800 pb-4">
                <Calendar size={20} />
                <h2 className="text-lg font-bold text-white">Events & Conferences Copy</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Events Section Heading</label>
                  <input name="cms_events_heading" type="text" defaultValue={getVal("events_heading", "National Environmental Summits & Technical Conferences")} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Events Introduction / Guidelines</label>
                  <textarea name="cms_events_subheading" rows={3} defaultValue={getVal("events_subheading", "Upcoming stakeholder symposiums, field clinics, and technical capacity-building sessions across geopolitical zones.")} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: GALLERY */}
          {currentTab === "gallery" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-2 text-cyan-400 border-b border-slate-800 pb-4">
                <ImageIcon size={20} />
                <h2 className="text-lg font-bold text-white">Media Gallery & Archival Copy</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Gallery Heading</label>
                  <input name="cms_gallery_heading" type="text" defaultValue={getVal("gallery_heading", "Official Field Photography & Video Archive")} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Archival Description</label>
                  <textarea name="cms_gallery_subheading" rows={2} defaultValue={getVal("gallery_subheading", "Visual records of active mangrove restoration, gully erosion engineering, and satellite survey teams.")} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: FOI */}
          {currentTab === "foi" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-2 text-amber-400 border-b border-slate-800 pb-4">
                <Scale size={20} />
                <h2 className="text-lg font-bold text-white">Freedom of Information (FOI) Statutory Desk</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">FOI Page Title</label>
                  <input name="cms_foi_heading" type="text" defaultValue={getVal("foi_heading", "Freedom of Information Act (2011) Statutory Disclosure Portal")} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Statutory Response Window Notice</label>
                  <input name="cms_foi_turnaround_time" type="text" defaultValue={getVal("foi_turnaround_time", "Mandatory 7-Day Statutory Response Window")} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Legal Notice & Guidelines</label>
                  <textarea name="cms_foi_legal_notice" rows={3} defaultValue={getVal("foi_legal_notice", "Requests for environmental records, baseline studies, and public reports are processed strictly under the provisions of the FOI Act (2011).")} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: TRAINING */}
          {currentTab === "training" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 border-b border-slate-800 pb-4">
                <GraduationCap size={20} />
                <h2 className="text-lg font-bold text-white">Training Directorate & Certification Texts</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Training Portal Heading</label>
                  <input name="cms_training_heading" type="text" defaultValue={getVal("training_heading", "Professional Capacity Building & Technical Certifications")} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Accreditation & Certification Standards Badge</label>
                  <input name="cms_training_accreditation" type="text" defaultValue={getVal("training_accreditation", "Federal Certification for Environmental Officers and Corporate Compliance Auditors")} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: CONTACT */}
          {currentTab === "contact" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-2 text-cyan-400 border-b border-slate-800 pb-4">
                <Phone size={20} />
                <h2 className="text-lg font-bold text-white">Contact Info & Official Directives</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Official Hotline</label>
                  <input name="cms_contact_hotline" type="text" defaultValue={getVal("contact_hotline", "+2349114440220")} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Headquarters Location</label>
                  <input name="cms_contact_address" type="text" defaultValue={getVal("contact_address", "Port Harcourt, Rivers State")} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Official Inquiries Email</label>
                  <input name="cms_contact_email" type="email" defaultValue={getVal("contact_email", "info@nirrmpt.org")} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Working Hours</label>
                  <input name="cms_contact_hours" type="text" defaultValue={getVal("contact_hours", "Monday – Friday: 08:00 – 17:00 WAT")} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                </div>
              </div>
            </div>
          )}

          {/* Sticky Save Button */}
          <div className="flex justify-between items-center sticky bottom-6 z-20 bg-slate-900/90 backdrop-blur border border-slate-800 p-4 rounded-2xl shadow-2xl">
            <span className="text-xs text-slate-400">
              Active Editor: <strong className="text-emerald-400 uppercase">{NAVBAR_PAGES.find(p => p.id === currentTab)?.label}</strong>
            </span>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#004d2c] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              <Save size={15} />
              <span>Save & Publish Live</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}