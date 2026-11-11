import { SignJWT, jwtVerify } from "jose";
import type { AuthenticatedHandler, AuthenticatedUser } from "../types/authentication";
import prisma from "../lib/prisma";

const ACCESS_TOKEN_LIFETIME = "8h";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret || new TextEncoder().encode(secret).byteLength < 32) {
    throw new Error("JWT_SECRET must be set to a random value of at least 32 bytes");
  }

  return new TextEncoder().encode(secret);
}

export async function createAccessToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_LIFETIME)
    .sign(getJwtSecret());
}

export async function verifyAccessToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });

    return typeof payload.sub === "string" ? { userId: payload.sub } : null;
  } catch {
    return null;
  }
}

function getBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  const token = getBearerToken(request);
  if (!token) return null;

  const verified = await verifyAccessToken(token);
  if (!verified) return null;

  const user = await prisma.user.findUnique({
    where: { id: verified.userId },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      privilages: true,
    },
  });

  if (!user || user.status !== "ACTIVE") return null;
  return user;
}

export function hasPrivilege(user: AuthenticatedUser, privilege: string): boolean {
  return user.role === "ADMIN" || user.privilages.includes(privilege);
}

export function withAuthentication(handler: AuthenticatedHandler) {
  return async (request: Request): Promise<Response> => {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    return handler(request, user);
  };
}

export function withPrivilege(privilege: string, handler: AuthenticatedHandler) {
  return withAuthentication((request, user) => {
    if (!hasPrivilege(user, privilege)) {
      return Response.json({ error: "Insufficient privileges" }, { status: 403 });
    }

    return handler(request, user);
  });
}
