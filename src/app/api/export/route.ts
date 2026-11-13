import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "audit";

  if (type === "audit") {
    const logs = await prisma.auditLog.findMany({
      take: 500,
      orderBy: { createdAt: "desc" },
    });

    let csv = "ID,Action,Entity,EntityID,Timestamp\n";
    logs.forEach((l) => {
      csv += `"${l.id}","${l.action}","${l.entity}","${l.entityId || ""}","${l.createdAt.toISOString()}"\n`;
    });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="nirrmpt_audit_export_${Date.now()}.csv"`,
      },
    });
  }

  if (type === "trainees") {
    const regs = await prisma.trainingRegistration.findMany({
      include: { user: true, course: true },
    });

    let csv = "RegistrationNumber,CourseCode,CourseTitle,FullName,Email,Status,Attendance\n";
    regs.forEach((r) => {
      csv += `"${r.registrationNumber}","${r.course.code}","${r.course.title}","${r.user.fullName}","${r.user.email}","${r.status}","${r.attendance}"\n`;
    });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="nirrmpt_trainees_export_${Date.now()}.csv"`,
      },
    });
  }

  return NextResponse.json({ error: "Invalid export type. Use ?type=audit or ?type=trainees" }, { status: 400 });
}