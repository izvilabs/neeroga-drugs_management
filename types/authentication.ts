import type { Role, UserStatus } from "../app/generated/prisma/client";

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
  privilages: string[];
};

export type AuthenticatedHandler = (
  request: Request,
  user: AuthenticatedUser,
) => Response | Promise<Response>;
