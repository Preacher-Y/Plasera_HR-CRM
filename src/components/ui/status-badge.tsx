import { cn } from "@/lib/utils";

type BadgeVariant = "active" | "inactive" | "terminated" | "pending" | "approved" | "rejected" | "on-leave";

const variants: Record<BadgeVariant, string> = {
  active:     "bg-emerald-100 text-emerald-800 ring-emerald-200",
  inactive:   "bg-slate-100 text-slate-700 ring-slate-200",
  terminated: "bg-red-100 text-red-700 ring-red-200",
  pending:    "bg-amber-100 text-amber-800 ring-amber-200",
  approved:   "bg-emerald-100 text-emerald-800 ring-emerald-200",
  rejected:   "bg-red-100 text-red-700 ring-red-200",
  "on-leave": "bg-blue-100 text-blue-700 ring-blue-200",
};

const labels: Record<BadgeVariant, string> = {
  active:     "Active",
  inactive:   "Inactive",
  terminated: "Terminated",
  pending:    "Pending",
  approved:   "Approved",
  rejected:   "Rejected",
  "on-leave": "On Leave",
};

interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  return (
    <span
      aria-label={`Status: ${label ?? labels[variant]}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        variants[variant],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {label ?? labels[variant]}
    </span>
  );
}

export function employmentStatusToVariant(status: string, isOnLeave?: boolean): BadgeVariant {
  if (isOnLeave) return "on-leave";
  const map: Record<string, BadgeVariant> = {
    ACTIVE:     "active",
    INACTIVE:   "inactive",
    TERMINATED: "terminated",
  };
  return map[status] ?? "inactive";
}

export function leaveStatusToVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    PENDING:  "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
  };
  return map[status] ?? "pending";
}
