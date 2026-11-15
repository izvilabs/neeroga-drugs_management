import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { userLoginRequestSchema } from "@/types/dto/userLoginRequest";
import { Role } from "@/app/generated/prisma/enums";

const dashboardRoutes: Record<Role, string> = {
  [Role.ADMIN]: "/dashboard/admin",
  [Role.DEPARTMENT_MANAGER]: "/dashboard/department-manager",
  [Role.STATIONERY_MANAGER]: "/dashboard/stationery-manager",
  [Role.DRUGS_MANAGER]: "/dashboard/drugs-manager",
  [Role.STAFF]: "/dashboard/staff",
};

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const parsed = userLoginRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Enter a valid email and password" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email.trim().toLowerCase() },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        role: true,
        privilages: true,
        profileImage: true,
        status: true,
      },
    });

    if (!user || user.status !== "ACTIVE") {
      return NextResponse.json({ message: "Email or password is not valid" }, { status: 401 });
    }

    const passwordIsValid = await compare(parsed.data.password, user.password);
    if (!passwordIsValid) {
      return NextResponse.json({ message: "Email or password is not valid" }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_KEY;
    if (!jwtSecret) {
      console.error("JWT_KEY is not configured");
      return NextResponse.json({ message: "Unable to sign in" }, { status: 500 });
    }

    const token = await new SignJWT({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      privilages: user.privilages,
      profileImage: user.profileImage,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(jwtSecret));

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const response = NextResponse.json({
      message: "Login successful",
      role: user.role,
      redirectTo: dashboardRoutes[user.role],
    });
    response.cookies.set({
      name: "login-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json({ message: "Unable to sign in right now" }, { status: 500 });
  }
}
