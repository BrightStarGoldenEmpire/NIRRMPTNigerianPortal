"use server";

import { prisma } from "@/lib/prisma";

export async function subscribeNewsletter(formData: FormData) {
  try {
    const email = (formData.get("email") as string)?.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return { success: false, error: "Please enter a valid email address." };
    }

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isSubscribed: true },
      create: { email, isSubscribed: true },
    });

    await prisma.auditLog.create({
      data: {
        action: "NEWSLETTER_SUBSCRIBED",
        entity: "NewsletterSubscriber",
        entityId: subscriber.id,
        metadata: { email: subscriber.email },
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("[NEWSLETTER_SUBSCRIBE_ERROR]", error);
    return { success: false, error: error.message || "Failed to subscribe." };
  }
}