import { db } from "@/lib/db";
import { DashboardData } from "@/types";

export async function getDashboardData(): Promise<DashboardData> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalEmployees,
    activeEmployees,
    totalDepartments,
    pendingLeaveRequests,
    employeesOnLeave,
    recentActivity,
    departments,
    leaveOverview,
  ] = await Promise.all([
    db.employee.count({ where: { employmentStatus: { not: "TERMINATED" } } }),
    db.employee.count({ where: { employmentStatus: "ACTIVE" } }),
    db.department.count(),
    db.leaveRequest.count({ where: { status: "PENDING" } }),
    db.leaveRequest.count({
      where: {
        status: "APPROVED",
        startDate: { lte: today },
        endDate: { gte: today },
      },
    }),
    db.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        employee: { select: { firstName: true, lastName: true } },
      },
    }),
    db.department.findMany({
      include: { _count: { select: { employees: true } } },
      orderBy: { employees: { _count: "desc" } },
    }),
    db.leaveRequest.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);

  const leaveMap = leaveOverview.reduce(
    (acc, item) => ({ ...acc, [item.status]: item._count.id }),
    {} as Record<string, number>
  );

  return {
    stats: {
      totalEmployees,
      activeEmployees,
      employeesOnLeave,
      totalDepartments,
      pendingLeaveRequests,
    },
    recentActivity: recentActivity.map((a) => ({
      id: a.id,
      description: a.description,
      action: a.action,
      createdAt: a.createdAt.toISOString(),
      employeeId: a.employeeId,
    })),
    departmentStats: departments.map((d) => ({
      name: d.name,
      employeeCount: d._count.employees,
    })),
    leaveOverview: {
      pending: leaveMap["PENDING"] ?? 0,
      approved: leaveMap["APPROVED"] ?? 0,
      rejected: leaveMap["REJECTED"] ?? 0,
    },
  };
}
