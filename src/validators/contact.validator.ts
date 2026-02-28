import { z } from "zod";

export const identifySchema = z.object({
  email: z.string().email().optional().nullable(),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{6,15}$/, "Invalid phone number format")
    .optional()
    .nullable()
})
.refine(
  (data) => data.email || data.phoneNumber,
  {
    message: "Either email or phoneNumber must be provided",
    path: ["email"]
  }
);