import z from "zod";

export const userCreationRequestSchema = z.object({
  email: z.email("Enter a valid email address"),
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["STAFF", "DEPARTMENT_MANAGER", "STATIONERY_MANAGER", "DRUGS_MANAGER", "ADMIN"]).optional(),
  number: z.string().trim().min(1, "Phone number cannot be empty").optional(),
  profileImage: z.string().trim().nullable().optional(),
  status: z.enum(["ACTIVE", "BLOCKED"]).optional(),
  privilages: z.array(z.string().trim().min(1)).optional(),
});

export type UserCreationRequest = z.infer<typeof userCreationRequestSchema>;
