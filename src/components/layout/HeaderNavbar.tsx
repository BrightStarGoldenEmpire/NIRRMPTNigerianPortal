"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeaderNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Leadership', href: '/leadership' },
    { name: 'Directorates', href: '/departments' },
    { name: 'News', href: '/news' },
    { name: 'Events', href: '/events' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand with Next.js Image Optimization */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-full bg-slate-800 p-1 border border-slate-700 overflow-hidden flex-shrink-0">
              <Image
                src="/assets/images/logo.png"
                alt="NIRRMPT Logo"
                fill
                sizes="40px"
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-wide text-white">
                NIRRMPT
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-light hidden sm:inline">
                Regenerative Resources Management
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navigationLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 rounded-md text-xs xl:text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/portal-login"
              className="ml-4 px-4 py-2 text-xs font-bold rounded-md text-white bg-emerald-700 hover:bg-emerald-600 transition-colors shadow"
            >
              Portal Login
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 pt-2 pb-6 space-y-1">
          {navigationLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-slate-200 hover:text-white hover:bg-slate-800"
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4">
            <Link
              href="/portal-login"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-3 rounded-md font-bold text-white bg-emerald-700 hover:bg-emerald-600"
            >
              Portal Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}