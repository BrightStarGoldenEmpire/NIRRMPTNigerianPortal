'use client';

import { useState, useEffect } from 'react';

export default function NDPRConsent() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('nirrmpt_ndpr_consent');
    if (!consent) setAccepted(false);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('nirrmpt_ndpr_consent', 'true');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 bg-emerald-950 text-white p-4 shadow-xl z-50 border-t border-emerald-800 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto rounded-t-lg">
      <div className="text-sm space-y-1 mb-3 md:mb-0 pr-4">
        <p className="font-semibold text-emerald-300">NDPR Data Privacy Notice</p>
        <p className="text-xs text-emerald-100">
          This federal portal collects and processes personal data in strict compliance with the Nigeria Data Protection Regulation (NDPR). By continuing, you agree to our data usage policies.
        </p>
      </div>
      <button
        onClick={handleAccept}
        className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs px-5 py-2.5 rounded transition whitespace-nowrap"
      >
        Acknowledge & Accept
      </button>
    </div>
  );
}