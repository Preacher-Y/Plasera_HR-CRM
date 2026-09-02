import Link from "next/link";
import { formatDate, isCurrentlyOnLeave, cn } from "@/lib/utils";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";
import { StatusBadge, employmentStatusToVariant } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { MapPin, Briefcase } from "lucide-react";

interface EmployeeCardProps {
  employee: {
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
  };
}

export function EmployeeCard({ employee: emp }: EmployeeCardProps) {
  const onLeave = isCurrentlyOnLeave(emp.leaveRequests);
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-3">
        <EmployeeAvatar firstName={emp.firstName} lastName={emp.lastName} size="md" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">
            {emp.firstName} {emp.lastName}
          </p>
          <p className="text-xs text-slate-500 truncate">{emp.email}</p>
        </div>
        <StatusBadge variant={employmentStatusToVariant(emp.employmentStatus, onLeave)} />
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Briefcase className="h-3 w-3" />
          {emp.jobTitle}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {emp.location ?? "—"}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {emp.department.name} · Joined {formatDate(emp.dateJoined)}
        </span>
        <Link
          href={`/employees/${emp.id}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs")}
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
