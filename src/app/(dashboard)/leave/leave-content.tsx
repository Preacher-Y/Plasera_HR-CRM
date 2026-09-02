"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/data-skeleton";
import { LeaveTable } from "@/components/leave/leave-table";
import { LeaveFilters } from "@/components/leave/leave-filters";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarDays, Plus } from "lucide-react";

interface LeaveRequest {
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

interface LeaveData {
  leaveRequests: LeaveRequest[];
  total: number;
  totalPages: number;
}

export function LeaveContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [data,    setData]    = useState<LeaveData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLeave = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    const res    = await fetch(`/api/leave?${params.toString()}`);
    const json   = await res.json();
    if (json.success) setData(json.data);
    setLoading(false);
  }, [searchParams]);

  useEffect(() => {
    fetchLeave();
  }, [fetchLeave]);

  const page       = Number(searchParams.get("page") ?? 1);
  const totalPages = data?.totalPages ?? 1;

  function changePage(next: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(next));
    router.push(`/leave?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Requests"
        description="Review and manage employee time-off requests"
        actions={
          <Link
            href="/leave/new"
            className={cn(buttonVariants(), "bg-emerald-600 hover:bg-emerald-700")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Submit Leave
          </Link>
        }
      />

      <LeaveFilters />

      {loading ? (
        <TableSkeleton rows={10} cols={5} />
      ) : !data || data.leaveRequests.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No leave requests"
          description="No leave requests match the current filters."
          action={{ label: "Submit Leave Request", onClick: () => router.push("/leave/new") }}
        />
      ) : (
        <div className="space-y-4">
          <LeaveTable leaveRequests={data.leaveRequests} onAction={fetchLeave} />

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>{data.total} total requests</span>
              <div className="flex gap-2">
                {page > 1 && (
                  <Button variant="outline" size="sm" onClick={() => changePage(page - 1)}>
                    Previous
                  </Button>
                )}
                {page < totalPages && (
                  <Button variant="outline" size="sm" onClick={() => changePage(page + 1)}>
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
