import { NextRequest, NextResponse } from "next/server";
import { getLeaveRequests, createLeaveRequest } from "@/lib/services/leave.service";
import { createLeaveSchema, leaveQuerySchema } from "@/lib/validations/leave";
import { requireAuth } from "@/lib/auth/guard";

export async function GET(req: NextRequest) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const query  = leaveQuerySchema.parse(params);
    const result = await getLeaveRequests(query);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[LEAVE_GET]", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Failed to fetch leave requests." } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  try {
    const body   = await req.json();
    const parsed = createLeaveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message } },
        { status: 422 }
      );
    }
    const leave = await createLeaveRequest(parsed.data);
    return NextResponse.json({ success: true, data: leave }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "";
    if (msg === "EMPLOYEE_INACTIVE") {
      return NextResponse.json(
        { success: false, error: { code: "EMPLOYEE_INACTIVE", message: "Leave cannot be submitted for an inactive employee." } },
        { status: 422 }
      );
    }
    if (msg === "OVERLAPPING_LEAVE") {
      return NextResponse.json(
        { success: false, error: { code: "OVERLAPPING_LEAVE", message: "This employee already has approved leave overlapping those dates." } },
        { status: 409 }
      );
    }
    console.error("[LEAVE_POST]", error);
    return NextResponse.json(
      { success: false, error: { code: "CREATE_ERROR", message: "Failed to submit leave request." } },
      { status: 500 }
    );
  }
}
