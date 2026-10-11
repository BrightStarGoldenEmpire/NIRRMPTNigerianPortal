'use client';

import React, { useState } from 'react';

interface Registration {
  id: string;
  name: string;
  email: string;
  program: string;
  status: 'Pending' | 'Approved';
  date: string;
}

interface Workshop {
  id: string;
  title: string;
  date: string;
  seats: number;
}

export default function AdminTrainingManager() {
  const [registrations, setRegistrations] = useState<Registration[]>([
    { id: '1', name: 'Dr. John Okafor', email: 'j.okafor@gov.ng', program: 'EIA Certification 2026', status: 'Pending', date: '2026-10-10' },
    { id: '2', name: 'Amina Yusuf', email: 'a.yusuf@research.org', program: 'GIS Mapping Workshop', status: 'Approved', date: '2026-10-09' },
  ]);

  const [workshops, setWorkshops] = useState<Workshop[]>([
    { id: 'w1', title: 'Environmental Impact Assessment (EIA) Certification 2026', date: 'November 12 - 15, 2026', seats: 14 },
    { id: 'w2', title: 'GIS Mapping & Resource Management Workshop', date: 'December 03 - 05, 2026', seats: 8 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newSeats, setNewSeats] = useState(20);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const toggleStatus = (id: string) => {
    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.id === id
          ? { ...reg, status: reg.status === 'Pending' ? 'Approved' : 'Pending' }
          : reg
      )
    );
    setStatusMessage(`Successfully updated attendee certification clearance status.`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleCreateWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newWorkshop: Workshop = {
      id: `w-${Date.now()}`,
      title: newTitle,
      date: newDate || 'TBD 2026/2027',
      seats: Number(newSeats),
    };

    setWorkshops((prev) => [newWorkshop, ...prev]);
    setNewTitle('');
    setNewDate('');
    setIsModalOpen(false);
    setStatusMessage(`New certification workshop successfully published to public portal.`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training & Workshop Management</h1>
          <p className="text-sm text-gray-500">Review applications, oversee seat quotas, and verify participant certification statuses.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-emerald-950 transition-colors shadow-sm"
        >
          + Create New Workshop
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-sm font-medium">
          {statusMessage}
        </div>
      )}

      {/* Active Workshops Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workshops.map((w) => (
          <div key={w.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                Active Module
              </span>
              <h3 className="text-sm font-bold text-gray-900 mt-2">{w.title}</h3>
              <p className="text-xs text-gray-500 mt-1">📅 {w.date}</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              {w.seats} Seats Left
            </span>
          </div>
        ))}
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Enrolled Participant Applications</h2>
        </div>

        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-100/70 border-b border-gray-200 text-gray-700 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4">Applicant</th>
              <th className="p-4">Program Enrolled</th>
              <th className="p-4">Date Filed</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {registrations.map((reg) => (
              <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <p className="font-semibold text-gray-900">{reg.name}</p>
                  <p className="text-xs text-gray-500 font-mono">{reg.email}</p>
                </td>
                <td className="p-4 text-gray-700 font-medium">{reg.program}</td>
                <td className="p-4 text-xs text-gray-500">{reg.date}</td>
                <td className="p-4">
                  <span
                    className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                      reg.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {reg.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => toggleStatus(reg.id)}
                    className="text-xs text-emerald-800 font-bold hover:underline bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded transition-colors"
                  >
                    Set as {reg.status === 'Pending' ? 'Approved' : 'Pending'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Workshop Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base">Publish New Training Workshop</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWorkshop} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Workshop Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Advanced Carbon Credit Accounting"
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Schedule / Date Range
                </label>
                <input
                  type="text"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  placeholder="e.g., February 10 - 12, 2027"
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Available Seats Quota
                </label>
                <input
                  type="number"
                  value={newSeats}
                  onChange={(e) => setNewSeats(Number(e.target.value))}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-md shadow"
                >
                  Publish Workshop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}