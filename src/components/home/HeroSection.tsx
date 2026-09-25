"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check user motion preferences for accessibility (a11y)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <section className="relative bg-slate-950 text-white min-h-[80vh] flex items-center justify-center overflow-hidden">
      
      {/* Background Media with Enterprise Fallbacks */}
      {!prefersReducedMotion ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/assets/images/hero-poster.jpg"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
        >
          {/* WebM preferred for smaller payload sizes */}
          <source src="/assets/images/hero-background.webm" type="video/webm" />
          <source src="/assets/images/hero-background.mp4" type="video/mp4" />
        </video>
      ) : (
        /* Static Image Fallback for Reduced Motion Mode */
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30 pointer-events-none"
          style={{ backgroundImage: "url('/assets/images/hero-poster.jpg')" }}
          aria-hidden="true"
        />
      )}

      {/* Grid Overlay Pattern */}
      <div className="absolute inset-0 bg-slate-950/60 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 z-10 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-950/90 border border-emerald-800/80 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
            <span>National Resource Framework</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Advancing Technological <br className="hidden sm:inline" />
            <span className="text-emerald-500">Regenerative Solutions</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed mb-8">
            The Nigerian Institute for Regenerative Resources Management & Protection Technologies coordinates nationwide strategic directives, resource protection, and enterprise governance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/departments"
              className="inline-flex justify-center items-center px-6 py-3.5 rounded-md font-semibold text-white bg-emerald-700 hover:bg-emerald-600 transition-colors shadow-md text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Explore Directorates
            </Link>
            <Link
              href="/about"
              className="inline-flex justify-center items-center px-6 py-3.5 rounded-md font-semibold text-slate-200 bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-colors text-base focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Institutional Mandate
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}