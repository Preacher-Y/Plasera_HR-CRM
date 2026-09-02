"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-7 w-7 text-red-500" />
      </div>
      <h2 className="text-lg font-semibold text-slate-900">Failed to load this page</h2>
      <p className="text-sm text-slate-500 max-w-sm">
        There was a problem connecting to the database. Check your connection and try again.
      </p>
      <Button onClick={reset} variant="outline">
        Retry
      </Button>
    </div>
  );
}
