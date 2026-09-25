'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PortalRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'citizen', // Default selection
  });
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Map selected roles to their corresponding dashboard routes
    const roleRoutes: Record<string, string> = {
      citizen: '/dashboard/citizen',
      staff: '/dashboard/staff',
      directorate: '/dashboard/directorate',
      admin: '/dashboard/admin',
    };

    setTimeout(() => {
      setLoading(false);
      const destination = roleRoutes[formData.role] || '/dashboard/citizen';
      router.push(destination);
    }, 1000);
  }

  return (
    <div className="max-w-md mx-auto my-10 px-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#0F392B] text-white font-bold flex items-center justify-center rounded-xl mx-auto mb-3 text-sm">
            NIR
          </div>
          <h1 className="text-xl font-extrabold text-[#0F392B] uppercase">Create Account</h1>
          <p className="text-xs text-slate-500 mt-1">
            NIRRMPT Portal Access Registration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="John Doe"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@domain.com"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
              Select Access Level / Portal Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            >
              <option value="citizen">Citizen & Public Services Hub</option>
              <option value="staff">Staff Field Desk</option>
              <option value="directorate">Directorate Operations</option>
              <option value="admin">Super Admin Core</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F392B] hover:bg-emerald-900 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wider transition shadow-md flex justify-center items-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch animate-spin text-xs"></i>
                Registering...
              </>
            ) : (
              'Create Account & Access Portal'
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-2">
          <p className="text-xs text-slate-600">
            Already have an account?{' '}
            <Link href="/portal/login" className="text-emerald-700 font-bold hover:underline">
              Log In
            </Link>
          </p>
          <div>
            <Link href="/" className="text-xs text-slate-500 hover:text-emerald-700 font-semibold transition">
              &larr; Return to Public Gateway
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}