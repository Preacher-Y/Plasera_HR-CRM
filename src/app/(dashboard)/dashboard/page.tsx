import { Suspense } from "react";
import { cookies } from "next/headers";
import { CardSkeleton } from "@/components/ui/data-skeleton";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { RecentActivityFeed } from "@/components/dashboard/recent-activity";
import { DepartmentChart } from "@/components/dashboard/department-chart";
import { LeaveOverviewChart } from "@/components/dashboard/leave-overview-chart";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { getDashboardData } from "@/lib/services/dashboard.service";
import { verifyToken, COOKIE_NAME } from "@/lib/auth/server";

function toDisplayName(email: string): string {
  const prefix = email.split("@")[0];
  return prefix
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function DashboardContent() {
  const { stats, recentActivity, departmentStats, leaveOverview } = await getDashboardData();

  return (
    <div className="space-y-6">
      <KpiGrid stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Department Distribution</h2>
          <DepartmentChart data={departmentStats} />
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Leave Overview</h2>
          <LeaveOverviewChart data={leaveOverview} />
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">Recent Activity</h2>
        <RecentActivityFeed activities={recentActivity}/>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;
  const userName = session?.email ? toDisplayName(session.email) : "there";

  return (
    <div className="space-y-6">
      <WelcomeBanner name={userName} />

      <div>
        <h2 className="mb-4 text-sm font-semibold text-slate-500">Overview</h2>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  );
}
