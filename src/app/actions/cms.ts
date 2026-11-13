"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

const AUTH_COOKIE = "nirrmpt_session_v1";
const SECRET = process.env.AUTH_SECRET || "nirrmpt_federal_portal_secret_key_2026_super_secure";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Strict Server-Side Verification: Validates that the active session
 * belongs strictly to a verified SUPER_ADMIN in the database.
 */
async function verifySuperAdminCaller() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    if (!token) return null;

    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;

    // Verify HMAC cryptographic signature
    const expectedSig = crypto.createHmac("sha256", SECRET).update(encoded).digest("base64url");
    if (signature !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());
    if (Date.now() > payload.expiresAt) return null;

    // Direct database validation to prevent client-side token spoofing
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || user.role !== "SUPER_ADMIN" || !user.isActive) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

// =========================================================================
// 1. PUBLIC SITE CMS ACTIONS FOR ALL 10 NAVBAR PAGES
// =========================================================================

export async function updateSiteContent(formData: FormData) {
  try {
    const entries = Array.from(formData.entries());

    for (const [key, value] of entries) {
      if (key.startsWith("cms_")) {
        const cleanKey = key.replace("cms_", "");
        const stringVal = (value as string).trim();

        await prisma.siteContent.upsert({
          where: { key: cleanKey },
          update: { value: stringVal },
          create: {
            key: cleanKey,
            value: stringVal,
            category: cleanKey.split("_")[0].toUpperCase(),
          },
        });
      }
    }

    // Record audit event
    await prisma.auditLog.create({
      data: {
        action: "PUBLIC_NAVBAR_CONTENT_UPDATED",
        entity: "SiteContent",
        metadata: {
          updatedAt: new Date().toISOString(),
        },
      },
    });

    // Revalidate public routes
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/leadership");
    revalidatePath("/departments");
    revalidatePath("/news");
    revalidatePath("/events");
    revalidatePath("/gallery");
    revalidatePath("/foi");
    revalidatePath("/training");
    revalidatePath("/contact");
    revalidatePath("/dashboard/super-admin/cms");

    return { success: true };
  } catch (error: any) {
    console.error("[CMS_UPDATE_ERROR]", error);
    return { success: false, error: error.message || "Failed to update content." };
  }
}

