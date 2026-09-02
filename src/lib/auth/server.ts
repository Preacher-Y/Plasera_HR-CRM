import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "__session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET!);
}

export type SessionPayload = {
  id: string;
  email: string;
  role: string;
};

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export { COOKIE_NAME, MAX_AGE };
