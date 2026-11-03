import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("admin_session")?.value;
  const authenticated = sessionCookie === "authenticated";
  return NextResponse.json({ authenticated }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = typeof body?.password === "string" ? body.password : "";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json(
        { success: false, message: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set("admin_session", "authenticated", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 604800,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Contraseña incorrecta" },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true }, { status: 200 });

  response.cookies.set("admin_session", "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
  });

  return response;
}
