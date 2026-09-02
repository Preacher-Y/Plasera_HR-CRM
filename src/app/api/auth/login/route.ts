import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signToken, COOKIE_NAME, MAX_AGE } from "@/lib/auth/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message: "Email and password are required." } },
      { status: 400 }
    );
  }

  const user = await db.user.findUnique({ where: { email } });
  const pepper = process.env.BCRYPT_PEPPER ?? "";

  const valid =
    user && (await bcrypt.compare(password + pepper, user.password));

  if (!valid) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Invalid email or password." } },
      { status: 401 }
    );
  }

  const token = await signToken({ id: user.id, email: user.email, role: user.role });

  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });

  return res;
}
