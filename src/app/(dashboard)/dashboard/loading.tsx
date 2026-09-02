import { CardSkeleton } from "@/components/ui/data-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm lg:col-span-2">
          <Skeleton className="h-4 w-40 mb-4" />
          <Skeleton className="h-52 w-full rounded-lg" />
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-48 w-full rounded-full" />
        </div>
      </div>
      <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
        <Skeleton className="h-4 w-36" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-7 w-7 rounded-full shrink-0" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
