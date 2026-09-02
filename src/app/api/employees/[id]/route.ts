import { NextRequest, NextResponse } from "next/server";
import { getEmployeeById, updateEmployee, deleteEmployee } from "@/lib/services/employee.service";
import { updateEmployeeSchema } from "@/lib/validations/employee";
import { requireAuth } from "@/lib/auth/guard";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  try {
    const { id } = await params;
    const employee = await getEmployeeById(id);
    if (!employee) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Employee not found." } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: employee });
  } catch (error) {
    console.error("[EMPLOYEE_GET]", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Failed to fetch employee." } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  try {
    const { id } = await params;
    const body   = await req.json();
    const parsed = updateEmployeeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message } },
        { status: 422 }
      );
    }
    const updated = await updateEmployee(id, parsed.data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "";
    if (msg === "SELF_MANAGER") {
      return NextResponse.json(
        { success: false, error: { code: "SELF_MANAGER", message: "An employee cannot be their own manager." } },
        { status: 422 }
      );
    }
    if (msg.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, error: { code: "EMAIL_EXISTS", message: "This email is already in use." } },
        { status: 409 }
      );
    }
    console.error("[EMPLOYEE_PATCH]", error);
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_ERROR", message: "Failed to update employee." } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  try {
    const { id } = await params;
    await deleteEmployee(id);
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "";
    if (msg === "HAS_SUBORDINATES") {
      return NextResponse.json(
        { success: false, error: { code: "HAS_SUBORDINATES", message: "This employee manages others. Reassign them first." } },
        { status: 409 }
      );
    }
    console.error("[EMPLOYEE_DELETE]", error);
    return NextResponse.json(
      { success: false, error: { code: "DELETE_ERROR", message: "Failed to delete employee." } },
      { status: 500 }
    );
  }
}
