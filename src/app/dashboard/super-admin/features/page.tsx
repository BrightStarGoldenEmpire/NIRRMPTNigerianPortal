import React from "react";
import { prisma } from "@/lib/prisma";
import { toggleFeatureFlag, seedInitialPhase2Flags } from "@/app/actions/feature-flags";

export const dynamic = "force-dynamic";

export default async function SuperAdminFeaturesPage() {
  const flags = await prisma.featureFlag.findMany({
    orderBy: { createdAt: "asc" },
    include: { updatedBy: { select: { fullName: true, email: true } } },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
              Developer Super-Admin Tier
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Phase 2 Feature Toggle Engine
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Activate or deactivate advanced modules instantly across the entire portal without code pushes.
          </p>
        </div>

        {flags.length === 0 && (
          <form
            action={async () => {
              "use server";
              // System bootstrap fallback superadmin context
              const root = await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" } });
              if (root) await seedInitialPhase2Flags(root.id);
            }}
          >
            <button
              type="submit"
              className="bg-[#004d2c] hover:bg-[#003820] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Seed Initial Phase 2 Flags
            </button>
          </form>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Module Details</th>
              <th className="px-6 py-4">Config Key</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Auditor</th>
              <th className="px-6 py-4 text-right">Switch Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {flags.map((flag) => (
              <tr key={flag.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 max-w-sm">
                  <div className="font-semibold text-slate-900">{flag.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{flag.description}</div>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-slate-600">
                  {flag.key}
                </td>
                <td className="px-6 py-4">
                  {flag.isEnabled ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Live (Enabled)
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      Offline (Gated)
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  {flag.updatedBy ? flag.updatedBy.fullName : "System Baseline"}
                </td>
                <td className="px-6 py-4 text-right">
                  <form
                    action={async () => {
                      "use server";
                      const superAdmin = await prisma.user.findFirst({
                        where: { role: "SUPER_ADMIN" },
                      });
                      if (superAdmin) {
                        await toggleFeatureFlag(flag.id, !flag.isEnabled, superAdmin.id);
                      }
                    }}
                  >
                    <button
                      type="submit"
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-colors ${
                        flag.isEnabled
                          ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {flag.isEnabled ? "Disable Module" : "Deploy Live"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {flags.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-400">
                  No feature flags detected in the database. Click the bootstrap button above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}