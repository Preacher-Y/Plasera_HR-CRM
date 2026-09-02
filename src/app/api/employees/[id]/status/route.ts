import { NextRequest, NextResponse } from "next/server";
import { updateEmployeeStatus } from "@/lib/services/employee.service";
import { updateStatusSchema } from "@/lib/validations/employee";
import { requireAuth } from "@/lib/auth/guard";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  try {
    const { id } = await params;
    const body   = await req.json();
    const parsed = updateStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid status value." } },
        { status: 422 }
      );
    }
    const updated = await updateEmployeeStatus(id, parsed.data.employmentStatus);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[EMPLOYEE_STATUS_PATCH]", error);
    return NextResponse.json(
      { success: false, error: { code: "STATUS_ERROR", message: "Failed to update employee status." } },
      { status: 500 }
    );
  }
}
