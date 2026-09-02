import Link from "next/link";
import { formatDate, isCurrentlyOnLeave } from "@/lib/utils";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";
import { StatusBadge, employmentStatusToVariant } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface EmployeeRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  location: string | null;
  employmentStatus: string;
  dateJoined: Date;
  department: { name: string };
  leaveRequests: { status: string; startDate: Date; endDate: Date }[];
}

export function EmployeeTable({ employees }: { employees: EmployeeRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Employee</th>
            <th className="px-4 py-3 hidden md:table-cell">Job Title</th>
            <th className="px-4 py-3 hidden lg:table-cell">Department</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 hidden xl:table-cell">Location</th>
            <th className="px-4 py-3 hidden xl:table-cell">Date Joined</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {employees.map((emp) => {
            const onLeave = isCurrentlyOnLeave(emp.leaveRequests);
            return (
              <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <EmployeeAvatar firstName={emp.firstName} lastName={emp.lastName} size="sm" />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {emp.firstName} {emp.lastName}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{emp.jobTitle}</td>
                <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">{emp.department.name}</td>
                <td className="px-4 py-3">
                  <StatusBadge variant={employmentStatusToVariant(emp.employmentStatus, onLeave)} />
                </td>
                <td className="px-4 py-3 text-slate-500 hidden xl:table-cell">{emp.location ?? "—"}</td>
                <td className="px-4 py-3 text-slate-500 hidden xl:table-cell">
                  {formatDate(emp.dateJoined)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/employees/${emp.id}`}
                    aria-label={`View ${emp.firstName} ${emp.lastName}`}
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
