"use server";

import { prisma } from "@/lib/prisma";
import { ResourceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createRegenerativeResource(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const resourceType = formData.get("resourceType") as string;
    const state = formData.get("state") as string;
    const lga = formData.get("lga") as string;
    const monitoringAgency = formData.get("monitoringAgency") as string;
    const status = (formData.get("status") as ResourceStatus) || "ACTIVE";

    if (!name || !resourceType || !state || !lga) {
      return { success: false, error: "Missing required resource details." };
    }

    const created = await prisma.regenerativeResource.create({
      data: {
        name,
        resourceType,
        state,
        lga,
        monitoringAgency: monitoringAgency || "NIRRMPT Directorate",
        status,
        lastSurveyDate: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "REGENERATIVE_RESOURCE_REGISTERED",
        entity: "RegenerativeResource",
        entityId: created.id,
        metadata: { name: created.name, state: created.state, lga: created.lga },
      },
    });

    revalidatePath("/resources");
    return { success: true, data: created };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}