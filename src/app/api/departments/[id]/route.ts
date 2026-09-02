import { NextRequest, NextResponse } from "next/server";
import { getDepartmentById, updateDepartment, deleteDepartment } from "@/lib/services/department.service";
import { updateDepartmentSchema } from "@/lib/validations/department";
import { requireAuth } from "@/lib/auth/guard";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  try {
    const { id } = await params;
    const department = await getDepartmentById(id);
    if (!department) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Department not found." } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: department });
  } catch (error) {
    console.error("[DEPARTMENT_GET]", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Failed to fetch department." } },
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
    const parsed = updateDepartmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message } },
        { status: 422 }
      );
    }
    const updated = await updateDepartment(id, parsed.data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, error: { code: "NAME_EXISTS", message: "A department with this name already exists." } },
        { status: 409 }
      );
    }
    console.error("[DEPARTMENT_PATCH]", error);
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_ERROR", message: "Failed to update department." } },
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
    await deleteDepartment(id);
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "";
    if (msg.startsWith("DEPARTMENT_HAS_EMPLOYEES:")) {
      const count = msg.split(":")[1];
      return NextResponse.json(
        {
          success: false,
          error: {
            code:    "DEPARTMENT_HAS_EMPLOYEES",
            message: `This department has ${count} employee${Number(count) !== 1 ? "s" : ""}. Move them to another department before deleting.`,
          },
        },
        { status: 409 }
      );
    }
    console.error("[DEPARTMENT_DELETE]", error);
    return NextResponse.json(
      { success: false, error: { code: "DELETE_ERROR", message: "Failed to delete department." } },
      { status: 500 }
    );
  }
}
