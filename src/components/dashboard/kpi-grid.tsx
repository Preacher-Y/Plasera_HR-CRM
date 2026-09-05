import { Users, UserCheck, Plane, Building2, Clock } from "lucide-react";
import { KpiCard } from "./kpi-card";
import { DashboardStats } from "@/types";

interface KpiGridProps {
  stats: DashboardStats;
}

export function KpiGrid({ stats }: KpiGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <KpiCard
        title="Total Employees"
        value={stats.totalEmployees}
        icon={Users}
        description="All non-terminated"
        iconColor="text-blue-600"
        iconBg="bg-blue-50"
      />
      <KpiCard
        title="Active Employees"
        value={stats.activeEmployees}
        icon={UserCheck}
        description="Currently working"
        iconColor="text-blue-600"
        iconBg="bg-blue-50"
      />
      <KpiCard
        title="On Leave Today"
        value={stats.employeesOnLeave}
        icon={Plane}
        description="Approved leave"
        iconColor="text-violet-600"
        iconBg="bg-violet-50"
      />
      <KpiCard
        title="Departments"
        value={stats.totalDepartments}
        icon={Building2}
        description="Active teams"
        iconColor="text-orange-600"
        iconBg="bg-orange-50"
      />
      <KpiCard
        title="Pending Leave"
        value={stats.pendingLeaveRequests}
        icon={Clock}
        description="Awaiting review"
        iconColor="text-amber-600"
        iconBg="bg-amber-50"
      />
    </div>
  );
}
