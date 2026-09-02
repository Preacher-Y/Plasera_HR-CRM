import { NextRequest, NextResponse } from "next/server";
import { rejectLeaveRequest } from "@/lib/services/leave.service";
import { rejectLeaveSchema } from "@/lib/validations/leave";
import { requireAuth } from "@/lib/auth/guard";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  try {
    const { id } = await params;
    const body   = await req.json();
    const parsed = rejectLeaveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message } },
        { status: 422 }
      );
    }
    const updated = await rejectLeaveRequest(id, parsed.data.reviewComment);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "";
    if (msg === "ALREADY_REVIEWED") {
      return NextResponse.json(
        { success: false, error: { code: "ALREADY_REVIEWED", message: "This request has already been reviewed." } },
        { status: 409 }
      );
    }
    console.error("[LEAVE_REJECT]", error);
    return NextResponse.json(
      { success: false, error: { code: "REJECT_ERROR", message: "Failed to reject leave request." } },
      { status: 500 }
    );
  }
}
