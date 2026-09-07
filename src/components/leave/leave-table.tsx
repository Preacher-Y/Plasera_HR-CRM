import Link from "next/link";
import { formatDate, calculateLeaveDays } from "@/lib/utils";
import { LEAVE_TYPE_LABELS } from "@/lib/constants";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";
import { StatusBadge, leaveStatusToVariant } from "@/components/ui/status-badge";
import { ApproveRejectActions } from "./approve-reject-actions";

interface LeaveRow {
  id: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  status: string;
  reason: string;
  createdAt: Date;
  reviewComment: string | null;
  employee: { id: string; firstName: string; lastName: string; jobTitle: string };
}

interface LeaveTableProps {
  leaveRequests: LeaveRow[];
  onAction: () => void;
}

export function LeaveTable({ leaveRequests, onAction }: LeaveTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Employee</th>
            <th className="px-4 py-3 hidden sm:table-cell">Leave Type</th>
            <th className="px-4 py-3 hidden md:table-cell">Dates</th>
            <th className="px-4 py-3 hidden lg:table-cell">Duration</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 hidden xl:table-cell">Submitted</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {leaveRequests.map((leave) => (
            <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <EmployeeAvatar
                    firstName={leave.employee.firstName}
                    lastName={leave.employee.lastName}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <Link
                      href={`/employees/${leave.employee.id}`}
                      className="font-medium text-slate-900 hover:text-login-panel transition-colors truncate block"
                    >
                      {leave.employee.firstName} {leave.employee.lastName}
                    </Link>
                    <p className="text-xs text-slate-400 truncate">{leave.employee.jobTitle}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">
                {LEAVE_TYPE_LABELS[leave.leaveType] ?? leave.leaveType}
              </td>
              <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                <p>{formatDate(leave.startDate)}</p>
                <p className="text-xs text-slate-400">to {formatDate(leave.endDate)}</p>
              </td>
              <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">
                {calculateLeaveDays(leave.startDate, leave.endDate)} days
              </td>
              <td className="px-4 py-3">
                <div className="space-y-1">
                  <StatusBadge variant={leaveStatusToVariant(leave.status)} />
                  {leave.reviewComment && (
                    <p
                      className="text-xs text-slate-400 italic max-w-[160px] truncate"
                      title={leave.reviewComment}
                    >
                      &quot;{leave.reviewComment}&quot;
                    </p>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-slate-400 text-xs hidden xl:table-cell">
                {formatDate(leave.createdAt)}
              </td>
              <td className="px-4 py-3 text-right">
                {leave.status === "PENDING" && (
                  <ApproveRejectActions
                    leaveId={leave.id}
                    employeeName={`${leave.employee.firstName} ${leave.employee.lastName}`}
                    startDate={leave.startDate}
                    endDate={leave.endDate}
                    onAction={onAction}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
