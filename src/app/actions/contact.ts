"use server";

import { prisma } from "@/lib/prisma";

export async function submitContactMessage(formData: FormData) {
  try {
    const fullName = (formData.get("fullName") as string)?.trim();
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const phone = (formData.get("phone") as string)?.trim();
    const subject = (formData.get("subject") as string)?.trim() || "General Inquiry";
    const message = (formData.get("message") as string)?.trim();

    if (!fullName || !email || !message) {
      return { success: false, error: "Please provide your name, email, and message." };
    }

    const created = await prisma.contactMessage.create({
      data: {
        fullName,
        email,
        phone,
        subject,
        message,
        isResolved: false,
      },
    });

    // Record audit event
    await prisma.auditLog.create({
      data: {
        action: "CONTACT_INQUIRY_RECEIVED",
        entity: "ContactMessage",
        entityId: created.id,
        metadata: { sender: fullName, email, subject },
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("[CONTACT_SUBMIT_ERROR]", error);
    return { success: false, error: error.message || "Failed to submit message." };
  }
}