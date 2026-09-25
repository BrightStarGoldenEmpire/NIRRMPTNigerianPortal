'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      type: 'video',
      src: '/videos/hero.mp4',
      badge: 'Federal Portal Platform',
      title: 'Nigerian Institute of Regenerative Resource Management and Protection Technologies (NIRRMPT)',
      subtitle: 'Advancing science, policy, and technology to manage natural resources regeneratively and protect ecosystems across Nigeria.',
      primaryBtnText: 'Apply for Membership',
      primaryBtnLink: '/membership/apply',
      secondaryBtnText: 'Call for Applications',
      secondaryBtnLink: '/applications/call',
    },
    {
      id: 2,
      type: 'image',
      bgGradient: 'from-slate-950 via-[#0F392B] to-[#0b1329]',
      badge: 'Satellite & Ecological Monitoring',
      title: 'Real-time Geospatial Resource Tracking & Preservation Systems',
      subtitle: 'Deploying advanced remote sensing, IoT sensor networks, and automated ecological satellite monitoring nationwide.',
      primaryBtnText: 'Explore GIS Map',
      primaryBtnLink: '/about',
      secondaryBtnText: 'View Mandate',
      secondaryBtnLink: '/about',
    },
    {
      id: 3,
      type: 'image',
      bgGradient: 'from-[#0b1329] via-[#144737] to-emerald-950',
      badge: 'Inter-MDA Interoperability',
      title: 'Unified Federal Data Exchange Networks & RESTful API Gateways',
      subtitle: 'Bridging state, federal, and local government environmental data feeds through automated encryption channels.',
      primaryBtnText: 'Access Portal Login',
      primaryBtnLink: '/portal/login',
      secondaryBtnText: 'API Documentation',
      secondaryBtnLink: '/applications/call',
    },
    {
      id: 4,
      type: 'image',
      bgGradient: 'from-emerald-950 via-[#0F392B] to-slate-900',
      badge: 'Capacity Building & Certification',
      title: 'Accreditation & Pioneer Professional Membership Induction 2026',
      subtitle: 'Empowering civil servants, researchers, and environmental leaders through standardized national certification modules.',
      primaryBtnText: 'Join the Institute',
      primaryBtnLink: '/membership/apply',
      secondaryBtnText: 'Induction Schedule',
      secondaryBtnLink: '/applications/call',
    },
    {
      id: 5,
      type: 'image',
      bgGradient: 'from-slate-900 via-[#0b1329] to-[#0F392B]',
      badge: 'Sustainable Watersheds & Agriculture',
      title: 'Regenerative Soil, Water, and Forest Protection Mandates',
      subtitle: 'Executing statutory duties under federal environmental regulations to sustain green infrastructure across 36 States + FCT.',
      primaryBtnText: 'Statutory Objectives',
      primaryBtnLink: '/about',
      secondaryBtnText: 'Contact Secretariat',
      secondaryBtnLink: '/about',
    }
  ];

  const navigatorLinks = [
    {
      title: 'Freedom of Information (FOI) Portal',
      href: '/foi',
      icon: 'fa-solid fa-arrow-right',
      highlight: false,
    },
    {
      title: 'Project Showcase',
      href: '/projects',
      icon: 'fa-solid fa-arrow-right',
      highlight: false,
    },
    {
      title: 'Digital Repository & Journals',
      href: '/repository',
      icon: 'fa-solid fa-arrow-right',
      highlight: false,
    },
    {
      title: 'Scientist Directory',
      href: '/scientists',
      icon: 'fa-solid fa-arrow-right',
      highlight: false,
    },
    {
      title: 'Training & Workshops',
      href: '/training',
      icon: 'fa-solid fa-arrow-right',
      highlight: false,
    },
    {
      title: 'Admin CMS & Document Management',
      href: '/portal/login',
      icon: 'fa-solid fa-lock',
      highlight: true,
    },
    {
      title: 'GIS Interactive Resource Map',
      href: '/gis-map',
      icon: 'fa-solid fa-map-location-dot',
      highlight: false,
    },
    {
      title: 'Permits & EIA Submission Portal',
      href: '/permits',
      icon: 'fa-solid fa-file-signature',
      highlight: false,
    },
    {
      title: 'Inter-MDA APIs & Reports',
      href: '/api-hub',
      icon: 'fa-solid fa-network-wired',
      highlight: false,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="bg-slate-50 text-slate-900 font-sans flex flex-col min-h-screen justify-between">
      <main className="space-y-12 pb-12">
        {/* Dynamic Multi-Slide Hero Section */}
        <section className="relative overflow-hidden bg-[#0b1329] text-white min-h-[460px] flex items-center">
          {heroSlides[currentSlide].type === 'video' ? (
            <div className="absolute inset-0 z-0 overflow-hidden">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover opacity-35"
              >
                <source src={heroSlides[currentSlide].src} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b1329]/90 via-[#0F392B]/80 to-[#0b1329]/90"></div>
            </div>
          ) : (
            <div className={`absolute inset-0 z-0 bg-gradient-to-r ${heroSlides[currentSlide].bgGradient} transition-all duration-1000`}></div>
          )}

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              
              <div className="md:col-span-7 transition-all duration-700 transform translate-y-0">
                <span className="inline-block bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
                  <i className="fa-solid fa-circle-dot mr-1.5 text-amber-400 animate-pulse"></i>
                  {heroSlides[currentSlide].badge}
                </span>

                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-white mb-4 drop-shadow-md">
                  {heroSlides[currentSlide].title}
                </h1>
                
                <p className="text-slate-200 text-sm md:text-base leading-relaxed mb-8 max-w-2xl font-normal">
                  {heroSlides[currentSlide].subtitle}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link 
                    href={heroSlides[currentSlide].primaryBtnLink} 
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-md transition shadow-md flex items-center gap-2 text-xs uppercase tracking-wider"
                  >
                    <i className="fa-solid fa-arrow-right"></i> {heroSlides[currentSlide].primaryBtnText}
                  </Link>
                  <Link 
                    href={heroSlides[currentSlide].secondaryBtnLink} 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-md transition shadow-md flex items-center gap-2 text-xs uppercase tracking-wider border border-emerald-500/40"
                  >
                    <i className="fa-solid fa-compass"></i> {heroSlides[currentSlide].secondaryBtnText}
                  </Link>
                </div>
              </div>

              {/* Statistics Panel */}
              <div className="md:col-span-5 grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm">
                  <div className="text-3xl font-extrabold text-amber-400">36</div>
                  <div className="text-[11px] text-slate-200 font-bold uppercase mt-1">States + FCT Coverage</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm">
                  <div className="text-3xl font-extrabold text-amber-400">100%</div>
                  <div className="text-[11px] text-slate-200 font-bold uppercase mt-1">NDPR Compliant Portal</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm">
                  <div className="text-3xl font-extrabold text-amber-400">142+</div>
                  <div className="text-[11px] text-slate-200 font-bold uppercase mt-1">R&D Projects</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm">
                  <div className="text-3xl font-extrabold text-amber-400">RESTful</div>
                  <div className="text-[11px] text-slate-200 font-bold uppercase mt-1">Inter-MDA API Network</div>
                </div>
              </div>

            </div>

            {/* Slide Controls */}
            <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-4">
              <div className="flex gap-2">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2.5 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex gap-2 text-xs">
                <button 
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/20 transition"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button 
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/20 transition"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Public Gateway Cards */}
        <section className="max-w-7xl mx-auto px-6 pt-6 w-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#0F392B]">Core Institute Portals & Public Gateway</h2>
            <p className="text-slate-500 text-xs">Enterprise Architectural Hub & Research Services Layout</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-700 text-xl mb-4">
                  <i className="fa-solid fa-laptop-code"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Home Gateway & Public Services</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-6">
                  Central hub for citizen interaction, statutory notices, interactive resource tracking, and portal access points.
                </p>
              </div>
              <div>
                <Link 
                  href="/membership/apply" 
                  className="bg-[#0F392B] hover:bg-emerald-900 text-white text-xs font-bold px-5 py-2.5 rounded-lg inline-flex items-center gap-2 transition"
                >
                  Explore Gateway &rarr;
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-700 text-xl mb-4">
                  <i className="fa-solid fa-landmark"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">About Us & Mandate</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-6">
                  Institutional origin, statutory duties, federal environmental policies, and strategic objectives.
                </p>
              </div>
              <div>
                <Link 
                  href="/about" 
                  className="bg-[#0b1329] hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg inline-flex items-center gap-2 transition"
                >
                  View Mandate
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Extended Enterprise System Navigator */}
        <section className="max-w-7xl mx-auto px-6 w-full">
          <div className="bg-[#0B1528] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800">
            
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <i className="fa-solid fa-layer-group text-emerald-400 text-xl"></i>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                  Extended Enterprise System Navigator
                </h2>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
                Integrated portal entry points for Digital Repositories, Permit Applications, GIS Mapping, and MDA Interoperability APIs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {navigatorLinks.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`p-4 rounded-xl border transition flex items-center justify-between group text-xs font-semibold ${
                    item.highlight
                      ? 'bg-emerald-700 hover:bg-emerald-800 border-emerald-600 text-white shadow-md'
                      : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 text-slate-200 hover:text-white'
                  }`}
                >
                  <span className="pr-3 leading-snug">{item.title}</span>
                  <i className={`${item.icon} text-slate-400 group-hover:text-white transition-colors shrink-0 text-xs`}></i>
                </Link>
              ))}
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}