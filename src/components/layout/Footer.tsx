import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0b1329] text-white pt-12 pb-6 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-800/80">
        
        {/* Column 1: Institute Info */}
        <div>
          <h3 className="text-lg font-bold text-white mb-2">NIRRMPT Nigeria</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-sm">
            Nigerian Institute of Regenerative Resource Management and Protection Technologies (NIRRMPT).
          </p>
          <div className="space-y-2 text-xs text-slate-300">
            <p className="flex items-center gap-2">
              <i className="fa-solid fa-location-dot text-amber-500"></i>
              Port Harcourt, Rivers State. Nigeria.
            </p>
            <p className="flex items-center gap-2">
              <i className="fa-solid fa-phone text-amber-500"></i>
              +2348026252862
            </p>
          </div>
        </div>

        {/* Column 2: Compliance & Security */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4">Compliance & Security</h4>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-shield-halved text-amber-500"></i>
              NDPR Data Compliant
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-lock text-amber-500"></i>
              SSL Encrypted Connection
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-database text-amber-500"></i>
              Automated Daily Backup Architecture
            </li>
          </ul>
        </div>

        {/* Column 3: Quick Navigation */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4">Quick Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/" className="text-amber-500 hover:text-amber-400 font-medium transition">
                Public Gateway
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-amber-500 hover:text-amber-400 font-medium transition">
                Board & Executives
              </Link>
            </li>
            <li>
              <Link href="/membership/apply" className="text-amber-500 hover:text-amber-400 font-medium transition">
                Enterprise Repository & GIS Map
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-6 text-center text-xs text-slate-400">
        <p>&copy; 2026 Nigerian Institute of Regenerative Resource Management and Protection Technologies (NIRRMPT). All Rights Reserved.</p>
        <p className="text-amber-500 font-semibold mt-1">Powered by Bright-Star Golden Empire Ltd</p>
      </div>
    </footer>
  );
}