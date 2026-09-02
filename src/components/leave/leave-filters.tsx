"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { LEAVE_TYPE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function LeaveFilters() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null) params.delete(k);
      else params.set(k, v);
    });
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const hasFilters = searchParams.has("status") || searchParams.has("leaveType");

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex rounded-lg border bg-white p-1 gap-1">
        {(
          [
            { label: "All",      value: null },
            { label: "Pending",  value: "PENDING" },
            { label: "Approved", value: "APPROVED" },
            { label: "Rejected", value: "REJECTED" },
          ] as const
        ).map(({ label, value }) => {
          const active = (searchParams.get("status") ?? null) === value;
          return (
            <button
              key={label}
              onClick={() => updateParams({ status: value })}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <Select
        value={searchParams.get("leaveType") ?? "all"}
        onValueChange={(v) => updateParams({ leaveType: v === "all" ? null : v })}
      >
        <SelectTrigger className="w-44 bg-white" aria-label="Filter by leave type">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {Object.entries(LEAVE_TYPE_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => router.push(pathname)}>
          <X className="mr-1 h-3 w-3" />
          Clear
        </Button>
      )}
    </div>
  );
}
