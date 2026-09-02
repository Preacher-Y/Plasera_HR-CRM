export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  employeesOnLeave: number;
  totalDepartments: number;
  pendingLeaveRequests: number;
}

export interface RecentActivity {
  id: string;
  description: string;
  action: string;
  createdAt: string;
  employeeId: string | null;
}

export interface DepartmentStat {
  name: string;
  employeeCount: number;
}

export interface LeaveOverviewStat {
  pending: number;
  approved: number;
  rejected: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  departmentStats: DepartmentStat[];
  leaveOverview: LeaveOverviewStat;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: { code: string; message: string };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
