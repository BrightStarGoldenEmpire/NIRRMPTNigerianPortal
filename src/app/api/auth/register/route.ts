import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse JSON body safely
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON payload provided." },
        { status: 400 }
      );
    }

    const { role, fullName, email, password, phone, nin, officerId, department, cadreLevel } = body;

    // Validate required baseline fields
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full Name, Email, and Passcode are required fields." },
        { status: 400 }
      );
    }

    // Role-based validation checks
    if (role === "officer") {
      if (!email.toLowerCase().endsWith(".gov.ng")) {
        return NextResponse.json(
          { error: "Official email must end with .gov.ng" },
          { status: 400 }
        );
      }
      if (!officerId || !department) {
        return NextResponse.json(
          { error: "Officer Service ID and Department are required." },
          { status: 400 }
        );
      }
    }

    // Process user registration logic or database persistence here
    console.log("Processing payload successfully:", { role, fullName, email });

    return NextResponse.json(
      { message: "Registration successful", user: { role, fullName, email } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("CRITICAL API ROUTE ERROR:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error occurred." },
      { status: 500 }
    );
  }
}