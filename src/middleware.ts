import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "__session";

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET!);
}

async function getSession(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = await getSession(token);

  // Logged-in users cannot access /login
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated users cannot access dashboard routes
  if (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/employees") ||
      pathname.startsWith("/departments") ||
      pathname.startsWith("/leave")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/employees/:path*", "/departments/:path*", "/leave/:path*"],
};
