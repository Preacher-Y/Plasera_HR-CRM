import { NextRequest, NextResponse } from "next/server";
import { getLeaveRequestById } from "@/lib/services/leave.service";
import { requireAuth } from "@/lib/auth/guard";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  try {
    const { id } = await params;
    const leave = await getLeaveRequestById(id);
    if (!leave) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Leave request not found." } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: leave });
  } catch (error) {
    console.error("[LEAVE_GET_ONE]", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Failed to fetch leave request." } },
      { status: 500 }
    );
  }
}
