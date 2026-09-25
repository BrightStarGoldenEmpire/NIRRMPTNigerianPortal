import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || !body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Determine role based on email or persistent user record
    const isOfficer = body.email.toLowerCase().endsWith(".gov.ng");
    const role = isOfficer ? "officer" : "citizen";

    const user = {
      email: body.email,
      role: role,
      fullName: body.email.split("@")[0],
    };

    return NextResponse.json(
      { message: "Authentication successful.", user },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}