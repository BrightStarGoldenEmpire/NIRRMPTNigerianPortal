"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleFeatureFlag(flagId: string, newState: boolean, adminUserId: string) {
  try {
    const flag = await prisma.featureFlag.update({
      where: { id: flagId },
      data: {
        isEnabled: newState,
        updatedById: adminUserId,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action: "FEATURE_FLAG_TOGGLED",
        entity: "FeatureFlag",
        entityId: flag.id,
        metadata: {
          flagKey: flag.key,
          newStatus: newState ? "LIVE" : "OFFLINE",
          updatedAt: new Date().toISOString(),
        },
      },
    });

    revalidatePath("/dashboard/super-admin/features");
    revalidatePath("/");
    return { success: true, isEnabled: flag.isEnabled };
  } catch (error: any) {
    console.error("[TOGGLE_FLAG_ERROR]", error);
    return { success: false, error: error.message || "Unable to update feature toggle." };
  }
}

export async function seedInitialPhase2Flags(superAdminId: string) {
  const initialFlags = [
    {
      key: "PHASE_2_GIS_MAP",
      label: "GIS Interactive Resource Map",
      description: "Live spatial mapping of soil, aquifer, and forest conservation sites across Nigerian States.",
    },
    {
      key: "PHASE_2_RESOURCE_DB",
      label: "Regenerative Resource Database CRUD",
      description: "Direct administrative registration, verification, and classification of protected resources.",
    },
    {
      key: "PHASE_2_PERMITS",
      label: "Permits & Compliance Portal",
      description: "Citizen environmental permit applications, state vetting, and issuance tracking.",
    },
    {
      key: "PHASE_2_EIA_SUBMISSIONS",
      label: "EIA Report Submission Engine",
      description: "Secure submission pipeline for statutory Environmental Impact Assessment filings.",
    },
    {
      key: "PHASE_2_ANALYTICS",
      label: "Advanced Analytics & Reporting Engine",
      description: "Dynamic cross-state resource metrics, live compliance rates, and KPI summaries.",
    },
    {
      key: "PHASE_2_EXPORTS",
      label: "Automated PDF/Excel Reporting",
      description: "Export high-resolution audit reports, FOI summaries, and participant registries.",
    },
    {
      key: "PHASE_2_STAKEHOLDER_DOCS",
      label: "Stakeholder Document Exchange",
      description: "Inter-agency classified document locker with encrypted multi-party sharing.",
    },
    {
      key: "PHASE_2_MDA_APIS",
      label: "Inter-MDA Integration API Gateway",
      description: "Secure REST/OAuth2 endpoints exposing national environmental registry data to MDAs.",
    },
  ];

  for (const flag of initialFlags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: {},
      create: {
        ...flag,
        isEnabled: false,
        updatedById: superAdminId,
      },
    });
  }

  revalidatePath("/dashboard/super-admin/features");
  return { success: true };
}