import { z } from "zod";

export const createDepartmentSchema = z.object({
  name:        z.string().min(2, "Department name must be at least 2 characters"),
  code:        z.string().max(10, "Code must be 10 characters or fewer").optional().or(z.literal("")),
  description: z.string().max(500, "Description must be 500 characters or fewer").optional().or(z.literal("")),
  headId:      z.string().optional().or(z.literal("")),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