export async function seedDefaultCmsContent() {
  const defaults = [
    // 1. HOME
    { key: "home_hero_badge", value: "Official Federal Portal – Republic of Nigeria", category: "HOME" },
    { key: "home_hero_title", value: "Nigerian Institute of Regenerative Resource Management and Protection Technologies (NIRRMPT)", category: "HOME" },
    { key: "home_hero_subtitle", value: "Advancing science, policy, and technology to manage natural resources regeneratively and protect ecosystems across Nigeria.", category: "HOME" },
    { key: "home_stat_coverage_num", value: "36", category: "HOME" },
    { key: "home_stat_coverage_label", value: "STATES + FCT COVERAGE", category: "HOME" },
    { key: "home_stat_compliance_num", value: "100%", category: "HOME" },
    { key: "home_stat_compliance_label", value: "NDPR COMPLIANT PORTAL", category: "HOME" },
    { key: "home_stat_projects_num", value: "142+", category: "HOME" },
    { key: "home_stat_projects_label", value: "R&D CONSERVATION PROJECTS", category: "HOME" },
    { key: "home_stat_api_num", value: "RESTful", category: "HOME" },
    { key: "home_stat_api_label", value: "INTER-MDA API NETWORK", category: "HOME" },

    // 2. ABOUT US
    { key: "about_heading", value: "About the Institute & Statutory Mandate", category: "ABOUT" },
    { key: "about_mission", value: "To pioneer restorative ecological engineering, enforce statutory environmental compliance, and safeguard critical aquifers, mangroves, and soils through advanced science and community stewardship.", category: "ABOUT" },
    { key: "about_vision", value: "A resilient Nigerian ecosystem where natural resources are replenished faster than extraction through sovereign technologies and regulatory discipline.", category: "ABOUT" },
    { key: "about_mandate", value: "Established as the federal authority for regenerative resource monitoring, EIA validation, and environmental risk mitigation across all geopolitical zones.", category: "ABOUT" },

    // 3. LEADERSHIP & BOARD
    { key: "leadership_heading", value: "Governing Board & Directorate Leadership", category: "LEADERSHIP" },
    { key: "leadership_subheading", value: "Distinguished scientists, environmental jurists, and policy architects steering national ecological security.", category: "LEADERSHIP" },
    { key: "leadership_dg_speech", value: "Welcome to the NIRRMPT Federal Portal. Our mandate is clear: to ensure no Nigerian ecological asset is depleted without regenerative mitigation.", category: "LEADERSHIP" },

    // 4. DEPARTMENTS
    { key: "departments_heading", value: "Directorates & Operational Divisions", category: "DEPARTMENTS" },
    { key: "dept_env_desc", value: "Field inspection, compliance vetting, effluent testing, and bio-remediation protocol enforcement.", category: "DEPARTMENTS" },
    { key: "dept_gis_desc", value: "Satellite telemetry, multispectral radar ground-truthing, and spatial reserve mapping.", category: "DEPARTMENTS" },
    { key: "dept_hydro_desc", value: "Subterranean aquifer protection, heavy metal testing, and river basin telemetry.", category: "DEPARTMENTS" },

    // 5. NEWS & PRESS
    { key: "news_heading", value: "Official Gazette, News & Press Bulletins", category: "NEWS" },
    { key: "news_press_notice", value: "DIRECTIVE: All industrial operators in Sector 4 must file Q4 EIA compliance dossiers by statutory deadline.", category: "NEWS" },
    { key: "news_media_email", value: "press@nirrmpt.org", category: "NEWS" },

    // 6. EVENTS CALENDAR
    { key: "events_heading", value: "National Environmental Summits & Technical Conferences", category: "EVENTS" },
    { key: "events_subheading", value: "Upcoming stakeholder symposiums, field clinics, and technical capacity-building sessions.", category: "EVENTS" },

    // 7. MEDIA GALLERY
    { key: "gallery_heading", value: "Official Field Photography & Video Archive", category: "GALLERY" },
    { key: "gallery_subheading", value: "Visual records of active mangrove restoration, gully erosion engineering, and satellite survey teams.", category: "GALLERY" },

    // 8. FREEDOM OF INFORMATION (FOI)
    { key: "foi_heading", value: "Freedom of Information Act (2011) Statutory Disclosure Portal", category: "FOI" },
    { key: "foi_turnaround_time", value: "Mandatory 7-Day Statutory Response Window", category: "FOI" },
    { key: "foi_legal_notice", value: "Requests for environmental records, baseline studies, and public reports are processed strictly under the provisions of the FOI Act (2011).", category: "FOI" },

    // 9. TRAINING & CERTIFICATION
    { key: "training_heading", value: "Professional Capacity Building & Technical Certifications", category: "TRAINING" },
    { key: "training_accreditation", value: "Federal Certification for Environmental Officers and Corporate Compliance Auditors", category: "TRAINING" },

    // 10. CONTACT & ZONAL DESKS
    { key: "contact_heading", value: "Headquarters & Regional Field Liaison", category: "CONTACT" },
    { key: "contact_hotline", value: "+2349114440220", category: "CONTACT" },
    { key: "contact_email", value: "info@nirrmpt.org", category: "CONTACT" },
    { key: "contact_address", value: "Port Harcourt, Rivers State", category: "CONTACT" },
    { key: "contact_hours", value: "Monday – Friday: 08:00 – 17:00 WAT", category: "CONTACT" },
  ];

  for (const item of defaults) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    });
  }

  revalidatePath("/");
  revalidatePath("/dashboard/super-admin/cms");
  return { success: true };
}

// =========================================================================
// 2. DOCUMENT & EIA APPROVAL ACTIONS (Directorate Admin Permitted)
// =========================================================================

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

