import { z } from "zod";

export const createLeaveSchema = z
  .object({
    employeeId: z.string().min(1, "Select an employee"),
    leaveType: z.enum([
      "ANNUAL", "SICK", "PERSONAL", "MATERNITY", "PATERNITY", "UNPAID", "OTHER",
    ]),
    startDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Enter a valid start date"),
    endDate:   z.string().refine((d) => !isNaN(Date.parse(d)), "Enter a valid end date"),
    reason:    z.string().min(10, "Reason must be at least 10 characters").max(500),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date cannot be before start date",
    path: ["endDate"],
  });

export const rejectLeaveSchema = z.object({
  reviewComment: z
    .string()
    .min(5, "Provide a reason for rejection (at least 5 characters)")
    .max(300),
});

export const leaveQuerySchema = z.object({
  status:     z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  leaveType:  z.enum(["ANNUAL", "SICK", "PERSONAL", "MATERNITY", "PATERNITY", "UNPAID", "OTHER"]).optional(),
  employeeId: z.string().optional(),
  page:       z.coerce.number().int().min(1).default(1),
  limit:      z.coerce.number().int().min(1).max(50).default(15),
});

export type CreateLeaveInput = z.infer<typeof createLeaveSchema>;
export type RejectLeaveInput = z.infer<typeof rejectLeaveSchema>;
export type LeaveQuery       = z.infer<typeof leaveQuerySchema>;
