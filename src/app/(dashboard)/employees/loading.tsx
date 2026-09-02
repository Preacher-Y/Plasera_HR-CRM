import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/ui/data-skeleton";

export default function EmployeesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-9 flex-1 max-w-xs rounded-lg" />
        <Skeleton className="h-9 w-44 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>
      <TableSkeleton rows={10} cols={5} />
    </div>
  );
}
