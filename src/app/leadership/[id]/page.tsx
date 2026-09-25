import React from 'react';
import { leadershipData } from '@/lib/data/leadershipData';

export default async function LeadershipProfilePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const member = leadershipData.find((item) => item.id === id);

  if (!member) {
    return <div className="max-w-7xl mx-auto py-12 px-4">Officer profile not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">{member.name}</h1>
      <p className="text-emerald-700 font-semibold text-lg">{member.title}</p>
      <p className="text-slate-500 text-sm mb-6">{member.directorate}</p>
      <hr className="border-slate-200 my-6" />
      <p className="text-slate-700 leading-relaxed">{member.bio}</p>
    </div>
  );
}