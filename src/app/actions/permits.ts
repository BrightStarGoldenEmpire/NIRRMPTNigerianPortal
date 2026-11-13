export async function updatePermitStatusAction(
  permitId: string,
  newStatus: "APPROVED" | "DEFERRED" | "REJECTED",
  adminId: string
) {
  try {
    const updated = await prisma.permitApplication.update({
      where: { id: permitId },
      data: { status: newStatus },
    });

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: "PERMIT_STATUS_UPDATED",
        entity: "PermitApplication",
        entityId: permitId,
        metadata: { newStatus, timestamp: new Date().toISOString() },
      },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/permits");
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}