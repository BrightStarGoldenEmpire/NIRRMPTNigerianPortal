"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

interface PublicEnrollmentData {
  courseCode: string;
  courseTitle: string;
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
}

export async function registerPublicTrainee(data: PublicEnrollmentData) {
  try {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.fullName.trim();

    if (!cleanEmail || !cleanName || !data.courseCode) {
      return { success: false, error: "Missing required registration details." };
    }

    // 1. Create or find the User in the database
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          fullName: cleanName,
          phoneNumber: data.phone,
          department: data.organization || "Public Trainee",
          role: "STUDENT",
          passwordHash: hashPassword("TraineePortal2026!"),
          isActive: true,
        },
      });
    }

    // 2. Ensure Course exists in DB
    const course = await prisma.trainingCourse.upsert({
      where: { code: data.courseCode },
      update: {},
      create: {
        code: data.courseCode,
        slug: data.courseCode.toLowerCase(),
        title: data.courseTitle,
        description: `Official training cohort for ${data.courseTitle}`,
        startDate: new Date("2026-11-16"),
        endDate: new Date("2026-11-20"),
        capacity: 60,
        isPublished: true,
      },
      include: {
        _count: { select: { registrations: true } },
      },
    });

    // 3. Check for existing enrollment
    const existingRegistration = await prisma.trainingRegistration.findUnique({
      where: {
        courseId_userId: {
          courseId: course.id,
          userId: user.id,
        },
      },
    });

    if (existingRegistration) {
      return {
        success: true,
        alreadyRegistered: true,
        registrationNumber: existingRegistration.registrationNumber,
      };
    }

    // 4. Generate unique tracking code
    const count = await prisma.trainingRegistration.count();
    const registrationNumber = `NIRRMPT-TRN-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

    // 5. Save real registration in Supabase
    const registration = await prisma.trainingRegistration.create({
      data: {
        registrationNumber,
        courseId: course.id,
        userId: user.id,
        status: "APPROVED",
        attendance: "UNMARKED",
      },
    });

    revalidatePath("/training");
    revalidatePath("/dashboard/admin");

    return {
      success: true,
      registrationNumber: registration.registrationNumber,
    };
  } catch (error: any) {
    console.error("[TRAINING_ENROLLMENT_ERROR]", error);
    return {
      success: false,
      error: error.message || "Failed to persist registration to database.",
    };
  }
}