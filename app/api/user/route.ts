import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";
import { userCreationRequestSchema } from "../../../types/dto/userCreationRequest";
import z from "zod";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = userCreationRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid user data", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { password, ...userData } = parsed.data;
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    await prisma.user.create({
      data: { ...userData, password: hashedPassword },
    });

    return Response.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "A user with that email or phone number already exists" },
        { status: 409 },
      );
    }

    console.error("Failed to create user:", error);
    return Response.json({ error: "Unable to create user" }, { status: 500 });
  }
}
