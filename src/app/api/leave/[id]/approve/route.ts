import { NextRequest, NextResponse } from "next/server";
import { approveLeaveRequest } from "@/lib/services/leave.service";
import { requireAuth } from "@/lib/auth/guard";

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  try {
    const { id } = await params;
    const updated = await approveLeaveRequest(id);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "";
    if (msg === "ALREADY_REVIEWED") {
      return NextResponse.json(
        { success: false, error: { code: "ALREADY_REVIEWED", message: "This request has already been reviewed." } },
        { status: 409 }
      );
    }
    console.error("[LEAVE_APPROVE]", error);
    return NextResponse.json(
      { success: false, error: { code: "APPROVE_ERROR", message: "Failed to approve leave request." } },
      { status: 500 }
    );
  }
}
