import z from "zod";

export const userAdminUpdateRequestSchema = z
  .object({
    email: z.email("Enter a valid email address").optional(),
    firstName: z.string().trim().min(1, "First name is required").optional(),
    lastName: z.string().trim().min(1, "Last name is required").optional(),
    role: z
      .enum([
        "STAFF",
        "DEPARTMENT_MANAGER",
        "STATIONERY_MANAGER",
        "DRUGS_MANAGER",
        "ADMIN",
      ])
      .optional(),
    number: z.string().trim().min(1, "Phone number cannot be empty").nullable().optional(),
    profileImage: z.string().trim().nullable().optional(),
    status: z.enum(["ACTIVE", "BLOCKED"]).optional(),
    privilages: z.array(z.string().trim().min(1)).optional(),
  })
  .refine((updates) => Object.keys(updates).length > 0, {
    message: "At least one field must be provided",
  });

export type userAdminUpdateRequest = z.infer<typeof userAdminUpdateRequestSchema>;