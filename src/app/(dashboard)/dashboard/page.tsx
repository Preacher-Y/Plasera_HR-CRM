import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { CardSkeleton } from "@/components/ui/data-skeleton";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { RecentActivityFeed } from "@/components/dashboard/recent-activity";
import { DepartmentChart } from "@/components/dashboard/department-chart";
import { LeaveOverviewChart } from "@/components/dashboard/leave-overview-chart";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDashboardData } from "@/lib/services/dashboard.service";
import { Plus } from "lucide-react";

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
        <RecentActivityFeed activities={recentActivity} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Your organization at a glance"
        actions={
          <Link
            href="/employees/new"
            className={cn(buttonVariants(), "bg-emerald-600 hover:bg-emerald-700")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Link>
        }
      />
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
  );
}
