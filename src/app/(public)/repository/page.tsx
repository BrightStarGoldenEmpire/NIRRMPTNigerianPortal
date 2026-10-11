import React from 'react';

export default function RepositoryPage() {
  const journals = [
    { title: 'Soil Organic Carbon Restoration in Arid Zones', category: 'Policy Brief', date: 'Sept 2026', author: 'Dr. A. Bello' },
    { title: 'National Water Basin Depletion Risk Index', category: 'Research Paper', date: 'Aug 2026', author: 'NIRRMPT R&D' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-emerald-950 mb-2">Digital Research Repository</h1>
      <p className="text-gray-600 mb-8">Access peer-reviewed journals, policy briefs, and ecosystem reports.</p>

      <div className="grid md:grid-cols-2 gap-6">
        {journals.map((item, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <span className="text-xs font-semibold uppercase px-2 py-1 bg-emerald-100 text-emerald-800 rounded">
              {item.category}
            </span>
            <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500 mb-4">Author: {item.author} • Published: {item.date}</p>
            <button className="bg-emerald-800 text-white text-sm font-medium px-4 py-2 rounded hover:bg-emerald-900">
              Download Publication (PDF)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}