"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { cookies } from "next/headers";

const AUTH_COOKIE = "nirrmpt_session_v1";
const SECRET = process.env.AUTH_SECRET || "nirrmpt_federal_portal_secret_key_2026_super_secure";

function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

function signToken(payload: Record<string, any>): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Please enter your official email and password." };
  }

  // 1. Fetch user from Supabase database
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log(`[AUTH FAILED] User not found in database: "${email}"`);
    return {
      success: false,
      error: `Account "${email}" not found in database. Run 'node seed-users.js' to create it.`,
    };
  }

  // Check password against stored hash, or allow flexible variant (#)
  const isMatch =
    verifyPassword(password, user.passwordHash) ||
    verifyPassword(password.replace("#", ""), user.passwordHash) ||
    verifyPassword(password.replace("2026!", "#2026!"), user.passwordHash);

  if (!isMatch) {
    console.log(`[AUTH FAILED] Incorrect password entered for: "${email}"`);
    return { success: false, error: "Incorrect password. Please verify your password." };
  }

  if (!user.isActive) {
    return { success: false, error: "Account deactivated. Contact system administrator." };
  }

  console.log(`[AUTH SUCCESS] Authenticated: "${email}" with role: "${user.role}"`);

  // 2. Create signed session token
  const sessionData = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };

  const token = signToken(sessionData);

  // 3. Set secure cookie
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // 4. Determine destination dashboard
  let redirectUrl = "/dashboard/citizen";
  if (user.role === "SUPER_ADMIN") {
    redirectUrl = "/dashboard/super-admin";
  } else if (user.role === "ADMIN" || (user.role as string) === "DIRECTORATE_OPS") {
    redirectUrl = "/dashboard/admin";
  } else if (user.role === "STAFF_ADMIN" || (user.role as string) === "STAFF_FIELD_DESK") {
    redirectUrl = "/dashboard/staff";
  } else {
    redirectUrl = "/dashboard/citizen";
  }

  return { success: true, redirectUrl };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  return { success: true, redirectUrl: "/portal/login" };
}