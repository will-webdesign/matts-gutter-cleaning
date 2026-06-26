import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

/**
 * Lightweight single-admin auth using a signed JWT in an httpOnly cookie.
 * Deliberately dependency-light and swappable for NextAuth/Clerk later  - 
 * all session logic lives here behind `getSession` / `createSession`.
 *
 * Required env:
 *   AUTH_SECRET - long random string used to sign sessions
 *   ADMIN_PASSWORD - the password Matt logs in with
 */

const COOKIE = "mgc_admin";
const MAX_AGE = 60 * 60 * 12; // 12 hours

function secretKey() {
  const secret = process.env.AUTH_SECRET || "dev-only-insecure-secret-change-me";
  return new TextEncoder().encode(secret);
}

export async function createSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

/** Returns the session payload if valid, otherwise null. */
export async function getSession(): Promise<{ role: string } | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return { role: String(payload.role) };
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSession()) !== null;
}

/** Constant-time-ish password check against the configured admin password. */
export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "changeme";
  if (input.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < input.length; i++) {
    mismatch |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}
