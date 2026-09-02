import { z } from "zod";

export const createEmployeeSchema = z.object({
  firstName:        z.string().min(2, "First name must be at least 2 characters"),
  lastName:         z.string().min(2, "Last name must be at least 2 characters"),
  email:            z.string().email("Enter a valid email address"),
  phone:            z.string().optional().or(z.literal("")),
  jobTitle:         z.string().min(2, "Job title is required"),
  departmentId:     z.string().min(1, "Select a department"),
  managerId:        z.string().optional().or(z.literal("")),
  location:         z.string().optional().or(z.literal("")),
  dateJoined:       z.string().refine((d) => !isNaN(Date.parse(d)), "Enter a valid date"),
  employmentStatus: z.enum(["ACTIVE", "INACTIVE", "TERMINATED"]).default("ACTIVE"),
  profileImage:     z.string().url().optional().or(z.literal("")),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const updateStatusSchema = z.object({
  employmentStatus: z.enum(["ACTIVE", "INACTIVE", "TERMINATED"]),
});

export const employeeQuerySchema = z.object({
  search:     z.string().optional(),
  department: z.string().optional(),
  status:     z.enum(["ACTIVE", "INACTIVE", "TERMINATED"]).optional(),
  page:       z.coerce.number().int().min(1).default(1),
  limit:      z.coerce.number().int().min(1).max(50).default(10),
  sort:       z.enum(["name_asc", "name_desc", "newest", "oldest"]).default("name_asc"),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type EmployeeQuery       = z.infer<typeof employeeQuerySchema>;
