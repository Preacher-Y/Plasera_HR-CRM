import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "./server";

const UNAUTHORIZED = NextResponse.json(
  { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
  { status: 401 }
);

export async function requireAuth(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return UNAUTHORIZED;
  const session = await verifyToken(token);
  return session ? null : UNAUTHORIZED;
}
