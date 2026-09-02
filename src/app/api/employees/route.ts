import { NextRequest, NextResponse } from "next/server";
import { getEmployees, createEmployee } from "@/lib/services/employee.service";
import { createEmployeeSchema, employeeQuerySchema } from "@/lib/validations/employee";
import { requireAuth } from "@/lib/auth/guard";

export async function GET(req: NextRequest) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const query  = employeeQuerySchema.parse(params);
    const result = await getEmployees(query);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[EMPLOYEES_GET]", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Failed to fetch employees." } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  try {
    const body   = await req.json();
    const parsed = createEmployeeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message } },
        { status: 422 }
      );
    }
    const employee = await createEmployee(parsed.data);
    return NextResponse.json({ success: true, data: employee }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("Unique constraint") || msg.toLowerCase().includes("email")) {
      return NextResponse.json(
        { success: false, error: { code: "EMAIL_EXISTS", message: "An employee with this email already exists." } },
        { status: 409 }
      );
    }
    console.error("[EMPLOYEES_POST]", error);
    return NextResponse.json(
      { success: false, error: { code: "CREATE_ERROR", message: "Failed to create employee." } },
      { status: 500 }
    );
  }
}
