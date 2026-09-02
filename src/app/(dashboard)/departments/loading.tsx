import { Skeleton } from "@/components/ui/skeleton";

export default function DepartmentsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-white p-5 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <Skeleton className="h-4 w-24" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="flex gap-2 border-t pt-3">
              <Skeleton className="h-8 flex-1 rounded-md" />
              <Skeleton className="h-8 w-9 rounded-md" />
              <Skeleton className="h-8 w-9 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
