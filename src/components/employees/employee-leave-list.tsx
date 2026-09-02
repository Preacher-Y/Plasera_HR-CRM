import { formatDate, calculateLeaveDays } from "@/lib/utils";
import { LEAVE_TYPE_LABELS } from "@/lib/constants";
import { StatusBadge, leaveStatusToVariant } from "@/components/ui/status-badge";

interface LeaveEntry {
  id: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  status: string;
  reason: string;
}

export function EmployeeLeaveList({ leaveRequests }: { leaveRequests: LeaveEntry[] }) {
  if (leaveRequests.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-400">No leave requests</p>;
  }

  return (
    <div className="space-y-3">
      {leaveRequests.map((leave) => (
        <div
          key={leave.id}
          className="flex items-start justify-between gap-3 rounded-lg border p-3"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800">
              {LEAVE_TYPE_LABELS[leave.leaveType] ?? leave.leaveType}
            </p>
            <p className="text-xs text-slate-500">
              {formatDate(leave.startDate)} – {formatDate(leave.endDate)}
              <span className="ml-2 text-slate-400">
                ({calculateLeaveDays(leave.startDate, leave.endDate)} days)
              </span>
            </p>
            <p className="mt-1 text-xs text-slate-400 italic truncate">{leave.reason}</p>
          </div>
          <StatusBadge variant={leaveStatusToVariant(leave.status)} />
        </div>
      ))}
    </div>
  );
}
