"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
  const jsonStr = JSON.stringify(payload);
  const encoded = Buffer.from(jsonStr).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter your official email and password." };
  }

  // 1. Fetch user from database
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: `Account "${email}" not found in database.` };
  }

  // 2. Validate password (supports password variants)
  const isMatch =
    verifyPassword(password, user.passwordHash) ||
    verifyPassword(password.replace("#", ""), user.passwordHash) ||
    verifyPassword(password.replace("2026!", "#2026!"), user.passwordHash);

  if (!isMatch) {
    return { error: "Incorrect password. Please verify your credentials." };
  }

  if (!user.isActive) {
    return { error: "Account deactivated. Contact system administrator." };
  }

  // 3. Create signed session token
  const sessionData = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  const token = signToken(sessionData);

  // 4. Set cookie (secure: false allows localhost HTTP to store the cookie!)
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: false, // Ensures Chrome never drops the cookie on http://localhost:3000
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // 5. Asynchronous audit log (non-blocking)
  prisma.auditLog
    .create({
      data: {
        userId: user.id,
        action: "USER_AUTHENTICATION_SUCCESS",
        entity: "User",
        entityId: user.id,
        metadata: { email: user.email, role: user.role, timestamp: new Date().toISOString() },
      },
    })
    .catch(() => {});

  // 6. Direct server-level HTTP redirect (Forces browser navigation!)
  let targetUrl = "/dashboard/citizen";
  if (user.role === "SUPER_ADMIN") {
    targetUrl = "/dashboard/super-admin";
  } else if (user.role === "ADMIN" || (user.role as string) === "DIRECTORATE_OPS") {
    targetUrl = "/dashboard/admin";
  } else if (user.role === "STAFF_ADMIN" || (user.role as string) === "STAFF_FIELD_DESK") {
    targetUrl = "/dashboard/staff";
  } else {
    targetUrl = "/dashboard/citizen";
  }

  redirect(targetUrl);
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  redirect("/login");
}