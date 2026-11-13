"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * 1. Document Approval Action (Aligned with DocumentItem & AuditLog schema)
 */
export async function approveDocumentAction(documentId: string, adminId: string) {
  try {
    const updated = await prisma.documentItem.update({
      where: { id: documentId },
      data: { isPublic: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: "DOCUMENT_APPROVAL",
        entity: "DocumentItem",
        entityId: documentId,
        metadata: {
          title: updated.title,
          category: updated.category,
          approvedAt: new Date().toISOString(),
        },
      },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/repository");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("[APPROVE_DOCUMENT_ERROR]", error);
    return { success: false, error: error.message };
  }
}

/**
 * 2. EIA Report Submission Action (Aligned with EIAReport & AuditLog schema)
 */
export async function submitEiaReportAction(formData: FormData) {
  try {
    const projectTitle = (formData.get("projectTitle") || formData.get("title")) as string;
    const developerName = (formData.get("developerName") || "Authorized Developer") as string;
    const state = (formData.get("state") || "Rivers State") as string;
    const lga = (formData.get("lga") || "Port Harcourt") as string;
    const submissionUrl = (formData.get("submissionUrl") || "#") as string;
    const assignedReviewerId = formData.get("assignedReviewerId") as string | null;

    if (!projectTitle) {
      return { success: false, error: "Project title is required for statutory EIA filing." };
    }

    const count = await prisma.eIAReport.count();
    const trackingId = `EIA-NG-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

    const report = await prisma.eIAReport.create({
      data: {
        projectTitle,
        trackingId,
        developerName,
        state,
        lga,
        submissionUrl,
        assignedReviewerId,
        status: "UNDER_REVIEW",
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "EIA_REPORT_SUBMISSION",
        entity: "EIAReport",
        entityId: report.id,
        metadata: {
          trackingId: report.trackingId,
          projectTitle: report.projectTitle,
          state: report.state,
          lga: report.lga,
          timestamp: new Date().toISOString(),
        },
      },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/eia");
    return { success: true, data: report };
  } catch (error: any) {
    console.error("[SUBMIT_EIA_ERROR]", error);
    return { success: false, error: error.message };
  }
}

/**
 * 3. Feature Flag Toggle Action
 */
export async function toggleFeatureFlag(featureKey: string, enabled: boolean, adminId?: string) {
  try {
    const flag = await prisma.featureFlag.upsert({
      where: { key: featureKey },
      update: {
        isEnabled: enabled,
        updatedById: adminId || null,
      },
      create: {
        key: featureKey,
        label: featureKey.replace(/_/g, " "),
        description: `Dynamic Phase 2 module toggle for ${featureKey}`,
        isEnabled: enabled,
        updatedById: adminId || null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: adminId || null,
        action: "FEATURE_FLAG_TOGGLED",
        entity: "FeatureFlag",
        entityId: flag.id,
        metadata: {
          key: featureKey,
          isEnabled: enabled,
          toggledBy: adminId || "SUPER_ADMIN_ENGINE",
          timestamp: new Date().toISOString(),
        },
      },
    });

    revalidatePath("/dashboard/super-admin/features");
    revalidatePath("/dashboard/super-admin");
    revalidatePath("/");
    return { success: true, data: flag };
  } catch (error: any) {
    console.error("[TOGGLE_FEATURE_FLAG_ERROR]", error);
    return { success: false, error: error.message };
  }
}