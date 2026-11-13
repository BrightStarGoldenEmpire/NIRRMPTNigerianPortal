const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const ACCOUNTS = [
  // 1. Super Admin
  {
    email: "superadmin@nirrmpt.org",
    fullName: "Lead Systems Architect",
    password: "SuperAdmin2026!",
    role: "SUPER_ADMIN",
    department: "ICT & Digital Infrastructure",
  },
  // 1b. Personal Super Admin
  {
    email: "brightstargoldenempiree@gmail.com",
    fullName: "Lead Systems Architect (Personal)",
    password: "SuperAdmin2026!",
    role: "SUPER_ADMIN",
    department: "Executive Directorate",
  },
  // 2. Directorate Admin (Supports both directorate@ and admin@)
  {
    email: "directorate@nirrmpt.org",
    fullName: "Directorate Operations Lead",
    password: "AdminPassword2026!",
    role: "ADMIN",
    department: "Operations & Administration",
  },
  {
    email: "admin@nirrmpt.org",
    fullName: "Directorate Admin",
    password: "AdminPassword2026!",
    role: "ADMIN",
    department: "Operations & Administration",
  },
  // 3. Staff Desk (Supports both field.staff@ and staff@)
  {
    email: "field.staff@nirrmpt.org",
    fullName: "Field Compliance Officer",
    password: "StaffPassword2026!",
    role: "STAFF_ADMIN",
    department: "Environmental Protection & Monitoring",
  },
  {
    email: "staff@nirrmpt.org",
    fullName: "Staff Officer",
    password: "StaffPassword2026!",
    role: "STAFF_ADMIN",
    department: "Environmental Protection & Monitoring",
  },
  // 4. Citizen
  {
    email: "citizen@nirrmpt.org",
    fullName: "Dr. Chidi Okafor",
    password: "CitizenPassword2026!",
    role: "CITIZEN",
    department: "Public Services Registry",
  },
];

async function main() {
  console.log("Seeding accounts into Supabase...");

  for (const acc of ACCOUNTS) {
    await prisma.user.upsert({
      where: { email: acc.email },
      update: {
        fullName: acc.fullName,
        passwordHash: hashPassword(acc.password),
        role: acc.role,
        department: acc.department,
        isActive: true,
      },
      create: {
        email: acc.email,
        fullName: acc.fullName,
        passwordHash: hashPassword(acc.password),
        role: acc.role,
        department: acc.department,
        isActive: true,
      },
    });

    console.log(`[OK] Created/Updated: ${acc.email} (${acc.role})`);
  }

  console.log("\nAll accounts are ready in the database!");
}

main()
  .catch((e) => console.error("Seeding error:", e))
  .finally(() => prisma.$disconnect());