import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/services/dashboard.service";
import { ApiResponse, DashboardData } from "@/types";
import { requireAuth } from "@/lib/auth/guard";

export async function GET(): Promise<NextResponse<ApiResponse<DashboardData>>> {
  const unauth = await requireAuth(); if (unauth) return unauth as NextResponse<ApiResponse<DashboardData>>;
  try {
    const data = await getDashboardData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[DASHBOARD_GET]", error);
    return NextResponse.json(
      { success: false, error: { code: "DASHBOARD_ERROR", message: "Failed to load dashboard data." } },
      { status: 500 }
    );
  }
}
