import { prisma } from "@/lib/prisma";

export const PHASE_2_KEYS = {
  GIS_INTERACTIVE_MAP: "PHASE_2_GIS_MAP",
  REGENERATIVE_RESOURCE_DB: "PHASE_2_RESOURCE_DB",
  PERMIT_COMPLIANCE_PORTAL: "PHASE_2_PERMITS",
  EIA_SUBMISSION_SYSTEM: "PHASE_2_EIA_SUBMISSIONS",
  ADVANCED_REPORTING_ANALYTICS: "PHASE_2_ANALYTICS",
  PDF_EXCEL_EXPORTS: "PHASE_2_EXPORTS",
  STAKEHOLDER_DOC_SHARING: "PHASE_2_STAKEHOLDER_DOCS",
  INTER_MDA_APIS: "PHASE_2_MDA_APIS",
} as const;

export type FeatureFlagKey = (typeof PHASE_2_KEYS)[keyof typeof PHASE_2_KEYS];

/**
 * Server-side evaluation of feature flag status.
 */
export async function isFeatureEnabled(key: FeatureFlagKey | string): Promise<boolean> {
  try {
    const flag = await prisma.featureFlag.findUnique({
      where: { key },
      select: { isEnabled: true },
    });
    return flag?.isEnabled ?? false;
  } catch (error) {
    console.error(`[FEATURE_FLAG_CHECK_ERROR] Key: ${key}`, error);
    return false;
  }
}

/**
 * Returns complete flag states for client hydration or system audits.
 */
export async function getAllFeatureFlags() {
  return prisma.featureFlag.findMany({
    orderBy: { createdAt: "asc" },
  });
}