'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function approveDocumentAction(documentId: string, adminId: string) {
  try {
    const updated = await prisma.document.update({
      where: { id: documentId },
      data: { status: 'APPROVED' },
    });

    await prisma.auditLog.create({
      data: {
        action: 'DOCUMENT_APPROVAL',
        performedBy: adminId,
        details: `Approved document snapshot ID: ${documentId}`,
      },
    });

    revalidatePath('/dashboard/admin/documents');
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function submitEiaReportAction(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const projectScope = formData.get('projectScope') as string;
    const authorId = formData.get('authorId') as string;

    const report = await prisma.eIAReport.create({
      data: {
        title,
        projectScope,
        authorId,
        status: 'SUBMITTED',
      },
    });

    revalidatePath('/dashboard/admin/documents');
    return { success: true, data: report };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleFeatureFlag(featureKey: string, enabled: boolean) {
  try {
    await prisma.auditLog.create({
      data: {
        action: 'FEATURE_FLAG_TOGGLE',
        performedBy: 'SUPER_ADMIN_ENGINE',
        details: `Toggled '${featureKey}' to ${enabled}`,
      },
    });

    revalidatePath('/dashboard/admin/developer-engine');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}