export async function submitEiaReportAction(formData: FormData) {
  try {
    const projectTitle = (formData.get("projectTitle") || formData.get("title")) as string;
    const developerName = (formData.get("developerName") || "Authorized Developer") as string;
    const state = (formData.get("state") || "Rivers State") as string;
    const lga = (formData.get("lga") || "Port Harcourt") as string;
    const submissionUrl = (formData.get("submissionUrl") || "#") as string;
    const assignedReviewerId = formData.get("assignedReviewerId") as string | null;

    if (!projectTitle) {
      return { success: false, error: "Project title is required." };
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

// =========================================================================
// 3. PHASE 2 FEATURE FLAG TOGGLE (STRICTLY LOCKED EXCLUSIVELY TO SUPER_ADMIN)
// =========================================================================

export async function toggleFeatureFlag(featureKey: string, enabled: boolean) {
  try {
    // 1. STRICT SERVER-SIDE ENFORCEMENT: ONLY SUPER ADMIN ALLOWED
    const superAdmin = await verifySuperAdminCaller();

    if (!superAdmin) {
      console.warn(`[SECURITY BREACH ATTEMPT] Unauthorized attempt to toggle Phase 2 feature: ${featureKey}`);

      // Log the unauthorized breach attempt into the forensic audit trail
      await prisma.auditLog.create({
        data: {
          action: "UNAUTHORIZED_FEATURE_TOGGLE_ATTEMPT",
          entity: "FeatureFlag",
          metadata: {
            attemptedFeature: featureKey,
            denialReason: "Phase 2 Feature Switches are strictly reserved for Super Admin root authority.",
            timestamp: new Date().toISOString(),
          },
        },
      });

      return {
        success: false,
        error: "ACCESS DENIED: Phase 2 Feature Toggles are strictly restricted to the Super Admin (Root Developer) authority.",
      };
    }

    // 2. Perform the toggle exclusively authorized by Super Admin
    const flag = await prisma.featureFlag.upsert({
      where: { key: featureKey },
      update: {
        isEnabled: enabled,
        updatedById: superAdmin.id,
      },
      create: {
        key: featureKey,
        label: featureKey.replace(/_/g, " "),
        description: `Phase 2 enterprise module toggle for ${featureKey}`,
        isEnabled: enabled,
        updatedById: superAdmin.id,
      },
    });

    // 3. Record valid Super Admin audit event
    await prisma.auditLog.create({
      data: {
        userId: superAdmin.id,
        action: "PHASE_2_FEATURE_FLAG_TOGGLED",
        entity: "FeatureFlag",
        entityId: flag.id,
        metadata: {
          key: featureKey,
          isEnabled: enabled,
          authorizedBy: superAdmin.email,
          role: superAdmin.role,
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

// =========================================================================
// 4. STAFF ONBOARDING & ROLE ASSIGNMENT ACTIONS (Directorate Admin & Super Admin)
// =========================================================================

export async function onboardStaffAction(formData: FormData) {
  try {
    const fullName = (formData.get("fullName") as string)?.trim();
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const password = formData.get("password") as string;
    const department = (formData.get("department") as string)?.trim() || "General Staff";
    const phoneNumber = (formData.get("phoneNumber") as string)?.trim() || null;
    const role = (formData.get("role") as Role) || Role.STAFF_ADMIN;

    if (!fullName || !email || !password) {
      return { success: false, error: "Full Name, Email, and Password are required." };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "An account with this email address already exists." };
    }

    const created = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash: hashPassword(password),
        department,
        phoneNumber,
        role,
        isActive: true,
        permissions: [],
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "STAFF_ONBOARDED",
        entity: "User",
        entityId: created.id,
        metadata: {
          fullName: created.fullName,
          email: created.email,
          role: created.role,
          department: created.department,
          timestamp: new Date().toISOString(),
        },
      },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/super-admin/staff");
    return { success: true, data: created };
  } catch (error: any) {
    console.error("[ONBOARD_STAFF_ERROR]", error);
    return { success: false, error: error.message || "Failed to onboard staff member." };
  }
}

export async function updateUserRoleAction(userId: string, newRole: Role | string, operatorEmail?: string) {
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole as Role },
    });

    await prisma.auditLog.create({
      data: {
        action: "STAFF_ROLE_REASSIGNED",
        entity: "User",
        entityId: userId,
        metadata: {
          newRole,
          assignedBy: operatorEmail || "Directorate Admin",
          timestamp: new Date().toISOString(),
        },
      },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/super-admin/staff");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("[UPDATE_ROLE_ERROR]", error);
    return { success: false, error: error.message || "Failed to update role." };
  }
}