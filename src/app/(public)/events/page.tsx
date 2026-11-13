import React from "react";
import { prisma } from "@/lib/prisma";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await prisma.eventItem.findMany({
    where: { isPublished: true },
    orderBy: { startDate: "asc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-[#004d2c] text-xs font-bold uppercase tracking-wider">
            <Calendar size={16} />
            <span>National Ecological Calendar</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Upcoming Summits & Technical Workshops
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Statutory stakeholder symposiums, field clinics, and technical conferences across Nigerian geopolitical zones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#004d2c] border border-emerald-200">
                  NATIONAL SYMPOSIUM
                </span>
                <h3 className="text-xl font-bold text-slate-900">{ev.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ev.description}</p>
                <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-emerald-700" />
                    <span>{new Date(ev.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-emerald-700" />
                    <span>{ev.venue}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
              No upcoming public events scheduled currently.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}