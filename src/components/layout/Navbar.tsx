'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Leadership & Board', href: '/leadership' },
    { name: 'Departments', href: '/department' },
    { name: 'News', href: '/news' },
    { name: 'Events', href: '/events' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'FOI', href: '/foi' },
    { name: 'Training', href: '/training' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="w-full font-sans sticky top-0 z-50">
      {/* Top Dark Federal Bar */}
      <div className="bg-[#0B1528] text-white text-[11px] py-1.5 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span className="text-slate-300 font-medium">
            Official Federal Portal – Republic of Nigeria
          </span>
        </div>
        <div className="flex items-center gap-6 text-slate-300 text-[11px]">
          <a href="tel:+2348025252362" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <i className="fa-solid fa-phone text-[10px]"></i>
            +2348025252362
          </a>
          <span className="flex items-center gap-1.5">
            <i className="fa-solid fa-location-dot text-[10px]"></i>
            Port Harcourt, Rivers State
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20 gap-2">
          
          {/* Logo & Agency Title */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="h-12 w-auto max-w-[140px] flex items-center justify-center shrink-0 overflow-hidden">
              <img 
                src="/images/logo.png" 
                alt="NIRRMPT Logo" 
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 tracking-tight text-base leading-tight whitespace-nowrap">
                NIRRMPT Nigeria
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                REGENERATIVE RESOURCE MANAGEMENT & PROTECTION
              </span>
            </div>
          </Link>

          {/* Desktop Links (Optimized spacing to prevent multi-line wrap) */}
          <nav className="hidden xl:flex items-center gap-3.5 lg:gap-4 shrink">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[12px] xl:text-[13px] font-semibold text-slate-700 hover:text-[#0F392B] transition-colors whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Button */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <Link
              href="/portal/login"
              className="bg-[#0F392B] hover:bg-emerald-900 text-white font-bold px-3.5 py-2 rounded-md text-xs transition shadow-sm flex items-center gap-2 whitespace-nowrap"
            >
              <i className="fa-solid fa-lock text-[10px]"></i>
              Portal Login
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition shrink-0"
            aria-label="Toggle Menu"
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
          </button>
        </div>

        {/* Mobile & Tablet Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-slate-100 py-3 px-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#0F392B]"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="/portal/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-[#0F392B] text-white font-bold py-2 rounded-md text-xs block"
              >
                Portal Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}