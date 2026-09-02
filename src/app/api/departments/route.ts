import { NextRequest, NextResponse } from "next/server";
import { getDepartments, createDepartment } from "@/lib/services/department.service";
import { createDepartmentSchema } from "@/lib/validations/department";
import { requireAuth } from "@/lib/auth/guard";

export async function GET() {
  const unauth = await requireAuth(); if (unauth) return unauth;
  try {
    const departments = await getDepartments();
    return NextResponse.json({ success: true, data: departments });
  } catch (error) {
    console.error("[DEPARTMENTS_GET]", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Failed to fetch departments." } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  try {
    const body   = await req.json();
    const parsed = createDepartmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message } },
        { status: 422 }
      );
    }
    const department = await createDepartment(parsed.data);
    return NextResponse.json({ success: true, data: department }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, error: { code: "NAME_EXISTS", message: "A department with this name already exists." } },
        { status: 409 }
      );
    }
    console.error("[DEPARTMENTS_POST]", error);
    return NextResponse.json(
      { success: false, error: { code: "CREATE_ERROR", message: "Failed to create department." } },
      { status: 500 }
    );
  }
}
